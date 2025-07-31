import React, { useState } from "react";

const Settings = () => {
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");

  const [emailNotifications, setEmailNotifications] = useState(true);
  const [smsNotifications, setSmsNotifications] = useState(true);

  const handlePasswordChange = () => {
    if (newPassword !== confirmNewPassword) {
      alert("Passwords do not match!");
      return;
    }

    // Handle password change logic here (e.g., API call)
    alert("Password updated successfully.");
    setIsEditingPassword(false);
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-6">Settings</h2>

      {/* Notification Settings */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Notification Settings</h3>
        <div className="space-y-2">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={emailNotifications}
              onChange={() => setEmailNotifications((prev) => !prev)}
              className="mr-2"
            />
            <label>Email Notifications</label>
          </div>
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={smsNotifications}
              onChange={() => setSmsNotifications((prev) => !prev)}
              className="mr-2"
            />
            <label>SMS Notifications</label>
          </div>
        </div>
      </div>

      {/* Change Password Section */}
      <div className="space-y-4 mt-6">
        <h3 className="text-lg font-semibold">Change Password</h3>
        {!isEditingPassword ? (
          <div>
            <p className="text-gray-700">To change your password, click the button below.</p>
            <button
              onClick={() => setIsEditingPassword(true)}
              className="bg-yellow-500 text-white px-6 py-2 rounded-md mt-4"
            >
              Change Password
            </button>
          </div>
        ) : (
          <div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700">Confirm New Password</label>
              <input
                type="password"
                value={confirmNewPassword}
                onChange={(e) => setConfirmNewPassword(e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={handlePasswordChange}
                className="bg-red-500 text-white px-6 py-2 rounded-md"
              >
                Save Changes
              </button>
              <button
                onClick={() => setIsEditingPassword(false)}
                className="text-gray-500 px-6 py-2 rounded-md border border-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Settings;
