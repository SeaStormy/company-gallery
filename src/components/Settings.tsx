import React, { useState, useEffect } from 'react';
import { API_URL } from '../services/api';
import { useTranslation } from 'react-i18next';

interface Settings {
  logo?: string;
  landingPageImage?: string;
  sections: {
    contactInfo: {
      title: string;
      address: {
        en: string;
        vi: string;
      };
      phone: string;
      email: string;
    };
    workingHours: {
      title: string;
      weekdays: {
        en: string;
        vi: string;
      };
      saturday: {
        en: string;
        vi: string;
      };
      sunday: {
        en: string;
        vi: string;
      };
    };
  };
  landingPageTitle: {
    en: string;
    vi: string;
  };
  landingPageDescription: {
    en: string;
    vi: string;
  };
  notification: {
    text: {
      en: string;
      vi: string;
    };
    isActive: boolean;
  };
}

const Settings: React.FC = () => {
  const { t, i18n } = useTranslation();
  const [settings, setSettings] = useState<Settings>({
    logo: '',
    landingPageImage: '',
    sections: {
      contactInfo: {
        title: '',
        address: {
          en: '',
          vi: '',
        },
        phone: '',
        email: '',
      },
      workingHours: {
        title: '',
        weekdays: {
          en: '',
          vi: '',
        },
        saturday: {
          en: '',
          vi: '',
        },
        sunday: {
          en: '',
          vi: '',
        },
      },
    },
    landingPageTitle: {
      en: '',
      vi: '',
    },
    landingPageDescription: {
      en: '',
      vi: '',
    },
    notification: {
      text: {
        en: '',
        vi: '',
      },
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
    const fetchSettings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/settings`);
        if (response.ok) {
          const data = await response.json();
          setSettings((prevSettings) => ({
            ...prevSettings,
            ...data,
            sections: {
              ...prevSettings.sections,
              contactInfo: {
                ...prevSettings.sections.contactInfo,
                ...(data.sections?.contactInfo || {}),
              },
              workingHours: {
                ...prevSettings.sections.workingHours,
                ...(data.sections?.workingHours || {}),
              },
            },
          }));
        }
      } catch (error) {
        console.error('Error fetching settings:', error);
      }
    };

    fetchSettings();
  }, []);

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

  const handleLandingPageTitleChange = (lang: 'en' | 'vi', value: string) => {
    setSettings((prev) => ({
      ...prev,
      landingPageTitle: {
        en: lang === 'en' ? value : prev.landingPageTitle.en,
        vi: lang === 'vi' ? value : prev.landingPageTitle.vi,
      },
    }));
  };

  const handleLandingPageDescriptionChange = (
    lang: 'en' | 'vi',
    value: string
  ) => {
    setSettings((prev) => ({
      ...prev,
      landingPageDescription: {
        en: lang === 'en' ? value : prev.landingPageDescription.en,
        vi: lang === 'vi' ? value : prev.landingPageDescription.vi,
      },
    }));
  };

  const handleNotificationTextChange = (lang: 'en' | 'vi', value: string) => {
    setSettings((prev) => ({
      ...prev,
      notification: {
        text: {
          en: lang === 'en' ? value : prev.notification.text.en,
          vi: lang === 'vi' ? value : prev.notification.text.vi,
        },
        isActive: prev.notification.isActive,
      },
    }));
  };

  const handleNotificationToggle = (isActive: boolean) => {
    setSettings((prev) => ({
      ...prev,
      notification: {
        text: {
          en: prev.notification.text.en,
          vi: prev.notification.text.vi,
        },
        isActive,
      },
    }));
  };

  const handleWorkingHoursChange = (
    day: 'weekdays' | 'saturday' | 'sunday',
    value: string,
    lang: 'en' | 'vi'
  ) => {
    setSettings((prevSettings) => ({
      ...prevSettings,
      sections: {
        ...prevSettings.sections,
        workingHours: {
          ...prevSettings.sections.workingHours,
          [day]: {
            ...prevSettings.sections.workingHours[day],
            [lang]: value,
          },
        },
      },
    }));
  };

  const handleContactInfoChange = (
    field: 'address' | 'phone' | 'email',
    value: string,
    lang?: 'en' | 'vi'
  ) => {
    setSettings((prevSettings) => {
      if (field === 'address' && lang) {
        return {
          ...prevSettings,
          sections: {
            ...prevSettings.sections,
            contactInfo: {
              ...prevSettings.sections.contactInfo,
              address: {
                ...prevSettings.sections.contactInfo.address,
                [lang]: value,
              },
            },
          },
        };
      }
      return {
        ...prevSettings,
        sections: {
          ...prevSettings.sections,
          contactInfo: {
            ...prevSettings.sections.contactInfo,
            [field]: value,
          },
        },
      };
    });
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
        formData.append(
          'landingPageTitle',
          JSON.stringify(settings.landingPageTitle)
        );
      }

      if (settings.landingPageDescription) {
        formData.append(
          'landingPageDescription',
          JSON.stringify(settings.landingPageDescription)
        );
      }

      // Ensure notification object is properly structured
      const notificationData = {
        text: settings.notification?.text || {},
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
        {t('settings.title')}
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
            {t('settings.sections.companyLogo.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.companyLogo.upload')}
              </label>
              <input
                type="file"
                id="logo"
                accept=".svg,.ico,.png,.jpg,.jpeg,.gif,.webp"
                onChange={handleLogoChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
              <p className="mt-1 text-xs text-gray-500">
                {t('settings.sections.companyLogo.recommendation')}
              </p>
            </div>

            {settings.logo && !logoFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">
                  {t('settings.sections.companyLogo.currentLogo')}
                </p>
                <img
                  src={settings.logo}
                  alt="Company Logo"
                  className="h-16 object-contain"
                />
              </div>
            )}

            {logoFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">
                  {t('settings.sections.companyLogo.newLogoPreview')}
                </p>
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
            {t('settings.sections.landingPage.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.landingPage.image')}
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
                <p className="text-sm text-gray-600 mb-2">
                  {t('settings.sections.landingPage.currentImage')}
                </p>
                <img
                  src={settings.landingPageImage}
                  alt="Landing Page"
                  className="h-32 w-full object-cover rounded-md"
                />
              </div>
            )}

            {landingPageImageFile && (
              <div className="mt-2">
                <p className="text-sm text-gray-600 mb-2">
                  {t('settings.sections.landingPage.newImagePreview')}
                </p>
                <img
                  src={URL.createObjectURL(landingPageImageFile)}
                  alt="Landing Page Preview"
                  className="h-32 w-full object-cover rounded-md"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.landingPage.titleField')} (English)
              </label>
              <input
                type="text"
                value={settings.landingPageTitle?.en || ''}
                onChange={(e) =>
                  handleLandingPageTitleChange('en', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('settings.sections.landingPage.titleField')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.landingPage.titleField')} (Vietnamese)
              </label>
              <input
                type="text"
                value={settings.landingPageTitle?.vi || ''}
                onChange={(e) =>
                  handleLandingPageTitleChange('vi', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('settings.sections.landingPage.titleField')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.landingPage.description')} (English)
              </label>
              <textarea
                value={settings.landingPageDescription?.en || ''}
                onChange={(e) =>
                  handleLandingPageDescriptionChange('en', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('settings.sections.landingPage.description')}
                rows={3}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.landingPage.description')} (Vietnamese)
              </label>
              <textarea
                value={settings.landingPageDescription?.vi || ''}
                onChange={(e) =>
                  handleLandingPageDescriptionChange('vi', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('settings.sections.landingPage.description')}
                rows={3}
              />
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            {t('settings.sections.notification.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.notification.text')} (English)
              </label>
              <input
                type="text"
                value={settings.notification?.text?.en || ''}
                onChange={(e) =>
                  handleNotificationTextChange('en', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('settings.sections.notification.text')}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.notification.text')} (Vietnamese)
              </label>
              <input
                type="text"
                value={settings.notification?.text?.vi || ''}
                onChange={(e) =>
                  handleNotificationTextChange('vi', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder={t('settings.sections.notification.text')}
              />
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="notificationActive"
                checked={settings.notification?.isActive || false}
                onChange={(e) => handleNotificationToggle(e.target.checked)}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label
                htmlFor="notificationActive"
                className="ml-2 block text-sm text-gray-700"
              >
                {t('settings.sections.notification.showNotification')}
              </label>
            </div>
          </div>
        </div>

        {/* Contact Information Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            {t('settings.sections.contactInfo.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.contactInfo.address')} (English)
              </label>
              <input
                type="text"
                value={settings.sections.contactInfo.address.en}
                onChange={(e) =>
                  handleContactInfoChange('address', e.target.value, 'en')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.contactInfo.address')} (Vietnamese)
              </label>
              <input
                type="text"
                value={settings.sections.contactInfo.address.vi}
                onChange={(e) =>
                  handleContactInfoChange('address', e.target.value, 'vi')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.contactInfo.phone')}
              </label>
              <input
                type="text"
                value={settings.sections.contactInfo.phone}
                onChange={(e) =>
                  handleContactInfoChange('phone', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.contactInfo.email')}
              </label>
              <input
                type="email"
                value={settings.sections.contactInfo.email}
                onChange={(e) =>
                  handleContactInfoChange('email', e.target.value)
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        {/* Working Hours Section */}
        <div className="bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-lg font-semibold mb-4 text-gray-700">
            {t('settings.sections.workingHours.title')}
          </h2>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.workingHours.weekdays')} (English)
              </label>
              <input
                type="text"
                value={settings.sections.workingHours.weekdays.en}
                onChange={(e) =>
                  handleWorkingHoursChange('weekdays', e.target.value, 'en')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.workingHours.weekdays')} (Vietnamese)
              </label>
              <input
                type="text"
                value={settings.sections.workingHours.weekdays.vi}
                onChange={(e) =>
                  handleWorkingHoursChange('weekdays', e.target.value, 'vi')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.workingHours.saturday')} (English)
              </label>
              <input
                type="text"
                value={settings.sections.workingHours.saturday.en}
                onChange={(e) =>
                  handleWorkingHoursChange('saturday', e.target.value, 'en')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.workingHours.saturday')} (Vietnamese)
              </label>
              <input
                type="text"
                value={settings.sections.workingHours.saturday.vi}
                onChange={(e) =>
                  handleWorkingHoursChange('saturday', e.target.value, 'vi')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.workingHours.sunday')} (English)
              </label>
              <input
                type="text"
                value={settings.sections.workingHours.sunday.en}
                onChange={(e) =>
                  handleWorkingHoursChange('sunday', e.target.value, 'en')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('settings.sections.workingHours.sunday')} (Vietnamese)
              </label>
              <input
                type="text"
                value={settings.sections.workingHours.sunday.vi}
                onChange={(e) =>
                  handleWorkingHoursChange('sunday', e.target.value, 'vi')
                }
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-end">
          <button
            type="submit"
            disabled={isLoading}
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition-colors duration-300 disabled:opacity-50"
          >
            {isLoading
              ? t('settings.buttons.saving')
              : t('settings.buttons.save')}
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
