import React, { useState, useEffect } from 'react';
import { API_URL } from '../services/api';

interface Settings {
  logo?: string;
  landingPageImage?: string;
  landingPageTitle?: string;
  landingPageDescription?: string;
  notification?: {
    text: string;
    isActive: boolean;
  };
}

const Settings: React.FC = () => {
  const [settings, setSettings] = useState<Settings>({
    landingPageTitle: '',
    landingPageDescription: '',
    notification: {
      text: '',
      isActive: false,
    },
  });
  const [logoFile, setLogoFile] = useState<File | null>(null);
  const [landingPageImageFile, setLandingPageImageFile] = useState<File | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState<{
    type: 'success' | 'error';
    text: string;
  } | null>(null);

  // Allowed logo file types
  const allowedLogoTypes = [
    'image/svg+xml',
    'image/x-icon',
    'image/png',
    'image/jpeg',
    'image/jpg',
    'image/gif',
    'image/webp',
  ];
  const maxLogoSize = 2 * 1024 * 1024; // 2MB

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch(`${API_URL}/api/settings`);
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      setMessage({ type: 'error', text: 'Failed to load settings' });
    }
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Check file type
    if (!allowedLogoTypes.includes(file.type)) {
      setMessage({
        type: 'error',
        text: 'Invalid file type. Please upload an SVG, ICO, PNG, JPEG, GIF, or WebP file.',
      });
      return;
    }

    // Check file size
    if (file.size > maxLogoSize) {
      setMessage({
        type: 'error',
        text: 'Logo file is too large. Maximum size is 2MB.',
      });
      return;
    }

    setLogoFile(file);
    setMessage(null);
  };

  const handleLandingPageImageChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (file) {
      setLandingPageImageFile(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setMessage(null);

    try {
      const formData = new FormData();

      if (logoFile) {
        formData.append('logo', logoFile);
      }

      if (landingPageImageFile) {
        formData.append('landingPageImage', landingPageImageFile);
      }

      if (settings.landingPageTitle) {
        formData.append('landingPageTitle', settings.landingPageTitle);
      }

      if (settings.landingPageDescription) {
        formData.append(
          'landingPageDescription',
          settings.landingPageDescription
        );
      }

      // Ensure notification object is properly structured
      const notificationData = {
        text: settings.notification?.text || '',
        isActive: settings.notification?.isActive || false,
      };
      formData.append('notification', JSON.stringify(notificationData));

      const token = localStorage.getItem('token');
      const response = await fetch(`${API_URL}/api/settings`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
        },
        body: formData,
      });

      if (response.ok) {
        setMessage({ type: 'success', text: 'Settings updated successfully' });
        // Clear file inputs after successful update
        setLogoFile(null);
        setLandingPageImageFile(null);
        // Reset file input elements
        const logoInput = document.getElementById('logo') as HTMLInputElement;
        const landingPageImageInput = document.getElementById(
          'landingPageImage'
        ) as HTMLInputElement;
        if (logoInput) logoInput.value = '';
        if (landingPageImageInput) landingPageImageInput.value = '';
      } else {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update settings');
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      setMessage({
        type: 'error',
        text:
          error instanceof Error ? error.message : 'Failed to update settings',
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Website Settings
      </h1>

      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.type === 'success'
              ? 'bg-green-100 text-green-800'
              : 'bg-red-100 text-red-800'
          }`}
        >
          {message.text}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Company Logo
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Upload Logo (SVG, ICO, PNG, JPEG, GIF, WebP)
              </label>
              <input
                type="file"
                id="logo"
                accept=".svg,.ico,.png,.jpg,.jpeg,.gif,.webp"
                onChange={handleLogoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                Recommended: SVG or ICO format. Max size: 2MB.
              </p>
            </div>

            {settings.logo && !logoFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Current Logo:</p>
                <img
                  src={settings.logo}
                  alt="Company Logo"
                  className="h-16 object-contain"
                />
              </div>
            )}

            {logoFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">New Logo Preview:</p>
                <img
                  src={URL.createObjectURL(logoFile)}
                  alt="Logo Preview"
                  className="h-16 object-contain"
                />
              </div>
            )}
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Landing Page
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landing Page Image
              </label>
              <input
                type="file"
                id="landingPageImage"
                accept="image/*"
                onChange={handleLandingPageImageChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            {settings.landingPageImage && !landingPageImageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">Current Image:</p>
                <img
                  src={settings.landingPageImage}
                  alt="Landing Page"
                  className="h-32 w-full object-cover rounded-md"
                />
              </div>
            )}

            {landingPageImageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">New Image Preview:</p>
                <img
                  src={URL.createObjectURL(landingPageImageFile)}
                  alt="Landing Page Preview"
                  className="h-32 w-full object-cover rounded-md"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landing Page Title
              </label>
              <input
                type="text"
                value={settings.landingPageTitle || ''}
                onChange={(e) =>
                  setSettings({ ...settings, landingPageTitle: e.target.value })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter landing page title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Landing Page Description
              </label>
              <textarea
                value={settings.landingPageDescription || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    landingPageDescription: e.target.value,
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter landing page description"
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            Notification Settings
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Notification Text
              </label>
              <input
                type="text"
                value={settings.notification?.text || ''}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notification: {
                      text: e.target.value,
                      isActive: settings.notification?.isActive || false,
                    },
                  })
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Enter notification text"
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="notificationActive"
                checked={settings.notification?.isActive || false}
                onChange={(e) =>
                  setSettings({
                    ...settings,
                    notification: {
                      text: settings.notification?.text || '',
                      isActive: e.target.checked,
                    },
                  })
                }
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="notificationActive"
                className="ml-2 block text-sm text-gray-700"
              >
                Show notification
              </label>
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
          >
            {isLoading ? 'Saving...' : 'Save Settings'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
