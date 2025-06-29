"use client";

import React, { useState, useEffect, createContext, useContext } from 'react';
import { User, UserRole } from '../types';

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: Partial<User>) => Promise<void>;
  logout: () => void;
  clearError: () => void;
}

// This would be replaced with actual API calls in a real application
const mockLogin = async (email: string, password: string): Promise<User> => {
  console.log('mockLogin called with:', email);
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (email === "admin@example.com" && password === "Password123") {
    const user = {
      id: "1",
      firstName: "Admin",
      lastName: "User",
      email: "admin@example.com",
      role: UserRole.ADMIN,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('mockLogin returning admin user:', user);
    return user;
  } else if (email === "mentor@example.com" && password === "Password123") {
    const user = {
      id: "2",
      firstName: "Mentor",
      lastName: "User",
      email: "mentor@example.com",
      role: UserRole.MENTOR,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('mockLogin returning mentor user:', user);
    return user;
  } else if (email === "student@example.com" && password === "Password123") {
    const user = {
      id: "3",
      firstName: "Student",
      lastName: "User",
      email: "student@example.com",
      role: UserRole.STUDENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    console.log('mockLogin returning student user:', user);
    return user;
  }

  console.log('mockLogin throwing error for invalid credentials');
  throw new Error("Invalid email or password");
};

// Mock registration function
const mockRegister = async (userData: Partial<User>): Promise<User> => {
  // Simulate API call delay
  await new Promise((resolve) => setTimeout(resolve, 1000));

  // Mock validation
  if (
    !userData.email ||
    !userData.password ||
    !userData.firstName ||
    !userData.lastName
  ) {
    throw new Error("All fields are required");
  }

  // In a real app, we would send this data to an API
  return {
    id: Math.random().toString(36).substring(2, 15),
    firstName: userData.firstName,
    lastName: userData.lastName,
    email: userData.email,
    role: userData.role || UserRole.STUDENT,
    createdAt: new Date(),
    updatedAt: new Date(),
  };
};

// Create the auth context with a default value to avoid undefined issues
export const AuthContext = createContext<AuthContextType>({
  user: null,
  isLoading: false,
  error: null,
  login: async () => { throw new Error('AuthContext not initialized'); },
  register: async () => { throw new Error('AuthContext not initialized'); },
  logout: () => { console.error('AuthContext not initialized'); },
  clearError: () => { console.error('AuthContext not initialized'); },
});

// Auth provider component
export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  console.log('AuthProvider initializing');
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Log when user state changes
  useEffect(() => {
    console.log('User state changed:', user);
  }, [user]);

  // Check for existing session on mount
  useEffect(() => {
    console.log('checkAuth effect running');
    
    // Ensure this effect runs only in the browser
    if (typeof window === 'undefined') {
      console.log('Window is not defined, skipping localStorage check (server-side)');
      setIsLoading(false);
      return;
    }
    
    // Function to check auth status
    const checkAuth = () => {
      try {
        console.log('Checking localStorage for user data');
        // In a real app, we would verify the token with the backend
        const storedUser = localStorage.getItem("user");
        console.log('Raw stored user from localStorage:', storedUser);
        
        if (storedUser) {
          try {
            const parsedUser = JSON.parse(storedUser);
            console.log('User parsed from localStorage:', parsedUser);
            
            // Set the user in state
            setUser(parsedUser);
            console.log('User state set from localStorage');
          } catch (parseError) {
            console.error('Error parsing user from localStorage:', parseError);
            localStorage.removeItem("user");
          }
        } else {
          console.log('No user found in localStorage');
        }
      } catch (err) {
        console.error("Auth check error:", err);
        // Clear potentially corrupted data
        localStorage.removeItem("user");
      } finally {
        setIsLoading(false);
      }
    };

    // Run the check immediately
    checkAuth();
    
    // Also set up a storage event listener to handle changes from other tabs/windows
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === 'user') {
        console.log('Storage event detected for user:', event.newValue);
        if (event.newValue) {
          try {
            setUser(JSON.parse(event.newValue));
          } catch (e) {
            console.error('Error parsing user from storage event:', e);
          }
        } else {
          setUser(null);
        }
      }
    };
    
    window.addEventListener('storage', handleStorageChange);
    
    // Clean up the event listener
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, []);

  // Login function
  const login = async (email: string, password: string) => {
    setIsLoading(true);
    setError(null);
    console.log('Login function called with:', email);

    try {
      // For testing purposes, use hardcoded credentials
      let userData;
      
      // Use hardcoded credentials for easier testing
      if (email === 'test@example.com') {
        console.log('Using hardcoded test user');
        userData = {
          id: "999",
          firstName: "Test",
          lastName: "User",
          email: "test@example.com",
          role: UserRole.STUDENT,
          createdAt: new Date(),
          updatedAt: new Date(),
        };
      } else {
        // Normal flow - call mockLogin
        userData = await mockLogin(email, password);
      }
      
      console.log('User data to be saved:', userData);
      
      // Set user in state
      setUser(userData);
      console.log('User state set to:', userData);
      
      // Check if localStorage is available (not in SSR)
      if (typeof window !== 'undefined') {
        try {
          const userString = JSON.stringify(userData);
          console.log('Saving to localStorage:', userString);
          localStorage.setItem("user", userString);
          
          // Verify the data was saved correctly
          const savedUser = localStorage.getItem("user");
          console.log('Verification - user in localStorage after saving:', savedUser);
          
          if (!savedUser) {
            console.error('Failed to save user to localStorage');
          }
        } catch (storageError) {
          console.error('Error saving to localStorage:', storageError);
        }
      } else {
        console.log('Window is not defined, skipping localStorage save');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError(
        err instanceof Error ? err.message : "An error occurred during login"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Register function
  const register = async (userData: Partial<User>) => {
    setIsLoading(true);
    setError(null);

    try {
      await mockRegister(userData);
      // In a real app, we might auto-login the user or redirect to login
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "An error occurred during registration"
      );
      throw err;
    } finally {
      setIsLoading(false);
    }
  };

  // Logout function
  const logout = () => {
    console.log('Logout function called');
    
    // Check if localStorage is available (not in SSR)
    if (typeof window !== 'undefined') {
      console.log('Removing user from localStorage');
      localStorage.removeItem("user");
      
      // Verify removal
      const userAfterRemoval = localStorage.getItem("user");
      console.log('User in localStorage after removal:', userAfterRemoval);
    }
    
    console.log('Setting user state to null');
    setUser(null);
    
    // Redirect to login page
    if (typeof window !== 'undefined') {
      console.log('Redirecting to login page');
      // Add a small delay to ensure state updates are processed
      setTimeout(() => {
        window.location.href = "/login";
      }, 100);
    }
  };

  // Clear error function
  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    isLoading,
    error,
    login,
    register,
    logout,
    clearError,
  };

  return React.createElement(AuthContext.Provider, { value }, children);
};

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  
  console.log('useAuth hook called, returning context with user:', context.user);
  
  // Since we now provide default values in createContext, this check is no longer needed
  // but we'll keep the logging for debugging purposes
  
  return context;
};