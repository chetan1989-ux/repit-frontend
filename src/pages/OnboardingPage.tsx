
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();
  const [formData, setFormData] = useState({
    bio: '',
    profilePicture: '',
    interests: [] as string[],
    notificationPreferences: {
      email: true,
      push: true
    }
  });
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  
  const availableInterests = [
    'Technology', 'Science', 'Art', 'Music', 'Sports',
    'Books', 'Travel', 'Food', 'Fashion', 'Gaming',
    'Movies', 'Photography', 'Nature', 'Health', 'Business'
  ];

  useEffect(() => {
    // Check if user is verified
    const emailVerified = localStorage.getItem('emailVerified');
    const signupData = localStorage.getItem('signupData');
    
    if (!emailVerified || !signupData) {
      navigate('/signup');
      return;
    }
    
    setUserData(JSON.parse(signupData));
  }, [navigate]);

  const handleBioChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setFormData(prev => ({ ...prev, bio: e.target.value }));
  };

  const handleInterestToggle = (interest: string) => {
    setFormData(prev => {
      const interests = [...prev.interests];
      if (interests.includes(interest)) {
        return { ...prev, interests: interests.filter(i => i !== interest) };
      } else {
        return { ...prev, interests: [...interests, interest] };
      }
    });
  };

  const handleNotificationChange = (type: 'email' | 'push') => {
    setFormData(prev => ({
      ...prev,
      notificationPreferences: {
        ...prev.notificationPreferences,
        [type]: !prev.notificationPreferences[type]
      }
    }));
  };

  const nextStep = () => {
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // In a real app, this would send the combined user data to your backend
    setTimeout(() => {
      const completeUserData = {
        ...userData,
        ...formData,
        isOnboarded: true
      };
      
      // Store the complete user data
      localStorage.setItem('userData', JSON.stringify(completeUserData));
      
      // Login the user
      login({
        id: Math.random().toString(36).substr(2, 9),
        username: userData.username,
        fullName: userData.fullName,
        email: userData.email,
        isAuthenticated: true
      });
      
      // Navigate to home
      navigate('/');
      
      setIsSubmitting(false);
    }, 1500);
  };

  if (!userData) {
    return <div className="flex min-h-screen bg-gray-50 items-center justify-center">Loading...</div>;
  }

  return (
    <div className="flex min-h-screen bg-gray-50 items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-lg bg-white p-8 rounded-lg shadow-md">
        <div className="mb-8">
          <h2 className="text-center text-3xl font-bold tracking-tight text-gray-900">
            Complete Your Profile
          </h2>
          <div className="mt-2 flex justify-between">
            <div className={`w-1/2 h-1 ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`w-1/2 h-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          </div>
          <p className="mt-4 text-center text-sm text-gray-600">
            Step {step} of 2: {step === 1 ? 'Personal Information' : 'Preferences'}
          </p>
        </div>
        
        <form onSubmit={handleSubmit}>
          {step === 1 && (
            <div className="space-y-6">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleBioChange}
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                    placeholder="Tell us a bit about yourself..."
                  />
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Interests
                </label>
                <div className="mt-2 flex flex-wrap gap-2">
                  {availableInterests.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                        formData.interests.includes(interest)
                          ? 'bg-indigo-100 text-indigo-800'
                          : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                      }`}
                    >
                      {interest}
                      {formData.interests.includes(interest) && (
                        <span className="ml-1.5 text-indigo-600">✓</span>
                      )}
                    </button>
                  ))}
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  Select interests that you'd like to see content about
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Notification Preferences
                </label>
                <div className="mt-4 space-y-4">
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="email-notifications"
                        name="email-notifications"
                        type="checkbox"
                        checked={formData.notificationPreferences.email}
                        onChange={() => handleNotificationChange('email')}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="email-notifications" className="font-medium text-gray-700">
                        Email Notifications
                      </label>
                      <p className="text-gray-500">Receive updates and alerts via email</p>
                    </div>
                  </div>
                  
                  <div className="flex items-start">
                    <div className="flex items-center h-5">
                      <input
                        id="push-notifications"
                        name="push-notifications"
                        type="checkbox"
                        checked={formData.notificationPreferences.push}
                        onChange={() => handleNotificationChange('push')}
                        className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                      />
                    </div>
                    <div className="ml-3 text-sm">
                      <label htmlFor="push-notifications" className="ml-3 block text-sm font-medium text-gray-700">
                        Push Notifications
                      </label>
                      <p className="text-gray-500">Receive real-time notifications in the app</p>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex justify-center rounded-md border border-gray-300 bg-white py-2 px-4 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                >
                  {isSubmitting ? 'Completing...' : 'Complete Setup'}
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default OnboardingPage;
