'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Input from '../ui/Input';
import Button from '../ui/Button';
import { useAuth } from '@/hooks/useAuth';

const LoginForm = () => {
  const router = useRouter();
  const { login, error: authError, isLoading: authLoading } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    
    // Clear errors when user types
    if (errors[name as keyof typeof errors]) {
      setErrors((prev) => ({
        ...prev,
        [name]: undefined,
      }));
    }
  };

  const validateForm = () => {
    const newErrors: typeof errors = {};
    
    if (!formData.email) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Email is invalid';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    console.log('Login attempt with:', formData.email);
    
    try {
      // For testing purposes, use test@example.com with any password
      if (formData.email === 'test@example.com') {
        console.log('Using test@example.com for easier testing');
        formData.password = 'anypassword'; // Override password for test account
      }
      // Hardcoded credentials for testing
      else if (formData.email === 'student@example.com' && formData.password === 'Password123') {
        console.log('Using hardcoded credentials for testing');
      }
      
      // Use the login function from useAuth
      await login(formData.email, formData.password);
      console.log('Login successful, redirecting to dashboard');
      
      // Verify user is in localStorage before redirecting
      if (typeof window !== 'undefined') {
        const storedUser = localStorage.getItem('user');
        console.log('User in localStorage before redirect:', storedUser);
      }
      
      // Add a small delay to ensure state is updated before redirect
      setTimeout(() => {
        // Redirect to dashboard on successful login
        // Using window.location.href instead of router.push for more reliable navigation
        window.location.href = '/dashboard';
      }, 1000); // Longer delay for testing
    } catch (error) {
      console.error('Login error:', error);
      setErrors({
        general: error instanceof Error ? error.message : 'Failed to login. Please check your credentials and try again.',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="bg-white dark:bg-gray-800 shadow-md rounded-lg px-8 pt-6 pb-8 mb-4">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">Login to RevoU LMS</h2>
        
        {errors.general && (
          <div className="mb-4 p-3 bg-red-50 text-red-700 rounded-md border border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800">
            {errors.general}
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <Input
              label="Email"
              type="email"
              name="email"
              id="email"
              placeholder="your.email@example.com"
              value={formData.email}
              onChange={handleChange}
              error={errors.email}
              fullWidth
              required
            />
          </div>
          
          <div className="mb-6">
            <Input
              label="Password"
              type="password"
              name="password"
              id="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={handleChange}
              error={errors.password}
              fullWidth
              required
            />
            
            <div className="mt-2 text-right">
              <Link 
                href="/forgot-password" 
                className="text-sm text-yellow-500 hover:text-yellow-400 dark:text-yellow-400 dark:hover:text-yellow-300"
              >
                Forgot password?
              </Link>
            </div>
          </div>
          
          <div className="mb-6">
            <Button
              type="submit"
              variant="primary"
              isLoading={isLoading}
              fullWidth
            >
              Sign In
            </Button>
          </div>
          
          <div className="text-center text-sm text-gray-600 dark:text-gray-400">
            Don't have an account?{' '}
            <Link 
              href="/register" 
              className="text-yellow-500 hover:text-yellow-400 dark:text-yellow-400 dark:hover:text-yellow-300"
            >
              Sign up
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;