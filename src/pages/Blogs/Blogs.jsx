// src/pages/Blog/Blog.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Import your Firestore instance
import useAuth from '../../hooks/useAuth'; // Custom hook to check authentication status
import { ThreeDots } from 'react-loader-spinner';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // State to track loading
  const { isAdmin } = useAuth(); // Check if the user is an admin

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, 'blogs'));
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setBlogPosts(posts);
        console.log(posts)
      } catch (error) {
        console.error('Error fetching posts:', error);
      }finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchPosts();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <ThreeDots
          visible={true}
          height="80"
          width="80"
          color="#FF900D"
          radius="9"
          ariaLabel="three-dots-loading"
          wrapperStyle={{}}
          wrapperClass=""
        />
      </div>
    );
  }


  const handleDelete = async (postId) => {
    try {
      await deleteDoc(doc(db, 'posts', postId));
      setBlogPosts((prevPosts) => prevPosts.filter((post) => post.id !== postId));
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-12">Blog Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4">{post.title}</h2>
              <p className="text-gray-600 mb-2">
                By {post.author} on {new Date(post.createdAt.toDate()).toLocaleDateString()}
              </p>
              <p className="text-gray-700">{post.content.substring(0, 100)}...</p>
              <button
                onClick={() => navigate(`/blog/${post.id}`)}
                className="mt-4 text-[#FF900D] hover:text-[#FF900D]/90 transition-colors"
              >
                Read More
              </button>
              {isAdmin && (
                <div className="mt-4">
                  <button
                    onClick={() => navigate(`/edit-blog/${post.id}`)}
                    className="mr-2 text-blue-600 hover:text-blue-800 transition-colors"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(post.id)}
                    className="text-red-600 hover:text-red-800 transition-colors"
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Blog;
