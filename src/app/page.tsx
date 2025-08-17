import { ThemeToggle } from "../contexts/ThemeContext";
import { Icons } from "../components/ui/icons";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Header */}
      <header className="bg-white dark:bg-gray-800 shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4 lg:py-6">
            <div className="flex items-center space-x-2 sm:space-x-3">
              <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center bg-gradient-to-r from-primary to-secondary shadow-lg">
                <span className="text-lg sm:text-xl font-bold text-white">R</span>
              </div>
              <h1 className="text-xl sm:text-2xl font-bold text-gray-800 dark:text-white">Revou LMS</h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <nav className="hidden lg:flex items-center space-x-8">
                <a href="#features" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-medium">
                   Features
                 </a>
                 <a href="#about" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-medium">
                   About
                 </a>
                 <a href="#contact" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-medium">
                   Contact
                 </a>
                 <div className="flex items-center space-x-3 ml-6">
                   <a href="/login" className="text-gray-700 dark:text-gray-300 hover:text-primary transition-colors font-medium">Login</a>
                   <a href="/signup" className="px-4 py-2 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">Sign Up</a>
                 </div>
              </nav>
              <ThemeToggle />
              <div className="lg:hidden flex items-center space-x-2 sm:space-x-3">
                <a href="/login" className="text-gray-600 dark:text-gray-400 hover:text-primary text-xs sm:text-sm font-medium">Login</a>
                <a href="/signup" className="px-2 py-1 sm:px-3 sm:py-1.5 rounded-xl text-xs sm:text-sm font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 transform hover:scale-105 shadow-md hover:shadow-lg">Sign Up</a>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6 leading-tight">
               Digital Learning
               <span className="bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent"> Platform</span>
             </h2>
             <p className="text-base sm:text-lg lg:text-xl text-gray-600 dark:text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
               Develop your digital and technology skills with our comprehensive and interactive online learning platform.
             </p>
            <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center items-center max-w-md sm:max-w-none mx-auto">
              <button className="w-full sm:w-auto px-6 sm:px-8 py-3 rounded-xl font-semibold text-white bg-gradient-to-r from-primary to-secondary hover:from-primary/90 hover:to-secondary/90 transition-all duration-200 transform hover:scale-105 shadow-lg hover:shadow-xl">
                 Start Learning
               </button>
               <button className="w-full sm:w-auto px-6 sm:px-8 py-3 border-2 border-secondary text-secondary rounded-xl font-semibold hover:bg-gradient-to-r hover:from-secondary hover:to-secondary/80 hover:text-white transition-all duration-200 transform hover:scale-105">
                 Learn More
               </button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-12 sm:py-16 lg:py-20 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 sm:mb-16">
             <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4">Key Features</h3>
             <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto px-4">
               Learning platform designed to provide the best learning experience
             </p>
           </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-purple-100 to-purple-200 shadow-lg">
                 <svg className="w-8 h-8 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C20.832 18.477 19.246 18 17.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h4 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">Structured Curriculum</h4>
               <p className="text-gray-600 dark:text-gray-300">
                 Learning materials organized systematically and easy to understand
               </p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-primary/20 to-secondary/20 shadow-lg">
                 <svg className="w-8 h-8 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Experienced Mentors</h4>
               <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                 Learn directly from experienced industry practitioners
               </p>
            </div>
            <div className="text-center p-4 sm:p-6">
              <div className="w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 bg-gradient-to-br from-success/20 to-primary/20 shadow-lg">
                 <svg className="w-8 h-8 text-success" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-2">Official Certificate</h4>
               <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300">
                 Get industry-recognized certificates after completing programs
               </p>
            </div>
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-12 sm:py-16 lg:py-20 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 sm:gap-12 items-center">
            <div className="order-2 lg:order-1">
               <h3 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">About Revou LMS</h3>
               <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                 Revou LMS is an online learning platform specifically designed to develop 
                 digital and technology skills. We provide comprehensive and 
                 up-to-date curriculum aligned with industry needs.
               </p>
               <p className="text-sm sm:text-base text-gray-600 dark:text-gray-300 mb-4 sm:mb-6">
                 With interactive and practical learning methods, we help you master 
                 cutting-edge technology and prepare for careers in the digital era.
               </p>
              <ul className="space-y-3">
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Flexible learning according to your schedule
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Practical projects and real case studies
                </li>
                <li className="flex items-center text-gray-600 dark:text-gray-300">
                  <svg className="w-5 h-5 text-green-500 mr-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Active learning community
                </li>
              </ul>
            </div>
            <div className="order-1 lg:order-2 bg-white dark:bg-gray-800 p-6 sm:p-8 rounded-xl shadow-lg">
              <h4 className="text-lg sm:text-xl font-semibold text-gray-900 dark:text-white mb-4 sm:mb-6 text-center lg:text-left">Platform Statistics</h4>
              <div className="space-y-3 sm:space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Total Students</span>
                   <span className="text-xl sm:text-2xl font-bold text-primary">10,000+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Available Courses</span>
                   <span className="text-xl sm:text-2xl font-bold text-primary">50+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Expert Mentors</span>
                   <span className="text-xl sm:text-2xl font-bold text-primary">25+</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm sm:text-base text-gray-600 dark:text-gray-300">Satisfaction Rate</span>
                   <span className="text-xl sm:text-2xl font-bold text-primary">98%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 dark:bg-gray-950 text-white py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
            <div className="sm:col-span-2 lg:col-span-1">
               <h5 className="text-lg sm:text-xl font-bold mb-3 sm:mb-4 text-primary">Revou LMS</h5>
               <p className="text-sm sm:text-base text-gray-400 dark:text-gray-500 mb-3 sm:mb-4">
                 Digital learning platform for developing technology skills.
               </p>
               <div className="flex space-x-4">
                 <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors text-xl">
                   <span className="sr-only">Facebook</span>
                   <Icons.Facebook className="w-5 h-5" />
                 </a>
                 <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors text-xl">
                   <span className="sr-only">Twitter</span>
                   <Icons.Twitter className="w-5 h-5" />
                 </a>
                 <a href="#" className="text-gray-400 dark:text-gray-500 hover:text-primary transition-colors text-xl">
                     <span className="sr-only">LinkedIn</span>
                     <Icons.LinkedIn className="w-5 h-5" />
                   </a>
               </div>
             </div>
            
            <div>
               <h6 className="text-xs sm:text-sm font-semibold text-gray-300 dark:text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">Courses</h6>
               <ul className="space-y-1 sm:space-y-2">
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">Software Engineering</a></li>
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">Full Stack Development</a></li>
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">Digital Marketing</a></li>
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">Data Analytics</a></li>
               </ul>
             </div>
            
            <div>
               <h6 className="text-xs sm:text-sm font-semibold text-gray-300 dark:text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">Support</h6>
               <ul className="space-y-1 sm:space-y-2">
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">Help Center</a></li>
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">Contact Us</a></li>
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">FAQ</a></li>
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">Community</a></li>
               </ul>
             </div>
            
            <div>
               <h6 className="text-xs sm:text-sm font-semibold text-gray-300 dark:text-gray-400 uppercase tracking-wider mb-3 sm:mb-4">Company</h6>
               <ul className="space-y-1 sm:space-y-2">
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">About Us</a></li>
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">Careers</a></li>
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">Privacy Policy</a></li>
                 <li><a href="#" className="text-sm sm:text-base text-gray-400 dark:text-gray-500 hover:text-primary transition-colors">Terms of Service</a></li>
               </ul>
             </div>
          </div>
          
          <div className="border-t border-gray-800 dark:border-gray-700 mt-6 sm:mt-8 pt-6 sm:pt-8 text-center">
             <p className="text-xs sm:text-sm text-gray-400 dark:text-gray-500">&copy; 2024 Revou LMS. All rights reserved.</p>
           </div>
        </div>
      </footer>
    </div>
  );
}
