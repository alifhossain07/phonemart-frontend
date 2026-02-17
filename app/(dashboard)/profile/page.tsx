"use client";
import { useAuth } from '@/app/context/AuthContext';
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';

interface ProfileFormData {
  name: string;
  phone: string;
  email: string;
  address: string;
  current_password: string;
  new_password: string;
  confirm_password: string;
}

export default function ProfilePage() {
  const { user, loading, accessToken, refreshUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { register, handleSubmit, formState: { errors }, reset, watch } = useForm<ProfileFormData>({
    defaultValues: {
      name: user?.name || '',
      phone: user?.phone || '',
      email: user?.email || '',
      address: user?.address || '',
      current_password: '',
      new_password: '',
      confirm_password: '',
    },
  });

  const newPassword = watch('new_password');

  // Reset form when user data changes
  React.useEffect(() => {
    if (user) {
      reset({
        name: user.name || '',
        phone: user.phone || '',
        email: user.email || '',
        address: user.address || '',
        current_password: '',
        new_password: '',
        confirm_password: '',
      });
    }
  }, [user, reset]);

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/3"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <h1 className="text-[26px] font-semibold text-gray-800 mb-4">Please log in to view your profile</h1>
      </div>
    );
  }

  const onSubmit = async (data: ProfileFormData) => {
    if (!accessToken) {
      toast.error("You must be logged in to update your profile");
      return;
    }

    setIsSubmitting(true);
    try {
      const updateData: {
        name: string;
        phone: string;
        email: string | null;
        address: string | null;
        current_password?: string;
        new_password?: string;
        confirm_password?: string;
      } = {
        name: data.name.trim(),
        phone: data.phone.trim(),
        // Send empty string instead of null for email to allow backend to handle it properly
        email: data.email.trim() || "",
        address: data.address.trim() || null,
      };

      // Only include password fields if user is changing password
      if (isChangingPassword) {
        if (!data.current_password) {
          toast.error("Current password is required");
          setIsSubmitting(false);
          return;
        }
        if (!data.new_password) {
          toast.error("New password is required");
          setIsSubmitting(false);
          return;
        }
        if (data.new_password !== data.confirm_password) {
          toast.error("New password and confirm password do not match");
          setIsSubmitting(false);
          return;
        }
        updateData.current_password = data.current_password;
        updateData.new_password = data.new_password;
        updateData.confirm_password = data.confirm_password;
      }

      const response = await fetch('/api/auth/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`,
        },
        body: JSON.stringify(updateData),
      });

      const result = await response.json();

      if (!response.ok || !result.result) {
        throw new Error(result.message || 'Failed to update profile');
      }

      toast.success('Profile updated successfully!');
      setIsEditing(false);
      setIsChangingPassword(false);
      
      // Refresh user data from server
      await refreshUser();
      
      // Reset form with updated user data
      if (user) {
        reset({
          name: user.name || '',
          phone: user.phone || '',
          email: user.email || '',
          address: user.address || '',
          current_password: '',
          new_password: '',
          confirm_password: '',
        });
      }
    } catch (error: unknown) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to update profile';
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-[26px] font-semibold text-gray-800">Welcome, {user.name}!</h1>
        {!isEditing && (
          <button
            onClick={() => setIsEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors"
          >
            Edit Profile
          </button>
        )}
      </div>

      <h2 className="text-lg text-gray-600 mb-6">My Account Information</h2>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
        {/* Full Name */}
        <div>
          <label className="block text-sm font-medium mb-2">Full Name *</label>
          <input 
            type="text" 
            {...register('name', { required: 'Name is required' })}
            placeholder="Enter Name" 
            disabled={!isEditing}
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
        </div>

        {/* Email Address */}
        <div>
          <label className="block text-sm font-medium mb-2">E-mail Address</label>
          <input 
            type="email" 
            {...register('email')}
            placeholder="No email provided" 
            disabled={!isEditing}
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
        </div>

        {/* Phone Number */}
        <div>
          <label className="block text-sm font-medium mb-2">Phone Number *</label>
          <input 
            type="text" 
            {...register('phone', { 
              required: 'Phone number is required',
              pattern: {
                value: /^\d{11}$/,
                message: 'Phone number must be 11 digits'
              }
            })}
            placeholder="No phone provided" 
            disabled={!isEditing}
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          />
          {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
        </div>

        {/* Full Address */}
        <div>
          <label className="block text-sm font-semibold mb-2">Full Address</label>
          <textarea 
            rows={3}
            {...register('address')}
            placeholder="No address provided" 
            disabled={!isEditing}
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all disabled:opacity-60 disabled:cursor-not-allowed"
          ></textarea>
        </div>

        {/* Password Change Section */}
        <div className="border-t border-gray-200 pt-5 mt-6">
          <div className="flex justify-between items-center mb-4">
            <label className="block text-sm font-semibold">Change Password</label>
            {!isChangingPassword && isEditing && (
              <button
                type="button"
                onClick={() => setIsChangingPassword(true)}
                className="text-blue-600 hover:text-blue-700 text-sm font-medium"
              >
                Change Password
              </button>
            )}
          </div>

          {isChangingPassword && (
            <div className="space-y-4 bg-gray-50 p-4 rounded-lg">
              {/* Current Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Current Password *</label>
                <input 
                  type="password" 
                  {...register('current_password', {
                    required: isChangingPassword ? 'Current password is required' : false
                  })}
                  placeholder="Enter current password" 
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 outline-none transition-all"
                />
                {errors.current_password && <p className="text-red-500 text-sm mt-1">{errors.current_password.message}</p>}
              </div>

              {/* New Password */}
              <div>
                <label className="block text-sm font-medium mb-2">New Password *</label>
                <input 
                  type="password" 
                  {...register('new_password', {
                    required: isChangingPassword ? 'New password is required' : false,
                    minLength: {
                      value: 6,
                      message: 'Password must be at least 6 characters'
                    }
                  })}
                  placeholder="Enter new password" 
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 outline-none transition-all"
                />
                {errors.new_password && <p className="text-red-500 text-sm mt-1">{errors.new_password.message}</p>}
              </div>

              {/* Confirm Password */}
              <div>
                <label className="block text-sm font-medium mb-2">Confirm New Password *</label>
                <input 
                  type="password" 
                  {...register('confirm_password', {
                    required: isChangingPassword ? 'Please confirm your new password' : false,
                    validate: value => value === newPassword || 'Passwords do not match'
                  })}
                  placeholder="Confirm new password" 
                  className="w-full p-3 bg-white border border-gray-300 rounded-lg focus:border-orange-500 outline-none transition-all"
                />
                {errors.confirm_password && <p className="text-red-500 text-sm mt-1">{errors.confirm_password.message}</p>}
              </div>

              <button
                type="button"
                onClick={() => {
                  setIsChangingPassword(false);
                  reset({
                    ...watch(),
                    current_password: '',
                    new_password: '',
                    confirm_password: '',
                  });
                }}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel password change
              </button>
            </div>
          )}
        </div>

        {/* Account Created Date */}
        <div>
          <label className="block text-sm font-medium mb-2">Member Since</label>
          <input 
            type="text" 
            value={user.created_at ? new Date(user.created_at).toLocaleDateString() : 'N/A'}
            className="w-full p-3 bg-gray-50 border border-transparent rounded-lg focus:bg-white focus:border-orange-500 outline-none transition-all"
            readOnly
            disabled
          />
        </div>

        {/* Submit/Cancel Buttons */}
        {isEditing && (
          <div className="flex justify-end gap-3 pt-2">
            <button 
              type="button"
              onClick={() => {
                setIsEditing(false);
                setIsChangingPassword(false);
                reset(); // Reset form to original values
              }}
              className="bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isSubmitting}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-12 rounded-lg transition-transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        )}
      </form>
    </div>
  );
}
