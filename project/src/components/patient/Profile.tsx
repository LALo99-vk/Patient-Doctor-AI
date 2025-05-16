import React, { useState, useRef, useEffect } from 'react';
import Card from '../ui/Card';
import Button from '../ui/Button';
import Input from '../ui/Input';
import { useAuth } from '../../context/AuthContext';
import { getUser, updateUser } from '../../api';

const defaultProfilePic = 'https://ui-avatars.com/api/?name=User&background=0D8ABC&color=fff&size=128';

const Profile: React.FC = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string>(user?.profilePic || defaultProfilePic);
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    address: user?.address || '',
    gender: user?.gender || '',
    age: user?.age || '',
    bloodType: user?.bloodType || '',
    allergies: user?.allergies?.join(', ') || '',
    conditions: user?.conditions?.join(', ') || '',
  });
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (user?.id) {
      getUser(user.id).then(res => {
        const data = res.data;
        setForm({
          name: data.name || '',
          email: data.email || '',
          phone: data.phone || '',
          address: data.address || '',
          gender: data.gender || '',
          age: data.age || '',
          bloodType: data.bloodType || '',
          allergies: data.allergies?.join(', ') || '',
          conditions: data.conditions?.join(', ') || '',
        });
        setProfilePic(data.profilePic || defaultProfilePic);
      });
    }
  }, [user?.id]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        setProfilePic(ev.target?.result as string);
      };
      reader.readAsDataURL(e.target.files[0]);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id) return;
    const updatedUser = {
      ...form,
      profilePic,
      allergies: form.allergies.split(',').map(a => a.trim()),
      conditions: form.conditions.split(',').map(c => c.trim()),
    };
    await updateUser(user.id, updatedUser);
    setIsEditing(false);
  };

  return (
    <div className="max-w-2xl mx-auto mt-8">
      <Card>
        <div className="flex flex-col items-center mb-6">
          <div className="relative">
            <img
              src={profilePic}
              alt="Profile"
              className="w-28 h-28 rounded-full object-cover border-4 border-blue-200"
            />
            {isEditing && (
              <button
                className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full p-2 shadow-lg hover:bg-blue-700 focus:outline-none"
                onClick={() => fileInputRef.current?.click()}
                type="button"
              >
                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536M9 13h3l8-8a2.828 2.828 0 10-4-4l-8 8v3z" />
                </svg>
              </button>
            )}
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              className="hidden"
              onChange={handleProfilePicChange}
            />
          </div>
          <h2 className="text-2xl font-semibold text-gray-900 mt-4">{form.name}</h2>
          <p className="text-gray-500">{form.email}</p>
        </div>
        <form onSubmit={handleSave} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
              <Input
                name="name"
                type="text"
                value={form.name}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <Input
                name="email"
                type="email"
                value={form.email}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <Input
                name="phone"
                type="tel"
                value={form.phone}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Address</label>
              <Input
                name="address"
                type="text"
                value={form.address}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
              <Input
                name="gender"
                type="text"
                value={form.gender}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Age</label>
              <Input
                name="age"
                type="number"
                value={form.age}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
              <Input
                name="bloodType"
                type="text"
                value={form.bloodType}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Allergies (comma separated)</label>
              <Input
                name="allergies"
                type="text"
                value={form.allergies}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Medical Conditions (comma separated)</label>
              <Input
                name="conditions"
                type="text"
                value={form.conditions}
                onChange={handleInputChange}
                disabled={!isEditing}
              />
            </div>
          </div>
          <div className="flex justify-end space-x-2 mt-4">
            {isEditing ? (
              <>
                <Button type="button" variant="outline" onClick={() => setIsEditing(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="primary">
                  Save
                </Button>
              </>
            ) : (
              <Button type="button" variant="primary" onClick={() => setIsEditing(true)}>
                Edit Profile
              </Button>
            )}
          </div>
        </form>
      </Card>
    </div>
  );
};

export default Profile; 