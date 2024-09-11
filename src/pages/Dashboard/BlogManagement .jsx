import React, { useState, useEffect } from 'react';
import { collection, addDoc, getDocs, deleteDoc, doc, serverTimestamp } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebase'; // Adjust the import path as needed
import { useAuthState } from 'react-firebase-hooks/auth';
import { ThreeDots } from 'react-loader-spinner';

const BlogManagement = () => {
  const [user] = useAuthState(auth);
  const [blogPost, setBlogPost] = useState({ title: '', content: '' });
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchBlogs = async () => {
      setLoading(true)
      try {
        const blogsSnapshot = await getDocs(collection(db, 'blogs'));
        setBlogs(blogsSnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id })));
      } catch (error) {
        console.log(error)
      } finally{
        setLoading(false)
      }
    };
    fetchBlogs();
  }, []);

  const handleBlogSubmit = async (e) => {
    e.preventDefault();
    if (!user) return;
    try {
      await addDoc(collection(db, 'blogs'), {
        title: blogPost.title,
        content: blogPost.content,
        author: user.email,
        createdAt: serverTimestamp(),
      });
      setBlogPost({ title: '', content: '' });
      alert('Blog post submitted successfully.');
    } catch (error) {
      console.error('Error adding blog post: ', error);
    }
  };

  const handleDeleteBlog = async (id) => {
    try {
      await deleteDoc(doc(db, 'blogs', id));
      setBlogs(blogs.filter(blog => blog.id !== id));
    } catch (error) {
      console.error('Error deleting blog post: ', error);
    }
  };
  if (loading) return <div className="text-center w-[100%] flex items-center justify-center">
    <ThreeDots
      visible={true}
      height="100"
      width="100"
      color="#FF900D"
      ariaLabel="three-circles-loading"
      wrapperStyle={{}}
      wrapperClass=""
      />
  </div>;

  return (
    <div className="bg-white dark:bg-gray-900 shadow rounded-lg p-4">
      <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">Post a New Blog</h2>
      <form onSubmit={handleBlogSubmit} className="space-y-4">
        <input
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          placeholder="Blog Title"
          value={blogPost.title}
          onChange={(e) => setBlogPost({ ...blogPost, title: e.target.value })}
        />
        <textarea
          className="w-full p-2 border rounded dark:bg-gray-800 dark:border-gray-700 dark:text-gray-300"
          placeholder="Blog Content"
          rows={6}
          value={blogPost.content}
          onChange={(e) => setBlogPost({ ...blogPost, content: e.target.value })}
        />
        <button
          type="submit"
          className="bg-[#FF900D]/60 text-white px-4 py-2 rounded hover:bg-[#FF900D]/70 dark:bg-[#FF900D]/50 dark:hover:bg-[#FF900D]/40"
        >
          Post Blog
        </button>
      </form>
      <div className="mt-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-800 dark:text-gray-100">All Blogs</h2>
        {blogs.map((blog) => (
          <div key={blog.id} className="bg-gray-100 dark:bg-gray-800 p-4 mb-4 rounded-md shadow-sm">
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-100">{blog.title}</h3>
            <p className="text-gray-700 dark:text-gray-300">{blog.content}</p>
            <p className="text-sm text-gray-600 dark:text-gray-400">Author: {blog.author}</p>
            <button
              className="bg-red-100 text-red-800 px-2 py-1 rounded text-sm mt-2 dark:bg-red-600 dark:text-red-100"
              onClick={() => handleDeleteBlog(blog.id)}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BlogManagement;
