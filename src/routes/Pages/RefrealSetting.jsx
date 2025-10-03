import React, { useState, useEffect } from 'react';
import axios from 'axios';
import API_BASE_URL from "../../components/Config";
const RefrealSetting = () => {
  const [settings, setSettings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [newSetting, setNewSetting] = useState({ key: '', value: '' });

  const fetchSettings = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_BASE_URL}/api/settings`);
      setSettings(res.data);
    } catch (error) {
      console.error('Error fetching settings:', error);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      const settingsToSave = [...settings];
      if (newSetting.key && newSetting.value) {
        settingsToSave.push(newSetting);
      }
      await axios.put(`${API_BASE_URL}/api/settings`, { settings: settingsToSave });
      alert('Settings saved successfully!');
      setNewSetting({ key: '', value: '' });
      fetchSettings(); // Refresh settings after saving
    } catch (error) {
      console.error('Error saving settings:', error);
      alert('Failed to save settings.');
    }
  };

  const handleChange = (key, value) => {
    setSettings((prevSettings) =>
      prevSettings.map((setting) =>
        setting.key === key ? { ...setting, value } : setting
      )
    );
  };

  const handleNewSettingChange = (field, value) => {
    setNewSetting((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Settings</h1>
      {loading ? (
        <p>Loading...</p>
      ) : (
        <div>
          {settings.map((setting) => (
            <div key={setting.key} className="mb-4">
              <label className="block text-gray-700 text-sm font-bold mb-2">
                {setting.key}
              </label>
              <input
                type="text"
                value={setting.value}
                onChange={(e) => handleChange(setting.key, e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          ))}
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Add New Setting</h2>
            <div className="flex gap-4">
              <input
                type="text"
                placeholder="Key"
                value={newSetting.key}
                onChange={(e) => handleNewSettingChange('key', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
              <input
                type="text"
                placeholder="Value"
                value={newSetting.value}
                onChange={(e) => handleNewSettingChange('value', e.target.value)}
                className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              />
            </div>
          </div>
          <button
            onClick={handleSave}
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
          >
            Save Settings
          </button>
        </div>
      )}
    </div>
  );
};

export default RefrealSetting;
