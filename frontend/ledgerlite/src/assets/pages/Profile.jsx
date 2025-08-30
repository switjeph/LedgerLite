import React, { useState } from "react";

export default function Profile() {
  const [avatar, setAvatar] = useState(null);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [birthday, setBirthday] = useState("");
  const [gender, setGender] = useState("");
  const [emailVerified, setEmailVerified] = useState(false);
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [mfa, setMfa] = useState(false);

  // Avatar upload handler (mock)
  const handleAvatarChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setAvatar(URL.createObjectURL(e.target.files[0]));
    }
  };

  // Resend email verification (mock)
  const handleResendVerification = () => {
    alert("Verification email sent!");
  };

  // Update profile handler (mock)
  const handleUpdateProfile = (e) => {
    e.preventDefault();
    alert("Profile updated!");
  };

  // Change password handler (mock)
  const handleChangePassword = (e) => {
    e.preventDefault();
    alert("Password changed!");
  };

  // Delete account handler (mock)
  const handleDeleteAccount = () => {
    if (window.confirm("Are you sure you want to delete your account?")) {
      alert("Account deleted!");
    }
  };

  return (
    <div className="p-6 max-w-xl mx-auto">
      <h1 className="text-3xl font-bold text-green-600 mb-6">Profile</h1>

      <div className="bg-white shadow rounded-xl p-6 space-y-6">
        <p className="text-gray-600">
          Update your personal information and account details.
        </p>

        {/* Avatar Upload */}
        <div className="flex items-center gap-4">
          <img
            src={avatar || "https://ui-avatars.com/api/?name=User"}
            alt="Avatar"
            className="w-20 h-20 rounded-full border"
          />
          <div>
            <label className="block text-gray-700 mb-1">Profile Picture</label>
            <input type="file" accept="image/*" onChange={handleAvatarChange} />
          </div>
        </div>

        {/* Profile Info */}
        <form onSubmit={handleUpdateProfile} className="space-y-4">
          <div>
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              className="w-full border rounded-lg px-4 py-2 mt-2"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Email</label>
            <input
              type="email"
              className="w-full border rounded-lg px-4 py-2 mt-2"
              placeholder="admin@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            <div className="flex items-center gap-2 mt-2">
              <span
                className={`text-xs ${
                  emailVerified ? "text-green-600" : "text-red-500"
                }`}
              >
                {emailVerified ? "Verified" : "Not Verified"}
              </span>
              {!emailVerified && (
                <button
                  type="button"
                  className="text-blue-500 underline text-xs"
                  onClick={handleResendVerification}
                >
                  Resend Verification
                </button>
              )}
            </div>
          </div>
          <div>
            <label className="block text-gray-700">Phone Number</label>
            <input
              type="tel"
              className="w-full border rounded-lg px-4 py-2 mt-2"
              placeholder="+1234567890"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Birthday</label>
            <input
              type="date"
              className="w-full border rounded-lg px-4 py-2 mt-2"
              value={birthday}
              onChange={(e) => setBirthday(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">Gender</label>
            <select
              className="w-full border rounded-lg px-4 py-2 mt-2"
              value={gender}
              onChange={(e) => setGender(e.target.value)}
            >
              <option value="">Select</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
          </div>
          <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 mt-4">
            Update Profile
          </button>
        </form>

        {/* Change Password */}
        <form onSubmit={handleChangePassword} className="space-y-4">
          <h2 className="font-semibold text-lg text-gray-700 mt-6">
            Change Password
          </h2>
          <div>
            <label className="block text-gray-700">Old Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-4 py-2 mt-2"
              value={oldPassword}
              onChange={(e) => setOldPassword(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-gray-700">New Password</label>
            <input
              type="password"
              className="w-full border rounded-lg px-4 py-2 mt-2"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
            />
          </div>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 mt-4">
            Change Password
          </button>
        </form>

        {/* Two-factor Authentication */}
        <div className="mt-6">
          <h2 className="font-semibold text-lg text-gray-700">
            Two-factor Authentication
          </h2>
          <label className="flex items-center gap-2 mt-2">
            <input
              type="checkbox"
              checked={mfa}
              onChange={(e) => setMfa(e.target.checked)}
            />
            Enable 2FA for extra security
          </label>
        </div>

        {/* Danger Zone */}
        <div className="mt-8">
          <h2 className="font-semibold text-lg text-red-600">Danger Zone</h2>
          <button
            className="bg-red-500 text-white px-4 py-2 rounded-lg mt-2"
            onClick={handleDeleteAccount}
          >
            Delete Account
          </button>
        </div>
      </div>
    </div>
  );
}
