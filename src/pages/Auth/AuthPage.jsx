import React, { useState } from 'react';
import { Tab } from '@headlessui/react';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signInWithPopup } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import { auth, db, googleProvider } from '../../firebase/firebase';
import { doc, getDoc, setDoc } from 'firebase/firestore';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

const AuthPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [selectedIndex, setSelectedIndex] = useState(0);
  const navigate = useNavigate();

  const signUp = async () => {
    setErrorMessage('');
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      await setDoc(doc(db, 'users', user.uid), {
        email: user.email,
        bio: "",
        name: "",
        photoUrl: "",
        phoneNumber: "",
        isAdmin: false,
      });

      console.log('User signed up:', email);
      setSelectedIndex(1); // Switch to the login tab after signing up
    } catch (error) {
      console.log('Error signing up:', error.message);
      setErrorMessage(error.message);
    }
  };

  const signInWithEmail = async () => {
    setErrorMessage('');
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      console.log('User signed in:', email);
      navigate('/tokens'); // Redirect to tokens route after signing in
    } catch (error) {
      console.error('Error signing in:', error.message);
      setErrorMessage(error.message);
    }
  };

  const signInWithGoogle = async () => {
    setErrorMessage('');
    try {
      const result = await signInWithPopup(auth, googleProvider);
      const user = result.user;
      console.log(user)

      const userDocRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userDocRef);

      if (!userDoc.exists()) {
        await setDoc(userDocRef, {
          email: user.email,
          bio: "",
          name: user.displayName,
          photoUrl: user.photoURL,
          phoneNumber: "",
          isAdmin: false,
        });
      }

      console.log('Signed in with Google');
      navigate('/tokens'); // Redirect to tokens route after signing in
    } catch (error) {
      console.error('Error signing in with Google:', error.message);
      setErrorMessage(error.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900 flex flex-col justify-center py-0 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900 dark:text-gray-100">
          Welcome to P2P Exchange
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white dark:bg-gray-800 py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex p-1 space-x-1 bg-gray-200 dark:bg-gray-700 rounded-xl">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 text-sm leading-5 font-medium text-gray-700 dark:text-gray-300 rounded-lg',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-200 dark:ring-offset-gray-800 ring-white ring-opacity-60',
                    selected
                      ? 'bg-white dark:bg-gray-800 shadow'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-300'
                  )
                }
              >
                Sign Up
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 text-sm leading-5 font-medium text-gray-700 dark:text-gray-300 rounded-lg',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-200 dark:ring-offset-gray-800 ring-white ring-opacity-60',
                    selected
                      ? 'bg-white dark:bg-gray-800 shadow'
                      : 'text-gray-500 dark:text-gray-400 hover:bg-white/[0.12] hover:text-gray-700 dark:hover:bg-gray-600 dark:hover:text-gray-300'
                  )
                }
              >
                Login
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="text-red-500 dark:text-red-400 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <div>
                    <button
                      type="button"
                      onClick={signUp}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF900D] hover:bg-[#e68200] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF900D]"
                    >
                      Sign up
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                    >
                      Sign up with Google
                    </button>
                  </div>
                </form>
              </Tab.Panel>
              <Tab.Panel>
                <form className="space-y-6" onSubmit={(e) => e.preventDefault()}>
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        onChange={(e) => setPassword(e.target.value)}
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                      />
                    </div>
                  </div>

                  {errorMessage && (
                    <div className="text-red-500 dark:text-red-400 text-sm">
                      {errorMessage}
                    </div>
                  )}

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#FF900D] focus:ring-[#FF900D] border-gray-300 dark:border-gray-600 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900 dark:text-gray-100">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-[#FF900D] hover:text-[#e68200] dark:text-[#FF900D] dark:hover:text-[#e68200]">
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="button"
                      onClick={signInWithEmail}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF900D] hover:bg-[#e68200] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF900D]"
                    >
                      Sign in
                    </button>
                  </div>
                  <div className="mt-4">
                    <button
                      type="button"
                      onClick={signInWithGoogle}
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-red-500 hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-400"
                    >
                      Sign in with Google
                    </button>
                  </div>
                </form>
              </Tab.Panel>
            </Tab.Panels>
          </Tab.Group>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;
