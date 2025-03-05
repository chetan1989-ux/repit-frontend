
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Cropper from 'react-easy-crop';
import { Area as CropArea } from 'react-easy-crop';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login, user } = useUser();
  const [formData, setFormData] = useState({
    bio: '',
    mobileNumber: '',
    gender: '',
    interests: [] as string[]
  });
  
  // Profile image states
  const [imageSrc, setImageSrc] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState<CropArea | null>(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [showCropper, setShowCropper] = useState(false);
  
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [userData, setUserData] = useState<any>(null);
  const [errors, setErrors] = useState({
    bio: '',
    mobileNumber: '',
    gender: '',
    profileImage: ''
  });
  
  const availableInterests = [
    'Technology', 'Science', 'Art', 'Music', 'Sports',
    'Books', 'Travel', 'Food', 'Fashion', 'Gaming',
    'Movies', 'Photography', 'Nature', 'Health', 'Business'
  ];

  const genderOptions = [
    { value: 'male', label: 'Male' },
    { value: 'female', label: 'Female' },
    { value: 'non-binary', label: 'Non-Binary' },
    { value: 'prefer-not-to-say', label: 'Prefer not to say' }
  ];
  
  // Get user info from localStorage
  React.useEffect(() => {
    const storedData = localStorage.getItem('signupData');
    if (storedData) {
      try {
        const parsedData = JSON.parse(storedData);
        setUserData(parsedData);
      } catch (err) {
        console.error("Failed to parse user data:", err);
      }
    } else {
      // Redirect if no user data is found
      // navigate('/signup');
    }
  }, [navigate]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    
    // Clear error when user types
    if (errors[name as keyof typeof errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
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
  
  const handleImageSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.onload = () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  
  const onCropComplete = useCallback((croppedArea: CropArea, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);
  
  const getCroppedImage = useCallback(async () => {
    if (!imageSrc || !croppedAreaPixels) return null;
    
    try {
      const image = new Image();
      image.src = imageSrc;
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return null;
      
      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;
      
      ctx.drawImage(
        image,
        croppedAreaPixels.x,
        croppedAreaPixels.y,
        croppedAreaPixels.width,
        croppedAreaPixels.height,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );
      
      return canvas.toDataURL('image/jpeg');
    } catch (e) {
      console.error('Error getting cropped image:', e);
      return null;
    }
  }, [imageSrc, croppedAreaPixels]);
  
  const handleCropConfirm = useCallback(async () => {
    const croppedImg = await getCroppedImage();
    setCroppedImage(croppedImg);
    setShowCropper(false);
  }, [getCroppedImage]);
  
  const validate = () => {
    let isValid = true;
    const newErrors = {
      bio: '',
      mobileNumber: '',
      gender: '',
      profileImage: ''
    };
    
    if (step === 1) {
      if (!formData.bio?.trim()) {
        newErrors.bio = 'Bio is required';
        isValid = false;
      } else if (formData.bio.length > 300) {
        newErrors.bio = 'Bio must be 300 characters or less';
        isValid = false;
      }
      
      if (!formData.mobileNumber?.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
        isValid = false;
      } else if (!/^\+?[0-9]{10,15}$/.test(formData.mobileNumber)) {
        newErrors.mobileNumber = 'Please enter a valid mobile number';
        isValid = false;
      }
      
      if (!formData.gender) {
        newErrors.gender = 'Please select your gender';
        isValid = false;
      }
    } else if (step === 2) {
      if (!croppedImage && !imageSrc) {
        newErrors.profileImage = 'Please upload a profile image';
        isValid = false;
      }
    }
    
    setErrors(newErrors);
    return isValid;
  };
  
  const handleNext = () => {
    if (validate()) {
      setStep(2);
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    setIsSubmitting(true);
    
    try {
      // In a real app, we would make an API call here to update the user profile
      setTimeout(() => {
        // Update user context with the new data
        if (user) {
          const updatedUser = {
            ...user,
            bio: formData.bio,
            mobileNumber: formData.mobileNumber,
            gender: formData.gender,
            interests: formData.interests,
            profileImageUrl: croppedImage || undefined,
            isAuthenticated: true
          };
          
          login(updatedUser);
          
          // Clear signup data as it's no longer needed
          localStorage.removeItem('signupData');
          localStorage.removeItem('emailVerified');
          
          // Redirect to dashboard
          navigate('/');
        }
      }, 1000);
    } catch (error) {
      console.error('Failed to complete onboarding:', error);
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden p-6">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-extrabold text-gray-900">Complete Your Profile</h2>
          <p className="mt-2 text-sm text-gray-600">
            Just a few more details to personalize your experience
          </p>
        </div>
        
        <div className="mb-6">
          <div className="flex items-center">
            <div className={`h-2 flex-1 ${step >= 1 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
            <div className={`h-2 flex-1 ${step >= 2 ? 'bg-indigo-600' : 'bg-gray-200'}`}></div>
          </div>
          <div className="flex justify-between mt-1">
            <span className="text-xs font-medium text-indigo-600">Basic Info</span>
            <span className={`text-xs font-medium ${step >= 2 ? 'text-indigo-600' : 'text-gray-500'}`}>Profile Image</span>
          </div>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {step === 1 && (
            <div className="space-y-5">
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={3}
                    value={formData.bio}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.bio ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="Tell us a bit about yourself..."
                  />
                  {errors.bio && (
                    <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                  )}
                  <p className="mt-1 text-xs text-gray-500">
                    {formData.bio.length}/300 characters
                  </p>
                </div>
              </div>
              
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-1">
                  <input
                    type="text"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.mobileNumber ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                    placeholder="+1 (123) 456-7890"
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`block w-full px-3 py-2 border ${errors.gender ? 'border-red-300' : 'border-gray-300'} rounded-md shadow-sm placeholder-gray-400 focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm`}
                  >
                    <option value="">Select your gender</option>
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  {errors.gender && (
                    <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                  )}
                </div>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Interests (Optional)
                </label>
                <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
                  {availableInterests.map(interest => (
                    <div
                      key={interest}
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-2 text-sm rounded-full cursor-pointer text-center transition-colors ${
                        formData.interests.includes(interest)
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      } border`}
                    >
                      {interest}
                    </div>
                  ))}
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Select topics that interest you
                </p>
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Next
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Profile Image
                </label>
                
                {showCropper && imageSrc ? (
                  <div className="mb-4">
                    <div className="relative h-64 w-full rounded-lg overflow-hidden">
                      <Cropper
                        image={imageSrc}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                    </div>
                    
                    <div className="mt-2">
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Zoom
                      </label>
                      <input
                        type="range"
                        value={zoom}
                        min={1}
                        max={3}
                        step={0.1}
                        onChange={(e) => setZoom(Number(e.target.value))}
                        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                      />
                    </div>
                    
                    <div className="flex space-x-2 mt-4">
                      <button
                        type="button"
                        onClick={() => setShowCropper(false)}
                        className="flex-1 py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={handleCropConfirm}
                        className="flex-1 py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                      >
                        Crop
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {croppedImage ? (
                      <div className="flex flex-col items-center">
                        <div className="relative h-40 w-40 rounded-full overflow-hidden border-4 border-indigo-100">
                          <img
                            src={croppedImage}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        </div>
                        <button
                          type="button"
                          onClick={() => setShowCropper(true)}
                          className="mt-2 text-sm text-indigo-600 hover:text-indigo-500"
                        >
                          Change Image
                        </button>
                      </div>
                    ) : (
                      <div className="flex justify-center">
                        <div className="w-40 h-40 border-2 border-dashed border-gray-300 rounded-full flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors cursor-pointer" onClick={() => document.getElementById('profile-image-input')?.click()}>
                          <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                          </svg>
                          <span className="mt-2 text-sm text-gray-500">Upload Image</span>
                        </div>
                        <input
                          id="profile-image-input"
                          type="file"
                          accept="image/*"
                          onChange={handleImageSelect}
                          className="hidden"
                        />
                      </div>
                    )}
                    {errors.profileImage && (
                      <p className="text-center text-sm text-red-600">{errors.profileImage}</p>
                    )}
                  </div>
                )}
              </div>
              
              <div className="flex justify-between">
                <button
                  type="button"
                  onClick={() => setStep(1)}
                  className="flex justify-center py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                >
                  {isSubmitting ? 'Completing Profile...' : 'Complete Profile'}
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
