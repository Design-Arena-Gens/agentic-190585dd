'use client';

import { useState } from 'react';
import { Save } from 'lucide-react';

export default function SettingsPage() {
  const [settings, setSettings] = useState({
    autoPostEnabled: false,
    postIntervalHours: 4,
    defaultTone: 'professional',
    defaultLanguage: 'en',
    enabledPlatforms: ['facebook', 'instagram', 'twitter', 'linkedin'],
  });

  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save settings
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600">Configure your AI agent settings</p>
      </div>

      {saved && (
        <div className="card bg-green-50 border-green-200">
          <p className="text-green-800">Settings saved successfully!</p>
        </div>
      )}

      {/* Automation Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Automation Settings
        </h2>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <label className="font-medium text-gray-900">
                Enable Auto-Posting
              </label>
              <p className="text-sm text-gray-600">
                Automatically post generated content at set intervals
              </p>
            </div>
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={settings.autoPostEnabled}
                onChange={(e) =>
                  setSettings({ ...settings, autoPostEnabled: e.target.checked })
                }
                className="sr-only peer"
              />
              <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary-600"></div>
            </label>
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Post Interval (Hours)
            </label>
            <input
              type="number"
              min="1"
              max="24"
              value={settings.postIntervalHours}
              onChange={(e) =>
                setSettings({
                  ...settings,
                  postIntervalHours: parseInt(e.target.value),
                })
              }
              className="input w-32"
            />
            <p className="text-sm text-gray-600 mt-1">
              How often to automatically post new content
            </p>
          </div>
        </div>
      </div>

      {/* Content Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Content Settings
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Default Tone
            </label>
            <select
              value={settings.defaultTone}
              onChange={(e) =>
                setSettings({ ...settings, defaultTone: e.target.value })
              }
              className="input"
            >
              <option value="funny">Funny</option>
              <option value="professional">Professional</option>
              <option value="informative">Informative</option>
            </select>
          </div>

          <div>
            <label className="block font-medium text-gray-900 mb-2">
              Default Language
            </label>
            <select
              value={settings.defaultLanguage}
              onChange={(e) =>
                setSettings({ ...settings, defaultLanguage: e.target.value })
              }
              className="input"
            >
              <option value="en">English</option>
              <option value="ur">Urdu</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="de">German</option>
            </select>
          </div>
        </div>
      </div>

      {/* Platform Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          Enabled Platforms
        </h2>

        <div className="space-y-2">
          {[
            'facebook',
            'instagram',
            'twitter',
            'linkedin',
            'youtube',
            'pinterest',
            'threads',
          ].map((platform) => (
            <label
              key={platform}
              className="flex items-center space-x-2 cursor-pointer"
            >
              <input
                type="checkbox"
                checked={settings.enabledPlatforms.includes(platform)}
                onChange={(e) => {
                  if (e.target.checked) {
                    setSettings({
                      ...settings,
                      enabledPlatforms: [...settings.enabledPlatforms, platform],
                    });
                  } else {
                    setSettings({
                      ...settings,
                      enabledPlatforms: settings.enabledPlatforms.filter(
                        (p) => p !== platform
                      ),
                    });
                  }
                }}
                className="rounded border-gray-300 text-primary-600 focus:ring-primary-500"
              />
              <span className="text-gray-900 capitalize">{platform}</span>
            </label>
          ))}
        </div>
      </div>

      {/* API Settings */}
      <div className="card">
        <h2 className="text-lg font-semibold text-gray-900 mb-4">
          API Configuration
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block font-medium text-gray-900 mb-2">
              OpenAI API Key
            </label>
            <input
              type="password"
              placeholder="sk-..."
              className="input"
              defaultValue="demo-mode"
            />
            <p className="text-sm text-gray-600 mt-1">
              Required for AI content generation and image creation
            </p>
          </div>

          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-sm text-yellow-800">
              <strong>Note:</strong> For production use, add your API keys to the .env file for security. Never commit API keys to version control.
            </p>
          </div>
        </div>
      </div>

      {/* Save Button */}
      <div className="flex justify-end">
        <button onClick={handleSave} className="btn btn-primary flex items-center">
          <Save className="h-4 w-4 mr-2" />
          Save Settings
        </button>
      </div>
    </div>
  );
}
