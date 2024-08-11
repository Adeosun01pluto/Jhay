import React, { useState } from 'react';
import { Tab } from '@headlessui/react';

function classNames(...classes) {
  return classes.filter(Boolean).join(' ')
}

const AuthPage = () => {
  const [selectedIndex, setSelectedIndex] = useState(0);

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center py-0 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Welcome to P2P Exchange
        </h2>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <Tab.Group selectedIndex={selectedIndex} onChange={setSelectedIndex}>
            <Tab.List className="flex p-1 space-x-1 bg-gray-200 rounded-xl">
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 text-sm leading-5 font-medium text-gray-700 rounded-lg',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-200 ring-white ring-opacity-60',
                    selected
                      ? 'bg-white shadow'
                      : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'
                  )
                }
              >
                Sign Up
              </Tab>
              <Tab
                className={({ selected }) =>
                  classNames(
                    'w-full py-2.5 text-sm leading-5 font-medium text-gray-700 rounded-lg',
                    'focus:outline-none focus:ring-2 ring-offset-2 ring-offset-gray-200 ring-white ring-opacity-60',
                    selected
                      ? 'bg-white shadow'
                      : 'text-gray-500 hover:bg-white/[0.12] hover:text-gray-700'
                  )
                }
              >
                Login
              </Tab>
            </Tab.List>
            <Tab.Panels className="mt-2">
              <Tab.Panel>
                <form className="space-y-6" action="#" method="POST">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF900D] hover:bg-[#e68200] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF900D]"
                    >
                      Sign up
                    </button>
                  </div>
                </form>
              </Tab.Panel>
              <Tab.Panel>
                <form className="space-y-6" action="#" method="POST">
                  <div>
                    <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                      Email address
                    </label>
                    <div className="mt-1">
                      <input
                        id="email"
                        name="email"
                        type="email"
                        autoComplete="email"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div>
                    <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                      Password
                    </label>
                    <div className="mt-1">
                      <input
                        id="password"
                        name="password"
                        type="password"
                        autoComplete="current-password"
                        required
                        className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-[#FF900D] focus:border-[#FF900D] sm:text-sm"
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <input
                        id="remember-me"
                        name="remember-me"
                        type="checkbox"
                        className="h-4 w-4 text-[#FF900D] focus:ring-[#FF900D] border-gray-300 rounded"
                      />
                      <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-900">
                        Remember me
                      </label>
                    </div>

                    <div className="text-sm">
                      <a href="#" className="font-medium text-[#FF900D] hover:text-[#e68200]">
                        Forgot your password?
                      </a>
                    </div>
                  </div>

                  <div>
                    <button
                      type="submit"
                      className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#FF900D] hover:bg-[#e68200] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#FF900D]"
                    >
                      Sign in
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