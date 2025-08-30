import React, { useState } from "react";

const initialCategories = [
  "Salary",
  "Groceries",
  "Utilities",
  "Investment",
  "Other",
];
const initialSessions = [
  { id: 1, device: "Chrome on Windows", lastActive: "2025-08-27 10:15" },
  { id: 2, device: "Safari on iPhone", lastActive: "2025-08-26 21:02" },
];
const initialApiKeys = [
  { id: 1, key: "sk_test_1234567890", created: "2025-08-01" },
];
const initialActivity = [
  { id: 1, action: "Logged in", time: "2025-08-27 10:15" },
  { id: 2, action: "Changed password", time: "2025-08-26 20:55" },
];

export default function Settings() {
  const [theme, setTheme] = useState("light");
  const [currency, setCurrency] = useState("USD");
  const [notifications, setNotifications] = useState(true);
  const [mfa, setMfa] = useState(false);
  const [sessions, setSessions] = useState(initialSessions);
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");
  const [language, setLanguage] = useState("en");
  const [apiKeys, setApiKeys] = useState(initialApiKeys);
  const [activity] = useState(initialActivity);
  const [scheduledBackup, setScheduledBackup] = useState(false);
  const [fontSize, setFontSize] = useState("md");
  const [integration, setIntegration] = useState(false);

  // Category management
  const handleAddCategory = () => {
    const cat = newCategory.trim();
    if (cat && !categories.includes(cat)) {
      setCategories([...categories, cat]);
      setNewCategory("");
    }
  };
  const handleRemoveCategory = (cat) => {
    if (window.confirm(`Remove category "${cat}"?`)) {
      setCategories(categories.filter((c) => c !== cat));
    }
  };

  // Session revoke
  const handleRevokeSession = (id) => {
    setSessions(sessions.filter((s) => s.id !== id));
  };

  // API Key management
  const handleAddApiKey = () => {
    setApiKeys([
      ...apiKeys,
      {
        id: Date.now(),
        key: "sk_test_" + Math.random().toString(36).slice(2, 12),
        created: new Date().toISOString().slice(0, 10),
      },
    ]);
  };
  const handleRemoveApiKey = (id) => {
    setApiKeys(apiKeys.filter((k) => k.id !== id));
  };

  return (
    <div className="p-6 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold text-blue-600 mb-4">Settings</h1>
      <p className="text-gray-700 mb-6">
        Manage application preferences, security, and system configurations.
      </p>

      {/* Profile Settings */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Profile</h2>
        <form>
          <div className="mb-2">
            <label className="block text-sm">Name</label>
            <input
              type="text"
              className="border rounded px-2 py-1 w-full"
              placeholder="Your Name"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Email</label>
            <input
              type="email"
              className="border rounded px-2 py-1 w-full"
              placeholder="you@email.com"
            />
          </div>
          <div className="mb-2">
            <label className="block text-sm">Password</label>
            <input
              type="password"
              className="border rounded px-2 py-1 w-full"
              placeholder="New Password"
            />
          </div>
          <button className="bg-blue-500 text-white px-4 py-2 rounded mt-2">
            Update Profile
          </button>
        </form>
      </div>

      {/* Theme Selection */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Theme</h2>
        <div className="flex gap-4">
          <button
            className={`px-4 py-2 rounded ${
              theme === "light" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTheme("light")}
          >
            Light
          </button>
          <button
            className={`px-4 py-2 rounded ${
              theme === "dark" ? "bg-blue-500 text-white" : "bg-gray-200"
            }`}
            onClick={() => setTheme("dark")}
          >
            Dark
          </button>
        </div>
      </div>

      {/* Currency Preference */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Currency</h2>
        <select
          className="border rounded px-2 py-1"
          value={currency}
          onChange={(e) => setCurrency(e.target.value)}
        >
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="NGN">NGN - Nigerian Naira</option>
          <option value="INR">INR - Indian Rupee</option>
        </select>
      </div>

      {/* Language Selection */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Language</h2>
        <select
          className="border rounded px-2 py-1"
          value={language}
          onChange={(e) => setLanguage(e.target.value)}
        >
          <option value="en">English</option>
          <option value="fr">French</option>
          <option value="es">Spanish</option>
          <option value="de">German</option>
          <option value="zh">Chinese</option>
        </select>
      </div>

      {/* Notification Preferences */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Notifications</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={notifications}
            onChange={(e) => setNotifications(e.target.checked)}
          />
          Enable email/app notifications
        </label>
      </div>

      {/* Multi-factor Authentication */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Multi-factor Authentication</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={mfa}
            onChange={(e) => setMfa(e.target.checked)}
          />
          Enable MFA for extra security
        </label>
      </div>

      {/* Session Management */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Active Sessions</h2>
        <ul>
          {sessions.map((s) => (
            <li
              key={s.id}
              className="flex justify-between items-center py-1 border-b last:border-b-0"
            >
              <span>
                {s.device}{" "}
                <span className="text-xs text-gray-500">({s.lastActive})</span>
              </span>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleRevokeSession(s.id)}
              >
                Revoke
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Custom Categories */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Custom Categories</h2>
        <div className="flex flex-wrap gap-2 mb-2">
          {categories.map((cat) => (
            <span
              key={cat}
              className="bg-gray-200 px-2 py-1 rounded flex items-center"
            >
              {cat}
              <button
                className="ml-2 text-red-500 hover:text-red-700"
                onClick={() => handleRemoveCategory(cat)}
                title="Remove"
              >
                &times;
              </button>
            </span>
          ))}
        </div>
        <div className="flex gap-2">
          <input
            type="text"
            placeholder="New category"
            className="border rounded px-2 py-1"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
          />
          <button
            className="bg-indigo-500 text-white px-3 py-1 rounded"
            onClick={handleAddCategory}
          >
            Add Category
          </button>
        </div>
      </div>

      {/* API Key Management */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">API Access</h2>
        <ul>
          {apiKeys.map((k) => (
            <li
              key={k.id}
              className="flex justify-between items-center py-1 border-b last:border-b-0"
            >
              <span className="font-mono">
                {k.key}{" "}
                <span className="text-xs text-gray-500">({k.created})</span>
              </span>
              <button
                className="text-red-500 hover:underline"
                onClick={() => handleRemoveApiKey(k.id)}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
        <button
          className="bg-green-500 text-white px-3 py-1 rounded mt-2"
          onClick={handleAddApiKey}
        >
          Generate API Key
        </button>
      </div>

      {/* Account Activity Log */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Account Activity Log</h2>
        <ul>
          {activity.map((a) => (
            <li key={a.id} className="py-1 border-b last:border-b-0">
              <span>{a.action}</span>{" "}
              <span className="text-xs text-gray-500">({a.time})</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Scheduled Backups */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Scheduled Backups</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={scheduledBackup}
            onChange={(e) => setScheduledBackup(e.target.checked)}
          />
          Enable automatic weekly backups
        </label>
      </div>

      {/* Accessibility Options */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Accessibility</h2>
        <label className="block mb-2">Font Size</label>
        <select
          className="border rounded px-2 py-1"
          value={fontSize}
          onChange={(e) => setFontSize(e.target.value)}
        >
          <option value="sm">Small</option>
          <option value="md">Medium</option>
          <option value="lg">Large</option>
        </select>
      </div>

      {/* Integration Settings */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Integration Settings</h2>
        <label className="flex items-center gap-2">
          <input
            type="checkbox"
            checked={integration}
            onChange={(e) => setIntegration(e.target.checked)}
          />
          Connect to Google Drive/Dropbox (mock)
        </label>
      </div>

      {/* Custom Dashboard Layout */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Custom Dashboard Layout</h2>
        <p className="text-gray-600">
          Personalize your dashboard widgets and order (coming soon).
        </p>
      </div>

      {/* Data Backup & Restore */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">Data Backup & Restore</h2>
        <button className="bg-green-500 text-white px-4 py-2 rounded mr-2">
          Export Data
        </button>
        <button className="bg-indigo-500 text-white px-4 py-2 rounded">
          Import Data
        </button>
      </div>

      {/* Delete Account */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2 text-red-600">Danger Zone</h2>
        <button className="bg-red-500 text-white px-4 py-2 rounded">
          Delete Account
        </button>
      </div>

      {/* About & Support */}
      <div className="bg-white shadow rounded-lg p-4 mb-6">
        <h2 className="font-semibold mb-2">About & Support</h2>
        <p className="mb-2">
          LedgerLite v1.0. Need help?{" "}
          <a
            href="mailto:support@ledgerlite.com"
            className="text-blue-500 underline"
          >
            Contact Support
          </a>
        </p>
      </div>
    </div>
  );
}
