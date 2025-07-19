import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaUserCircle } from "react-icons/fa";

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

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      setError("");
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get("http://localhost:3000/api/v1/customers", {
          headers: { Authorization: `Bearer ${token}` },
        });
        setUsers(response.data.data || []);
      } catch (err) {
        setError("Failed to fetch users. Please try again.");
      } finally {
        setLoading(false);
      }
    };
    fetchUsers();
  }, []);

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
                          <img src={`http://localhost:3000/uploads/${user.image}`} alt={user.fname || user.lname || user.email} className="w-9 h-9 rounded-full border-2 border-yellow-200 shadow" />
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
                      <td className="px-6 py-4 text-sm flex gap-2">
                        <button
                          className="bg-gradient-to-r from-yellow-400 to-yellow-600 text-white px-4 py-1 rounded-full font-bold shadow hover:from-yellow-500 hover:to-yellow-700 transition-all"
                          onClick={() => alert(`View user details for ${user.fname || user.lname || user.email}`)}
                        >
                          View
                        </button>
                        {(user.status === "Active" || user.isActive !== false) && (
                          <button
                            className="bg-gradient-to-r from-red-400 to-red-600 text-white px-4 py-1 rounded-full font-bold shadow hover:from-red-500 hover:to-red-700 transition-all"
                            onClick={() => alert(`Deactivate user ${user.fname || user.lname || user.email}`)}
                          >
                            Deactivate
                          </button>
                        )}
                        {(user.status === "Inactive" || user.isActive === false) && (
                          <button
                            className="bg-gradient-to-r from-green-400 to-green-600 text-white px-4 py-1 rounded-full font-bold shadow hover:from-green-500 hover:to-green-700 transition-all"
                            onClick={() => alert(`Activate user ${user.fname || user.lname || user.email}`)}
                          >
                            Activate
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Users;
