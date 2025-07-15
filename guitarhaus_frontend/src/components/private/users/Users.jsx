import React from "react";
import { FaEdit, FaTrash } from "react-icons/fa";

const Users = () => {
  // Mock Data (Replace with actual API fetch)
  const users = [
    { id: 1, name: "John Doe", email: "john.doe@example.com", role: "Admin", status: "Active" },
    { id: 2, name: "Jane Smith", email: "jane.smith@example.com", role: "User", status: "Inactive" },
    { id: 3, name: "Michael Lee", email: "michael.lee@example.com", role: "User", status: "Active" },
  ];

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-semibold">Users</h2>

      {/* Users Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white shadow-md rounded-lg">
          <thead>
            <tr className="bg-gray-100">
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Email</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
              <th className="px-6 py-3 text-left text-sm font-semibold text-gray-700">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user.id} className="border-b hover:bg-gray-100">
                <td className="px-6 py-4 text-sm text-gray-700">{user.name}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.email}</td>
                <td className="px-6 py-4 text-sm text-gray-700">{user.role}</td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold ${
                      user.status === "Active"
                        ? "bg-red-100 text-red-800"
                        : "bg-gray-100 text-gray-800"
                    }`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-6 py-4 text-sm text-gray-700">
                  <button
                    className="text-red-500 hover:text-red-700 mr-2"
                    onClick={() => alert(`View user details for ${user.name}`)}
                  >
                    View
                  </button>
                  {user.status === "Active" && (
                    <button
                      className="text-yellow-500 hover:text-yellow-700"
                      onClick={() => alert(`Deactivate user ${user.name}`)}
                    >
                      Deactivate
                    </button>
                  )}
                  {user.status === "Inactive" && (
                    <button
                      className="text-green-500 hover:text-green-700"
                      onClick={() => alert(`Activate user ${user.name}`)}
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
    </div>
  );
};

export default Users;
