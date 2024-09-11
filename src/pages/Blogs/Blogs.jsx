// src/pages/Blog/Blog.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Import your Firestore instance
import useAuth from '../../hooks/useAuth'; // Custom hook to check authentication status
import { ThreeDots } from 'react-loader-spinner';
import Modal from '../../components/Modal';

const Blog = () => {
  const [blogPosts, setBlogPosts] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [postToDelete, setPostToDelete] = useState(null);
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
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchPosts();
  }, []);


  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-800">
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

  const handleDelete = async () => {
    try {
      await deleteDoc(doc(db, 'blogs', postToDelete));
      setBlogPosts((prevPosts) => prevPosts.filter((post) => post.id !== postToDelete));
      setIsModalOpen(false);
    } catch (error) {
      console.error('Error deleting post:', error);
    }
  };

  const openModal = (postId) => {
    setPostToDelete(postId);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setPostToDelete(null);
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-6 md:mb-12 text-gray-900 dark:text-white">Posts</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 md:gap-8">
          {blogPosts.map((post) => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">{post.title}</h2>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                By {post.author} on {new Date(post.createdAt.toDate()).toLocaleDateString()}
              </p>
              <p className="text-gray-700 dark:text-gray-400">{post.content.substring(0, 100)}...</p>
              <button
                onClick={() => navigate(`/blog/${post.id}`)}
                className="mt-4 text-[#FF900D] hover:text-[#FF900D]/90 transition-colors"
              >
                Read More
              </button>
              {isAdmin && (
                <div className="mt-4">
                  {/* <button
                    onClick={() => navigate(`/edit-blog/${post.id}`)}
                    className="mr-2 text-[#FF900D] hover:text-[#FF900D]/50 transition-colors"
                  >
                    Edit
                  </button> */}
                  <button
                    onClick={() => openModal(post.id)}
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
      <Modal
        isOpen={isModalOpen} onClose={closeModal} onConfirm={handleDelete} />
    </div>
  );
};

export default Blog;
