import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle, FaTimes, FaEnvelope, FaUser, FaShieldAlt, FaCalendar } from "react-icons/fa";

const getInitials = (name) => {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase();
};

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [deleting, setDeleting] = useState("");
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("http://localhost:3000/api/v1/customers/getAllCustomers", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers(response.data.data || []);
    } catch (err) {
      setError("Failed to fetch users. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const handleViewUser = (user) => {
    setSelectedUser(user);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedUser(null);
  };

  const handleDelete = async (userId, userName) => {
    if (!window.confirm(`Are you sure you want to delete user '${userName}'? This action cannot be undone.`)) return;
    setDeleting(userId);
    try {
      const token = localStorage.getItem("token");
      await axios.post(`http://localhost:3000/api/v1/customers/deleteCustomer/${userId}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.filter((u) => u._id !== userId));
    } catch (err) {
      let details = "";
      if (err.response) {
        details = `\nStatus: ${err.response.status}\nURL: ${err.config.url}\nResponse: ${JSON.stringify(err.response.data)}`;
      } else {
        details = `\nError: ${err.message}`;
      }
      alert(`Failed to delete user. Details:${details}`);
      console.error("Delete user error:", err);
    } finally {
      setDeleting("");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-white to-yellow-100 p-0 md:p-8">
      <div className="max-w-5xl mx-auto">
        <div className="backdrop-blur-lg bg-white/60 border border-yellow-100 shadow-2xl rounded-3xl px-8 py-10 mb-10">
          <h2 className="text-3xl font-extrabold text-yellow-900 mb-6 tracking-tight drop-shadow-lg">Users</h2>
          {loading && <div className="text-yellow-700 text-lg py-8">Loading users...</div>}
          {error && <div className="text-red-600 text-lg py-8">{error}</div>}
          {!loading && !error && (
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white/80 rounded-2xl">
                <thead>
                  <tr className="bg-yellow-50">
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-900">Name</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-900">Email</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-900">Role</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-900">Status</th>
                    <th className="px-6 py-3 text-left text-sm font-bold text-yellow-900">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="border-b last:border-b-0 hover:bg-yellow-50 transition">
                      <td className="px-6 py-4 text-sm font-semibold text-gray-800 flex items-center gap-3">
                        {user.image ? (
                          <img src={`http://localhost:5000/uploads/${user.image}`} alt={user.fname || user.lname || user.email} className="w-9 h-9 rounded-full border-2 border-yellow-200 shadow" />
                        ) : (
                          <span className="w-9 h-9 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-900 font-bold text-lg border-2 border-yellow-100 shadow">
                            {getInitials(`${user.fname || ""} ${user.lname || ""}`.trim() || user.email)}
                          </span>
                        )}
                        {user.fname || user.lname ? `${user.fname || ""} ${user.lname || ""}`.trim() : user.email}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                      <td className="px-6 py-4 text-sm text-yellow-700 font-bold tracking-wide">{user.role}</td>
                      <td className="px-6 py-4 text-sm">
                        <span
                          className={`inline-block px-3 py-1 rounded-full text-xs font-bold tracking-wide shadow ${
                            user.status === "Active"
                              ? "bg-green-100 text-green-700"
                              : "bg-gray-100 text-gray-700"
                          }`}
                        >
                          {user.status || (user.isActive === false ? "Inactive" : "Active")}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm flex gap-2 flex-wrap">
                        <button
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full font-bold shadow hover:from-yellow-500 hover:to-yellow-700 transition-all"
                          onClick={() => handleViewUser(user)}
                        >
                          View
                        </button>
                        <button
                          className="bg-gradient-to-r from-gray-700 to-red-700 text-white px-4 py-1 rounded-full font-bold shadow hover:from-red-800 hover:to-red-900 transition-all"
                          disabled={deleting === user._id}
                          onClick={() => handleDelete(user._id, user.fname || user.lname || user.email)}
                        >
                          {deleting === user._id ? "Deleting..." : "Delete"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* User Details Modal */}
      {showModal && selectedUser && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-3xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-2xl font-bold text-yellow-900">User Details</h3>
                <button
                  onClick={handleCloseModal}
                  className="text-gray-500 hover:text-gray-700 transition-colors"
                >
                  <FaTimes size={24} />
                </button>
              </div>

              <div className="space-y-6">
                {/* User Avatar and Name */}
                <div className="text-center">
                  {selectedUser.image ? (
                    <img 
                      src={`http://localhost:5000/uploads/${selectedUser.image}`} 
                      alt={selectedUser.fname || selectedUser.lname || selectedUser.email} 
                      className="w-20 h-20 rounded-full border-4 border-yellow-200 shadow-lg mx-auto mb-4" 
                    />
                  ) : (
                    <div className="w-20 h-20 rounded-full bg-yellow-200 flex items-center justify-center text-yellow-900 font-bold text-3xl border-4 border-yellow-100 shadow-lg mx-auto mb-4">
                      {getInitials(`${selectedUser.fname || ""} ${selectedUser.lname || ""}`.trim() || selectedUser.email)}
                    </div>
                  )}
                  <h4 className="text-xl font-bold text-gray-800">
                    {selectedUser.fname || selectedUser.lname ? `${selectedUser.fname || ""} ${selectedUser.lname || ""}`.trim() : 'No Name'}
                  </h4>
                </div>

                {/* User Information */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaEnvelope className="text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Email</p>
                      <p className="font-semibold text-gray-800">{selectedUser.email}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaUser className="text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Full Name</p>
                      <p className="font-semibold text-gray-800">
                        {selectedUser.fname || selectedUser.lname ? `${selectedUser.fname || ""} ${selectedUser.lname || ""}`.trim() : 'Not provided'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaShieldAlt className="text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Role</p>
                      <p className="font-semibold text-gray-800 capitalize">{selectedUser.role}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <FaCalendar className="text-yellow-600" />
                    <div>
                      <p className="text-sm text-gray-600">Joined</p>
                      <p className="font-semibold text-gray-800">
                        {selectedUser.createdAt ? new Date(selectedUser.createdAt).toLocaleDateString() : 'Unknown'}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <div className="w-4 h-4 rounded-full bg-green-500"></div>
                    <div>
                      <p className="text-sm text-gray-600">Status</p>
                      <p className="font-semibold text-gray-800">
                        {selectedUser.status || (selectedUser.isActive === false ? "Inactive" : "Active")}
                      </p>
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <div className="pt-4">
                  <button
                    onClick={handleCloseModal}
                    className="w-full bg-gradient-to-r from-yellow-400 to-yellow-600 text-white font-bold py-3 px-6 rounded-2xl hover:from-yellow-500 hover:to-yellow-700 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
