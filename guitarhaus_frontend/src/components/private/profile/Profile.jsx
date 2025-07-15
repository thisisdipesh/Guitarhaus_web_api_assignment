import React, { useState } from "react";

const Profile = () => {
  // Mock user data (Replace with actual API fetch)
  const user = {
    name: "John Doe",
    email: "john.doe@example.com",
    phone: "+1234567890",
    address: "123 Main Street, Anytown, USA",
    profilePic: "https://via.placeholder.com/150", // Current profile picture URL
  };

  const [isEditing, setIsEditing] = useState(false);
  const [updatedUser, setUpdatedUser] = useState({ ...user });
  const [file, setFile] = useState(null); // For previewing the selected image

  // Handle input changes for editable fields
  const handleChange = (e) => {
    const { name, value } = e.target;
    setUpdatedUser((prevState) => ({
      ...prevState,
      [name]: value,
    }));
  };

  // Handle image file selection
  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      setFile(URL.createObjectURL(selectedFile)); // Preview the selected image
    }
  };

  // Toggle edit mode
  const toggleEdit = () => {
    setIsEditing((prev) => !prev);
  };

  // Save profile changes (Replace with actual API logic)
  const handleSave = () => {
    // Save the updated user data (e.g., send a request to the API)
    console.log("Profile saved:", updatedUser);
    toggleEdit();
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h2 className="text-2xl font-semibold mb-4">{isEditing ? "Edit Profile" : "Profile"}</h2>
      
      <div className="flex items-center gap-6 mb-6">
        {/* Current Profile Picture */}
        <div className="w-32 h-32 rounded-full overflow-hidden">
          <img
            src={file || updatedUser.profilePic} // Show preview if file selected, else current profile picture
            alt="Profile"
            className="w-full h-full object-cover"
          />
        </div>
        {isEditing && (
          <div>
            <label className="block text-sm font-medium text-gray-700">Change Profile Picture</label>
            <input
              type="file"
              className="mt-1 block w-full text-sm text-gray-700"
              onChange={handleFileChange}
            />
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* User Info */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Name</label>
          <input
            type="text"
            name="name"
            value={updatedUser.name}
            disabled={!isEditing}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={updatedUser.email}
            disabled={!isEditing}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Phone</label>
          <input
            type="text"
            name="phone"
            value={updatedUser.phone}
            disabled={!isEditing}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Address</label>
          <textarea
            name="address"
            value={updatedUser.address}
            disabled={!isEditing}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md p-2"
            rows="3"
          />
        </div>
      </div>

      <div className="mt-6 flex justify-end gap-4">
        {isEditing ? (
          <>
            <button
              onClick={handleSave}
              className="bg-red-500 text-white px-6 py-2 rounded-md"
            >
              Save
            </button>
            <button
              onClick={toggleEdit}
              className="text-gray-500 px-6 py-2 rounded-md border border-gray-300"
            >
              Cancel
            </button>
          </>
        ) : (
          <button
            onClick={toggleEdit}
            className="bg-yellow-500 text-white px-6 py-2 rounded-md"
          >
            Edit Profile
          </button>
        )}
      </div>

      <div className="bg-white shadow-md rounded-lg p-6">
        <h3 className="text-xl font-semibold mb-4">Account Settings</h3>
        <button
          onClick={() => alert("Navigate to settings")}
          className="bg-red-500 text-white px-6 py-2 rounded-md"
        >
          Go to Settings
        </button>
      </div>
    </div>
  );
};

export default Profile;
