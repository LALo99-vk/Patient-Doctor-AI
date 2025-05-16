import React, { useState } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { useLanguage, Language } from '../../context/LanguageContext';

interface UserSettings {
  name: string;
  email: string;
  phone: string;
  address: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
  notifications: {
    email: boolean;
    sms: boolean;
    appointmentReminders: boolean;
    prescriptionUpdates: boolean;
  };
}

const languageOptions: { code: Language; name: string }[] = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'हिंदी (Hindi)' },
  { code: 'bn', name: 'বাংলা (Bengali)' },
  { code: 'ta', name: 'தமிழ் (Tamil)' },
  { code: 'te', name: 'తెలుగు (Telugu)' },
  { code: 'mr', name: 'मराठी (Marathi)' },
  { code: 'gu', name: 'ગુજરાતી (Gujarati)' },
  { code: 'kn', name: 'ಕನ್ನಡ (Kannada)' },
  { code: 'ml', name: 'മലയാളം (Malayalam)' },
  { code: 'pa', name: 'ਪੰਜਾਬੀ (Punjabi)' },
];

const Settings: React.FC = () => {
  const { user } = useAuth();
  const { language, setLanguage, t } = useLanguage();
  const [activeTab, setActiveTab] = useState<'profile' | 'notifications' | 'security' | 'language'>('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [settings, setSettings] = useState<UserSettings>({
    name: user?.name || '',
    email: user?.email || '',
    phone: '+1 (555) 123-4567',
    address: '123 Medical Center Dr, Suite 100',
    emergencyContact: {
      name: 'John Doe',
      phone: '+1 (555) 987-6543',
      relationship: 'Spouse'
    },
    notifications: {
      email: true,
      sms: true,
      appointmentReminders: true,
      prescriptionUpdates: true
    }
  });

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically make an API call to update the user's profile
    setIsEditing(false);
  };

  const handleNotificationChange = (key: keyof UserSettings['notifications']) => {
    setSettings(prev => ({
      ...prev,
      notifications: {
        ...prev.notifications,
        [key]: !prev.notifications[key]
      }
    }));
  };

  const handleLanguageChange = (newLanguage: Language) => {
    setLanguage(newLanguage);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-semibold text-gray-900">{t('settings')}</h1>
      </div>

      <div className="flex space-x-4 border-b border-gray-200">
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'profile'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('profile')}
        >
          {t('profile')}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'notifications'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('notifications')}
        >
          {t('notifications')}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'security'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('security')}
        >
          {t('security')}
        </button>
        <button
          className={`px-4 py-2 text-sm font-medium ${
            activeTab === 'language'
              ? 'border-b-2 border-blue-500 text-blue-600'
              : 'text-gray-500 hover:text-gray-700'
          }`}
          onClick={() => setActiveTab('language')}
        >
          {t('language')}
        </button>
      </div>

      {activeTab === 'profile' && (
        <Card className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-lg font-semibold text-gray-900">{t('profile')}</h2>
            <Button
              variant="outline"
              onClick={() => setIsEditing(!isEditing)}
            >
              {isEditing ? t('cancel') : t('edit')}
            </Button>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('name')}
                </label>
                <Input
                  type="text"
                  value={settings.name}
                  onChange={(e) => setSettings({ ...settings, name: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('email')}
                </label>
                <Input
                  type="email"
                  value={settings.email}
                  onChange={(e) => setSettings({ ...settings, email: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('phone')}
                </label>
                <Input
                  type="tel"
                  value={settings.phone}
                  onChange={(e) => setSettings({ ...settings, phone: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {t('address')}
                </label>
                <Input
                  type="text"
                  value={settings.address}
                  onChange={(e) => setSettings({ ...settings, address: e.target.value })}
                  disabled={!isEditing}
                />
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-md font-medium text-gray-900 mb-4">{t('emergency_contact')}</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('name')}
                  </label>
                  <Input
                    type="text"
                    value={settings.emergencyContact.name}
                    onChange={(e) => setSettings({
                      ...settings,
                      emergencyContact: { ...settings.emergencyContact, name: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phone')}
                  </label>
                  <Input
                    type="tel"
                    value={settings.emergencyContact.phone}
                    onChange={(e) => setSettings({
                      ...settings,
                      emergencyContact: { ...settings.emergencyContact, phone: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('relationship')}
                  </label>
                  <Input
                    type="text"
                    value={settings.emergencyContact.relationship}
                    onChange={(e) => setSettings({
                      ...settings,
                      emergencyContact: { ...settings.emergencyContact, relationship: e.target.value }
                    })}
                    disabled={!isEditing}
                  />
                </div>
              </div>
            </div>

            {isEditing && (
              <div className="flex justify-end space-x-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setIsEditing(false)}
                >
                  {t('cancel')}
                </Button>
                <Button type="submit" variant="primary">
                  {t('save')}
                </Button>
              </div>
            )}
          </form>
        </Card>
      )}

      {activeTab === 'notifications' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('notifications')}</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">Email {t('notifications')}</h3>
                <p className="text-sm text-gray-500">Receive notifications via email</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.email}
                  onChange={() => handleNotificationChange('email')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">SMS {t('notifications')}</h3>
                <p className="text-sm text-gray-500">Receive notifications via text message</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.sms}
                  onChange={() => handleNotificationChange('sms')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{t('appointments')} Reminders</h3>
                <p className="text-sm text-gray-500">Get reminded about upcoming appointments</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.appointmentReminders}
                  onChange={() => handleNotificationChange('appointmentReminders')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>

            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-medium text-gray-900">{t('prescriptions')} Updates</h3>
                <p className="text-sm text-gray-500">Get notified about prescription changes and refills</p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  className="sr-only peer"
                  checked={settings.notifications.prescriptionUpdates}
                  onChange={() => handleNotificationChange('prescriptionUpdates')}
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'security' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('security')}</h2>
          <div className="space-y-6">
            <div>
              <h3 className="text-sm font-medium text-gray-900 mb-2">{t('change_password')}</h3>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('current_password')}
                  </label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('new_password')}
                  </label>
                  <Input type="password" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('confirm_password')}
                  </label>
                  <Input type="password" />
                </div>
                <div className="flex justify-end">
                  <Button variant="primary">
                    {t('update_password')}
                  </Button>
                </div>
              </form>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-sm font-medium text-gray-900 mb-2">{t('two_factor_auth')}</h3>
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-500">Add an extra layer of security to your account</p>
                </div>
                <Button variant="outline">
                  {t('enable_2fa')}
                </Button>
              </div>
            </div>
          </div>
        </Card>
      )}

      {activeTab === 'language' && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">{t('language')}</h2>
          <div className="space-y-4">
            <p className="text-sm text-gray-500 mb-4">{t('select_language')}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {languageOptions.map((option) => (
                <button
                  key={option.code}
                  className={`p-4 border rounded-lg text-left transition-colors ${
                    language === option.code
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-300'
                  }`}
                  onClick={() => handleLanguageChange(option.code)}
                >
                  <span className="font-medium">{option.name}</span>
                </button>
              ))}
            </div>
          </div>
        </Card>
      )}
    </div>
  );
};

export default Settings; 