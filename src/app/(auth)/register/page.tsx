import RegisterForm from '@/components/auth/RegisterForm';

export const metadata = {
  title: 'Register - RevoU LMS',
  description: 'Create a new account for RevoU Learning Management System',
};

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 dark:text-white">RevoU LMS</h1>
          <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
            Create a new account to start your learning journey
          </p>
        </div>
        <RegisterForm />
      </div>
    </div>
  );
}