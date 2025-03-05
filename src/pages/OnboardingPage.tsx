import React, { useState, useCallback, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUser } from '../contexts/UserContext';
import Cropper from 'react-easy-crop';

const OnboardingPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, login } = useUser();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Form state
  const [formData, setFormData] = useState({
    bio: '',
    mobileNumber: '',
    gender: '',
  });

  // Image cropper state
  const [image, setImage] = useState<string | null>(null);
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [croppedAreaPixels, setCroppedAreaPixels] = useState(null);
  const [croppedImage, setCroppedImage] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle file input change
  const onFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const reader = new FileReader();
      reader.readAsDataURL(e.target.files[0]);
      reader.onload = () => {
        setImage(reader.result as string);
      };
    }
  };

  // Handle crop complete
  const onCropComplete = useCallback((_croppedArea: any, croppedAreaPixels: any) => {
    setCroppedAreaPixels(croppedAreaPixels);
  }, []);

  // Create a cropped image based on the crop area
  const createCroppedImage = async () => {
    try {
      if (!image || !croppedAreaPixels) return null;

      const canvas = document.createElement('canvas');
      const img = new Image();
      img.src = image;

      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const scaleX = img.naturalWidth / img.width;
      const scaleY = img.naturalHeight / img.height;

      canvas.width = croppedAreaPixels.width;
      canvas.height = croppedAreaPixels.height;

      const ctx = canvas.getContext('2d');
      if (!ctx) return null;

      ctx.drawImage(
        img,
        croppedAreaPixels.x * scaleX,
        croppedAreaPixels.y * scaleY,
        croppedAreaPixels.width * scaleX,
        croppedAreaPixels.height * scaleY,
        0,
        0,
        croppedAreaPixels.width,
        croppedAreaPixels.height
      );

      return canvas.toDataURL('image/jpeg');
    } catch (e) {
      console.error('Error creating cropped image:', e);
      return null;
    }
  };

  // Apply the cropped image
  const applyCrop = async () => {
    const croppedImg = await createCroppedImage();
    setCroppedImage(croppedImg);
    setImage(null); // Close the cropper
  };

  // Handle form field changes
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Clear error when user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.bio.trim()) {
      newErrors.bio = 'Bio is required';
    } else if (formData.bio.length < 10) {
      newErrors.bio = 'Bio should be at least 10 characters';
    }

    if (!formData.mobileNumber.trim()) {
      newErrors.mobileNumber = 'Mobile number is required';
    } else if (!/^\+?[0-9]{10,15}$/.test(formData.mobileNumber)) {
      newErrors.mobileNumber = 'Please enter a valid mobile number';
    }

    if (!formData.gender) {
      newErrors.gender = 'Please select your gender';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      // Prepare user data with the updated information
      if (user) {
        const updatedUserData = {
          ...user,
          bio: formData.bio,
          mobileNumber: formData.mobileNumber,
          gender: formData.gender,
          profileImageUrl: croppedImage || user.profileImageUrl,
          isAuthenticated: true,
        };

        // Update user context
        login(updatedUserData);

        // Store in localStorage
        localStorage.setItem('userData', JSON.stringify(updatedUserData));

        // Navigate to home page after successful onboarding
        navigate('/');
      }
    } catch (error) {
      console.error('Error during onboarding:', error);
      setErrors({
        form: 'An error occurred while saving your information. Please try again.',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12 sm:px-6 lg:px-8">
        <div className="w-full max-w-md rounded-lg bg-white p-8 shadow-md">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Loading...</h2>
            <p className="mt-2 text-sm text-gray-600">
              Please wait while we retrieve your information
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-3xl">
        <div className="mb-10 text-center">
          <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">Welcome!</h1>
          <p className="mt-3 text-lg text-gray-600">
            Let's complete your profile to get started
          </p>
        </div>

        <div className="overflow-hidden rounded-lg bg-white shadow">
          <form onSubmit={handleSubmit} className="p-6 sm:p-8">
            <div className="space-y-8">
              {/* Profile Image */}
              <div>
                <h3 className="text-lg font-medium leading-6 text-gray-900">Profile Image</h3>
                <div className="mt-1 flex flex-col items-center">
                  {image ? (
                    <div className="relative h-80 w-full overflow-hidden rounded-lg">
                      <Cropper
                        image={image}
                        crop={crop}
                        zoom={zoom}
                        aspect={1}
                        onCropChange={setCrop}
                        onZoomChange={setZoom}
                        onCropComplete={onCropComplete}
                      />
                      <div className="mt-4 flex justify-center space-x-4">
                        <button
                          type="button"
                          onClick={applyCrop}
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Apply Crop
                        </button>
                        <button
                          type="button"
                          onClick={() => setImage(null)}
                          className="inline-flex items-center rounded-md border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Cancel
                        </button>
                      </div>
                      <div className="mt-4">
                        <label htmlFor="zoom" className="block text-sm font-medium text-gray-700">
                          Zoom: {zoom.toFixed(1)}
                        </label>
                        <input
                          type="range"
                          id="zoom"
                          min={1}
                          max={3}
                          step={0.1}
                          value={zoom}
                          onChange={(e) => setZoom(Number(e.target.value))}
                          className="mt-1 w-full"
                        />
                      </div>
                    </div>
                  ) : (
                    <div className="space-y-4 text-center">
                      {croppedImage ? (
                        <div className="flex flex-col items-center">
                          <img
                            src={croppedImage}
                            alt="Cropped profile"
                            className="h-40 w-40 rounded-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={() => {
                              setCroppedImage(null);
                              if (fileInputRef.current) {
                                fileInputRef.current.value = '';
                              }
                            }}
                            className="mt-2 text-sm font-medium text-indigo-600 hover:text-indigo-500"
                          >
                            Remove
                          </button>
                        </div>
                      ) : (
                        <div className="flex h-40 w-40 items-center justify-center rounded-full bg-gray-200">
                          <svg
                            className="h-24 w-24 text-gray-400"
                            fill="currentColor"
                            viewBox="0 0 24 24"
                          >
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        </div>
                      )}
                      <div>
                        <button
                          type="button"
                          onClick={() => fileInputRef.current?.click()}
                          className="inline-flex items-center rounded-md border border-transparent bg-indigo-600 px-4 py-2 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                          Upload Photo
                        </button>
                        <input
                          ref={fileInputRef}
                          type="file"
                          accept="image/*"
                          onChange={onFileChange}
                          className="hidden"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Bio */}
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">
                  Bio*
                </label>
                <div className="mt-1">
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    placeholder="Tell us about yourself"
                    className={`block w-full rounded-md border ${
                      errors.bio ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  />
                  {errors.bio && <p className="mt-1 text-sm text-red-600">{errors.bio}</p>}
                </div>
              </div>

              {/* Mobile Number */}
              <div>
                <label htmlFor="mobileNumber" className="block text-sm font-medium text-gray-700">
                  Mobile Number*
                </label>
                <div className="mt-1">
                  <input
                    type="tel"
                    id="mobileNumber"
                    name="mobileNumber"
                    value={formData.mobileNumber}
                    onChange={handleChange}
                    placeholder="+1234567890"
                    className={`block w-full rounded-md border ${
                      errors.mobileNumber ? 'border-red-300' : 'border-gray-300'
                    } shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm`}
                  />
                  {errors.mobileNumber && (
                    <p className="mt-1 text-sm text-red-600">{errors.mobileNumber}</p>
                  )}
                </div>
              </div>

              {/* Gender */}
              <div>
                <label htmlFor="gender" className="block text-sm font-medium text-gray-700">
                  Gender*
                </label>
                <div className="mt-1">
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`block w-full rounded-md border ${
                      errors.gender ? 'border-red-300' : 'border-gray-300'
                    } bg-white py-2 px-3 shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm`}
                  >
                    <option value="">Select gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="non-binary">Non-binary</option>
                    <option value="prefer-not-to-say">Prefer not to say</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-red-600">{errors.gender}</p>}
                </div>
              </div>

              {/* Form Error */}
              {errors.form && (
                <div className="rounded-md bg-red-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg
                        className="h-5 w-5 text-red-400"
                        xmlns="http://www.w3.org/2000/svg"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                        aria-hidden="true"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-red-800">{errors.form}</h3>
                    </div>
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <div className="pt-5">
                <div className="flex justify-end">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="ml-3 inline-flex justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-400"
                  >
                    {isSubmitting ? 'Saving...' : 'Complete Profile'}
                  </button>
                </div>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default OnboardingPage;