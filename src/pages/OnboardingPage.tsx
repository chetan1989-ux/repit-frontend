
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Cropper from 'react-easy-crop';
import { v4 as uuidv4 } from 'uuid';

interface CropArea {
  x: number;
  y: number;
  width: number;
  height: number;
}

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { login } = useUser();
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

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      const reader = new FileReader();
      reader.addEventListener('load', () => {
        setImageSrc(reader.result as string);
        setShowCropper(true);
      });
      reader.readAsDataURL(file);
      
      // Clear error
      setErrors(prev => ({ ...prev, profileImage: '' }));
    }
  };

  const onCropComplete = useCallback((croppedArea: any, croppedAreaPixels: CropArea) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  const createImage = (url: string): Promise<HTMLImageElement> =>
    new Promise((resolve, reject) => {
      const image = new Image();
      image.addEventListener('load', () => resolve(image));
      image.addEventListener('error', error => reject(error));
      image.src = url;
    });

  const getCroppedImg = async (
    imageSrc: string,
    pixelCrop: CropArea
  ): Promise<string> => {
    const image = await createImage(imageSrc);
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');

    if (!ctx) {
      throw new Error('Canvas context is not available');
    }

    const maxSize = Math.max(image.width, image.height);
    const safeArea = 2 * ((maxSize / 2) * Math.sqrt(2));

    canvas.width = safeArea;
    canvas.height = safeArea;

    ctx.drawImage(
      image,
      safeArea / 2 - image.width * 0.5,
      safeArea / 2 - image.height * 0.5
    );

    const data = ctx.getImageData(0, 0, safeArea, safeArea);

    canvas.width = pixelCrop.width;
    canvas.height = pixelCrop.height;

    ctx.putImageData(
      data,
      Math.round(0 - safeArea / 2 + image.width * 0.5 - pixelCrop.x),
      Math.round(0 - safeArea / 2 + image.height * 0.5 - pixelCrop.y)
    );

    return canvas.toDataURL('image/jpeg');
  };

  const applyCrop = async () => {
    if (imageSrc && croppedAreaPixels) {
      try {
        const croppedImageUrl = await getCroppedImg(imageSrc, croppedAreaPixels);
        setCroppedImage(croppedImageUrl);
        setShowCropper(false);
      } catch (e) {
        console.error(e);
      }
    }
  };

  const cancelCrop = () => {
    setShowCropper(false);
    setImageSrc(null);
  };

  const validateForm = () => {
    let valid = true;
    const newErrors = { ...errors };

    if (step === 1) {
      if (!formData.bio.trim()) {
        newErrors.bio = 'Bio is required';
        valid = false;
      }

      if (!formData.mobileNumber.trim()) {
        newErrors.mobileNumber = 'Mobile number is required';
        valid = false;
      } else if (!/^\+?[0-9]{10,15}$/.test(formData.mobileNumber.trim())) {
        newErrors.mobileNumber = 'Please enter a valid mobile number';
        valid = false;
      }

      if (!formData.gender) {
        newErrors.gender = 'Please select your gender';
        valid = false;
      }

      if (!croppedImage) {
        newErrors.profileImage = 'Profile image is required';
        valid = false;
      }
    }

    setErrors(newErrors);
    return valid;
  };

  const handleContinue = () => {
    if (validateForm()) {
      setStep(2);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // In a real app, you'd make an API call to save the user data
      console.log('Submitting user profile:', {
        ...userData,
        ...formData,
        profileImage: croppedImage
      });
      
      // Here you would typically send the data to your backend
      // For this demo, we'll just simulate a successful submission
      setTimeout(() => {
        // Store the complete user data
        const completeUserData = {
          ...userData,
          ...formData,
          profileImageUrl: croppedImage,
          id: uuidv4(), // Generate a random ID
          isAuthenticated: true
        };
        
        // Save to localStorage for persistence
        localStorage.setItem('userData', JSON.stringify(completeUserData));
        
        // Login the user
        login(completeUserData);
        
        // Redirect to homepage
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Error submitting profile:', error);
      alert('Failed to complete your profile. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

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
              {/* Profile Image Upload */}
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Profile Image
                </label>
                <div className="mt-1 flex flex-col items-center">
                  {!showCropper && (
                    <>
                      {croppedImage ? (
                        <div className="relative">
                          <img 
                            src={croppedImage} 
                            alt="Profile preview" 
                            className="h-32 w-32 rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => setShowCropper(true)}
                            className="absolute -bottom-2 -right-2 p-1 bg-indigo-600 text-white rounded-full"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                            </svg>
                          </button>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                            </svg>
                          </div>
                          <label htmlFor="profile-image" className="mt-2 cursor-pointer px-3 py-2 text-sm font-medium text-indigo-600 hover:text-indigo-500">
                            Upload Image
                          </label>
                          <input
                            id="profile-image"
                            name="profileImage"
                            type="file"
                            accept="image/*"
                            onChange={handleFileChange}
                            className="sr-only"
                          />
                        </div>
                      )}
                    </>
                  )}
                  
                  {showCropper && imageSrc && (
                    <div className="fixed inset-0 z-50 bg-black bg-opacity-75 flex items-center justify-center p-4">
                      <div className="bg-white p-6 rounded-lg max-w-md w-full">
                        <h3 className="text-lg font-medium mb-4">Crop Your Profile Picture</h3>
                        <div className="relative h-64 w-full">
                          <Cropper
                            image={imageSrc}
                            crop={crop}
                            zoom={zoom}
                            aspect={1}
                            onCropChange={setCrop}
                            onCropComplete={onCropComplete}
                            onZoomChange={setZoom}
                          />
                        </div>
                        <div className="mt-4">
                          <label className="block text-sm font-medium text-gray-700">Zoom</label>
                          <input
                            type="range"
                            value={zoom}
                            min={1}
                            max={3}
                            step={0.1}
                            onChange={(e) => setZoom(parseFloat(e.target.value))}
                            className="w-full"
                          />
                        </div>
                        <div className="mt-4 flex justify-end space-x-2">
                          <button
                            type="button"
                            onClick={cancelCrop}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md"
                          >
                            Cancel
                          </button>
                          <button
                            type="button"
                            onClick={applyCrop}
                            className="px-4 py-2 bg-indigo-600 text-white rounded-md"
                          >
                            Apply
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                {errors.profileImage && (
                  <p className="mt-1 text-sm text-red-600">{errors.profileImage}</p>
                )}
              </div>

              {/* Bio */}
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
                    onChange={handleChange}
                    placeholder="Tell us a bit about yourself..."
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {errors.bio && (
                  <p className="mt-1 text-sm text-red-600">{errors.bio}</p>
                )}
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                  Mobile Number
                </label>
                <div className="mt-1">
                  <input
                    id="mobileNumber"
                    name="mobileNumber"
                    type="tel"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  />
                </div>
                {errors.mobileNumber && (
                  <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                )}
              </div>

              {/* Gender */}
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
                    className="appearance-none block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                  >
                    <option value="">Select gender</option>
                    {genderOptions.map(option => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                </div>
                {errors.gender && (
                  <p className="mt-1 text-sm text-red-600">{errors.gender}</p>
                )}
              </div>

              <div className="flex justify-end">
                <button
                  type="button"
                  onClick={handleContinue}
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                  Continue
                </button>
              </div>
            </div>
          )}
          
          {step === 2 && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Your Interests (Optional)
                </label>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {availableInterests.map(interest => (
                    <button
                      key={interest}
                      type="button"
                      onClick={() => handleInterestToggle(interest)}
                      className={`px-3 py-2 rounded-md text-sm font-medium ${
                        formData.interests.includes(interest)
                          ? 'bg-indigo-100 text-indigo-800 border-indigo-300'
                          : 'bg-gray-100 text-gray-800 border-gray-300'
                      } border hover:bg-indigo-50`}
                    >
                      {interest}
                    </button>
                  ))}
                </div>
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
