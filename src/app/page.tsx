import Link from 'next/link';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* Navigation */}
      <header className="bg-white shadow-md dark:bg-gray-900 sticky top-0 z-50">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8" aria-label="Top">
          <div className="w-full py-4 flex items-center justify-between">
            <div className="flex items-center">
              <Link href="/" className="text-2xl font-bold text-yellow-600 dark:text-yellow-400 hover:text-yellow-700 dark:hover:text-yellow-300 transition-colors duration-200">
                RevoU LMS
              </Link>
            </div>
            <div className="ml-10 space-x-4">
              <Link
                href="/login"
                className="inline-block bg-white py-2 px-5 border border-yellow-200 rounded-lg text-base font-medium text-yellow-600 hover:bg-yellow-50 hover:border-yellow-300 transition-all duration-200 dark:bg-gray-800 dark:text-yellow-400 dark:border-gray-700 dark:hover:bg-gray-700"
              >
                Sign in
              </Link>
              <Link
                href="/register"
                className="inline-block bg-yellow-600 py-2 px-5 border border-transparent rounded-lg text-base font-medium text-white hover:bg-yellow-700 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                Sign up
              </Link>
            </div>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="flex-grow">
        <div className="relative">
          <div className="absolute inset-x-0 bottom-0 h-1/2 bg-gray-100 dark:bg-gray-800"></div>
          <div className="max-w-7xl mx-auto sm:px-6 lg:px-8">
            <div className="relative shadow-xl sm:rounded-2xl sm:overflow-hidden">
              <div className="absolute inset-0">
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-700 to-amber-500 mix-blend-multiply"></div>
              </div>
              <div className="relative px-4 py-20 sm:px-6 sm:py-28 lg:py-36 lg:px-8">
                <h1 className="text-center text-4xl font-extrabold tracking-tight sm:text-5xl lg:text-6xl">
                  <span className="block text-white drop-shadow-md">RevoU Learning</span>
                  <span className="block text-yellow-100 mt-2">Management System</span>
                </h1>
                <p className="mt-8 max-w-lg mx-auto text-center text-xl text-white sm:max-w-2xl leading-relaxed">
                  A comprehensive platform designed to facilitate the delivery and management of learning content.
                </p>
                <div className="mt-12 max-w-sm mx-auto sm:max-w-none sm:flex sm:justify-center">
                  <div className="space-y-4 sm:space-y-0 sm:mx-auto sm:inline-grid sm:grid-cols-2 sm:gap-6">
                    <Link
                      href="/register"
                      className="flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg shadow-lg text-yellow-800 bg-white hover:bg-yellow-50 transition-all duration-200 sm:px-10 transform hover:-translate-y-1"
                    >
                      Get started
                    </Link>
                    <Link
                      href="/login"
                      className="flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg shadow-lg text-white bg-yellow-600 hover:bg-yellow-700 transition-all duration-200 sm:px-10 transform hover:-translate-y-1"
                    >
                      Sign in
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-50 dark:bg-gray-800 py-20 sm:py-28">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="lg:text-center">
              <h2 className="inline-block px-3 py-1 text-sm text-yellow-600 dark:text-yellow-400 font-semibold tracking-wide uppercase bg-yellow-100 dark:bg-yellow-900 dark:bg-opacity-20 rounded-full mb-3">Features</h2>
              <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
                Everything you need for effective learning
              </p>
              <p className="mt-6 max-w-2xl text-xl text-gray-600 dark:text-gray-300 lg:mx-auto leading-relaxed">
                Our platform provides a comprehensive set of tools for students, mentors, and administrators.
              </p>
            </div>

            <div className="mt-16">
              <div className="space-y-12 md:space-y-0 md:grid md:grid-cols-2 md:gap-x-12 md:gap-y-16">
                <div className="relative p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
                  <div className="absolute -top-6 flex items-center justify-center h-14 w-14 rounded-full bg-yellow-500 text-white shadow-lg">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-xl leading-6 font-semibold text-gray-900 dark:text-white">Comprehensive Module Management</h3>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      Create, organize, and manage modules with ease. Upload materials, set assignments, and track progress.
                    </p>
                  </div>
                </div>

                <div className="relative p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
                  <div className="absolute -top-6 flex items-center justify-center h-14 w-14 rounded-full bg-yellow-500 text-white shadow-lg">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
                    </svg>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-xl leading-6 font-semibold text-gray-900 dark:text-white">Interactive Learning Experience</h3>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      Engage with module materials, participate in discussions, and track your progress visually.
                    </p>
                  </div>
                </div>

                <div className="relative p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
                  <div className="absolute -top-6 flex items-center justify-center h-14 w-14 rounded-full bg-yellow-500 text-white shadow-lg">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-xl leading-6 font-semibold text-gray-900 dark:text-white">Communication Tools</h3>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      Stay connected with discussion forums, announcements, direct messaging, and notifications.
                    </p>
                  </div>
                </div>

                <div className="relative p-6 bg-white dark:bg-gray-900 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 border border-gray-100 dark:border-gray-800">
                  <div className="absolute -top-6 flex items-center justify-center h-14 w-14 rounded-full bg-yellow-500 text-white shadow-lg">
                    <svg className="h-7 w-7" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="mt-3">
                    <h3 className="text-xl leading-6 font-semibold text-gray-900 dark:text-white">Schedule Management</h3>
                    <p className="mt-4 text-base text-gray-600 dark:text-gray-300 leading-relaxed">
                      Create and view lecture schedules, track attendance, and receive reminders for upcoming sessions.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
          <div className="max-w-7xl mx-auto py-16 px-4 sm:px-6 lg:py-24 lg:px-8 lg:flex lg:items-center lg:justify-between rounded-2xl shadow-inner">
            <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white sm:text-4xl">
              <span className="block mb-2">Ready to dive in?</span>
              <span className="block text-yellow-500 text-shadow">Start your learning journey today.</span>
            </h2>
            <div className="mt-10 flex flex-col sm:flex-row gap-4 lg:mt-0 lg:flex-shrink-0">
              <div className="inline-flex rounded-md shadow-lg">
                <Link href="/signup" className="inline-flex items-center justify-center px-6 py-4 border border-transparent text-base font-medium rounded-lg text-white bg-yellow-500 hover:bg-yellow-600 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                  Get started
                </Link>
              </div>
              <div className="inline-flex rounded-md shadow-lg">
                <Link href="/signin" className="inline-flex items-center justify-center px-6 py-4 border border-gray-200 dark:border-gray-700 text-base font-medium rounded-lg text-yellow-600 dark:text-yellow-500 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-300 transform hover:-translate-y-1 hover:shadow-xl">
                  Sign in
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800">
        <div className="max-w-7xl mx-auto py-12 px-4 overflow-hidden sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-8">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-xl font-bold text-yellow-500">RevoU</span>
              <span className="ml-2 text-gray-700 dark:text-gray-300">LMS</span>
            </div>
            <nav className="flex flex-wrap justify-center" aria-label="Footer">
              <div className="px-5 py-2">
                <Link href="#" className="text-base text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors duration-300">
                  About
                </Link>
              </div>

              <div className="px-5 py-2">
                <Link href="#" className="text-base text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors duration-300">
                  Features
                </Link>
              </div>

              <div className="px-5 py-2">
                <Link href="#" className="text-base text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors duration-300">
                  Privacy
                </Link>
              </div>

              <div className="px-5 py-2">
                <Link href="#" className="text-base text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors duration-300">
                  Terms
                </Link>
              </div>

              <div className="px-5 py-2">
                <Link href="#" className="text-base text-gray-600 hover:text-yellow-500 dark:text-gray-400 dark:hover:text-yellow-400 transition-colors duration-300">
                  Contact
                </Link>
              </div>
            </nav>
          </div>
          <div className="border-t border-gray-200 dark:border-gray-800 pt-8">
            <p className="text-center text-base text-gray-500 dark:text-gray-400">
              &copy; {new Date().getFullYear()} RevoU, Inc. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
