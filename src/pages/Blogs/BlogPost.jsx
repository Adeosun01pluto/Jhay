// src/pages/Blog/BlogPost.jsx
import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase/firebase'; // Import your Firestore instance
import { ThreeDots } from 'react-loader-spinner'; // Import the loader

const BlogPost = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true); // State to track loading

  useEffect(() => {
    const fetchPost = async () => {
      try {
        const docRef = doc(db, 'blogs', id);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          setPost({ id: docSnap.id, ...docSnap.data() });
        } else {
          console.log('No such document!');
        }
      } catch (error) {
        console.error('Error fetching post:', error);
      } finally {
        setLoading(false); // Set loading to false once fetching is done
      }
    };

    fetchPost();
  }, [id]);

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

  if (!post) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-900 dark:bg-gray-800">
        <p className="text-white">Post not found</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-2xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="text-[#FF900D] hover:text-[#FF900D]/90 mb-4 dark:text-[#FF900D] dark:hover:text-[#FF900D]/90"
        >
          &larr; Back to Blog
        </button>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md p-6">
          <h1 className="text-4xl font-bold mb-4 text-gray-900 dark:text-white">{post.title}</h1>
          <p className="text-gray-600 dark:text-gray-300 mb-4">
            By {post.author} on {new Date(post.createdAt.toDate()).toLocaleDateString()}
          </p>
          <p className="text-gray-700 dark:text-gray-400">{post.content}</p>
        </div>
      </div>
    </div>
  );
};

export default BlogPost;
