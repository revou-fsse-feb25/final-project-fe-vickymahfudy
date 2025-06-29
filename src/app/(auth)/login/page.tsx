import LoginForm from '@/components/auth/LoginForm';

export const metadata = {
  title: 'Login - RevoU LMS',
  description: 'Login to access your RevoU Learning Management System account',
};

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">RevoU LMS</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Sign in to your account to access your learning materials
          </p>
        </div>
        <LoginForm />
      </div>
    </div>
  );
}