
import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';

const SignupPage: React.FC = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    username: ''
  });
  
  const [errors, setErrors] = useState({
    fullName: '',
    email: '',
    dateOfBirth: '',
    username: ''
  });
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [generatedUsername, setGeneratedUsername] = useState('');

  // Generate a username when email changes
  useEffect(() => {
    if (formData.email && formData.fullName) {
      // Create a username from email prefix and first name
      const emailPrefix = formData.email.split('@')[0];
      const firstName = formData.fullName.split(' ')[0].toLowerCase();
      const randomSuffix = Math.floor(Math.random() * 1000);
      
      const newUsername = `${emailPrefix}_${firstName}${randomSuffix}`.replace(/[^a-z0-9_\.]/gi, '');
      setGeneratedUsername(newUsername);
      
      // Set it as the username if the user hasn't entered one yet
      if (!formData.username) {
        setFormData(prev => ({ ...prev, username: newUsername }));
      }
    }
  }, [formData.email, formData.fullName]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };
    
    // Validate full name
    if (!formData.fullName) {
      newErrors.fullName = 'Full name is required';
      valid = false;
    } else if (formData.fullName.length > 50) {
      newErrors.fullName = 'Full name must be less than 50 characters';
      valid = false;
    }
    
    // Validate email
    if (!formData.email) {
      newErrors.email = 'Email is required';
      valid = false;
    } else if (!/^[a-zA-Z0-9_.+-]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
      valid = false;
    } else if (formData.email.length > 100) {
      newErrors.email = 'Email must be less than 100 characters';
      valid = false;
    }
    
    // Validate date of birth
    if (!formData.dateOfBirth) {
      newErrors.dateOfBirth = 'Date of birth is required';
      valid = false;
    } else {
      const birthDate = new Date(formData.dateOfBirth);
      const today = new Date();
      const age = today.getFullYear() - birthDate.getFullYear();
      
      if (age < 0) {
        newErrors.dateOfBirth = 'Please enter a valid date of birth';
        valid = false;
      }
    }
    
    // Validate username
    if (!formData.username) {
      newErrors.username = 'Username is required';
      valid = false;
    } else if (formData.username.length < 5) {
      newErrors.username = 'Username must be at least 5 characters';
      valid = false;
    } else if (!/^[a-zA-Z0-9_\.]+$/.test(formData.username)) {
      newErrors.username = 'Username can only contain letters, numbers, underscores, and periods';
      valid = false;
    }
    
    setErrors(newErrors);
    return valid;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    // In a real app, this would go to your backend API
    setTimeout(() => {
      // Store signup data for the next steps
      localStorage.setItem('signupData', JSON.stringify(formData));
      
      // Navigate to verification page
      navigate('/verify-email');
      
      setIsSubmitting(false);
    }, 1500);
  };

  function getAgeFromDOB(dob: string): number {
    const birthDate = new Date(dob);
    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age--;
    }
    
    return age;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8 bg-white p-8 rounded-lg shadow-md">
        <div>
          <h2 className="mt-6 text-center text-3xl font-bold tracking-tight text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
              Sign in
            </Link>
          </p>
        </div>
        
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label htmlFor="fullName" className="block text-sm font-medium text-gray-700">
                Full Name*
              </label>
              <div className="mt-1">
                <input
                  id="fullName"
                  name="fullName"
                  type="text"
                  required
                  value={formData.fullName}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.fullName ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="John Doe"
                />
                {errors.fullName && (
                  <p className="mt-1 text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address*
              </label>
              <div className="mt-1">
                <input
                  id="email"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  value={formData.email}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder="john@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700">
                Date of Birth*
              </label>
              <div className="mt-1">
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  required
                  value={formData.dateOfBirth}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.dateOfBirth ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                />
                {errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-600">{errors.dateOfBirth}</p>
                )}
                {formData.dateOfBirth && getAgeFromDOB(formData.dateOfBirth) < 18 && (
                  <p className="mt-1 text-sm text-amber-600">
                    Note: Users under 18 will have limited access to certain content.
                  </p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                Username*
              </label>
              <div className="mt-1">
                <input
                  id="username"
                  name="username"
                  type="text"
                  required
                  value={formData.username}
                  onChange={handleChange}
                  className={`appearance-none block w-full px-3 py-2 border ${
                    errors.username ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  placeholder={generatedUsername || "username"}
                />
                {errors.username && (
                  <p className="mt-1 text-sm text-red-600">{errors.username}</p>
                )}
                <p className="mt-1 text-xs text-gray-500">
                  Username must be at least 5 characters and can only contain letters, numbers, underscores, and periods.
                </p>
              </div>
            </div>
          </div>
          
          <div>
            <button
              type="submit"
              disabled={isSubmitting}
              className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
            >
              {isSubmitting ? 'Creating Account...' : 'Create Account'}
            </button>
          </div>
          
          <div className="text-xs text-gray-500 mt-4">
            By creating an account, you agree to our Terms of Service and Privacy Policy.
          </div>
        </form>
      </div>
    </div>
  );
};

export default SignupPage;
