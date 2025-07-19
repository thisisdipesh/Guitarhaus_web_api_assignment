import axios from "axios";
import React, { useEffect, useState } from "react";
import { FaEdit, FaTrash, FaTimes, FaGuitar, FaSave } from "react-icons/fa";

const ManageGuitars = () => {
  const [guitars, setGuitars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [showEditModal, setShowEditModal] = useState(false);
  const [editingGuitar, setEditingGuitar] = useState(null);
  const [editFormData, setEditFormData] = useState({
    name: "",
    brand: "",
    category: "",
    price: "",
    stock: "",
    description: "",
    specifications: {
      color: "",
      material: "",
      strings: ""
    }
  });

  // Fetch guitars from API
  useEffect(() => {
    fetchGuitars();
  }, []);

  const fetchGuitars = async () => {
    setLoading(true);
    try {
      const res = await axios.get("http://localhost:3000/api/v1/guitars");
      setGuitars(res.data.data || []);
    } catch (error) {
      console.error("Error fetching guitars:", error);
      setMessage("Error fetching guitars.");
    }
    setLoading(false);
  };

  // Delete guitar
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this guitar?")) return;
    try {
      const token = localStorage.getItem("token");
      await axios.delete(`http://localhost:3000/api/v1/guitars/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setGuitars(guitars.filter((guitar) => guitar._id !== id));
      setMessage("Guitar deleted successfully!");
    } catch (error) {
      setMessage("Error deleting guitar. Please try again.");
    }
  };

  // Open edit modal
  const handleEdit = (guitar) => {
    setEditingGuitar(guitar);
    setEditFormData({
      name: guitar.name || "",
      brand: guitar.brand || "",
      category: guitar.category || "",
      price: guitar.price || "",
      stock: guitar.stock || "",
      description: guitar.description || "",
      specifications: {
        color: guitar.specifications?.color || "",
        material: guitar.specifications?.material || "",
        strings: guitar.specifications?.strings || ""
      }
    });
    setShowEditModal(true);
  };

  // Handle edit form changes
  const handleEditFormChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setEditFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setEditFormData(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Handle edit form submission
  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        `http://localhost:3000/api/v1/guitars/${editingGuitar._id}`,
        editFormData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // Update the guitar in the local state
      setGuitars(guitars.map(guitar => 
        guitar._id === editingGuitar._id ? response.data.data : guitar
      ));

      setMessage("Guitar updated successfully!");
      setShowEditModal(false);
      setEditingGuitar(null);
    } catch (error) {
      setMessage("Error updating guitar. Please try again.");
    }
  };

  // Close edit modal
  const closeEditModal = () => {
    setShowEditModal(false);
    setEditingGuitar(null);
    setEditFormData({
      name: "",
      brand: "",
      category: "",
      price: "",
      stock: "",
      description: "",
      specifications: {
        color: "",
        material: "",
        strings: ""
      }
    });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md overflow-x-auto">
      <h2 className="text-2xl font-bold mb-4 text-yellow-700">Manage Guitars</h2>
      {message && <p className="text-red-600 mb-2">{message}</p>}
      {loading ? (
        <p>Loading guitars...</p>
      ) : (
        <table className="w-full border-collapse border border-gray-200 text-sm">
          <thead>
            <tr className="bg-yellow-100 text-yellow-900">
              <th className="border p-2">Image</th>
              <th className="border p-2">Name</th>
              <th className="border p-2">Brand</th>
              <th className="border p-2">Category</th>
              <th className="border p-2">Color</th>
              <th className="border p-2">Price</th>
              <th className="border p-2">Stock</th>
              <th className="border p-2">Description</th>
              <th className="border p-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {guitars.length > 0 ? (
              guitars.map((guitar) => (
                <tr key={guitar._id} className="border hover:bg-yellow-50 transition">
                  <td className="border p-2">
                    {guitar.images && guitar.images.length > 0 ? (
                      <img src={`http://localhost:3000/uploads/${guitar.images[0]}`} alt={guitar.name} className="w-20 h-20 object-cover rounded shadow" />
                    ) : (
                      <span className="text-gray-400">No Image</span>
                    )}
                  </td>
                  <td className="border p-2 font-semibold">{guitar.name}</td>
                  <td className="border p-2">{guitar.brand}</td>
                  <td className="border p-2">{guitar.category}</td>
                  <td className="border p-2">{guitar.specifications?.color || '-'}</td>
                  <td className="border p-2">${guitar.price}</td>
                  <td className="border p-2">{guitar.stock}</td>
                  <td className="border p-2 max-w-xs truncate">{guitar.description}</td>
                  <td className="border p-2">
                    <div className="flex space-x-2">
                      <button 
                        onClick={() => handleEdit(guitar)} 
                        className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-700 transition flex items-center gap-1"
                      >
                        <FaEdit size={12} />
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(guitar._id)} 
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition flex items-center gap-1"
                      >
                        <FaTrash size={12} />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-center p-4">No guitars found.</td>
              </tr>
            )}
          </tbody>
        </table>
      )}

      {/* Edit Modal */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-yellow-700 flex items-center gap-2">
                <FaGuitar />
                Edit Guitar
              </h3>
              <button 
                onClick={closeEditModal}
                className="text-gray-500 hover:text-gray-700"
              >
                <FaTimes size={20} />
              </button>
            </div>

            <form onSubmit={handleEditSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Guitar Name
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={editFormData.name}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Brand
                  </label>
                  <input
                    type="text"
                    name="brand"
                    value={editFormData.brand}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Category
                  </label>
                  <select
                    name="category"
                    value={editFormData.category}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                  >
                    <option value="">Select Category</option>
                    <option value="Acoustic">Acoustic</option>
                    <option value="Electric">Electric</option>
                    <option value="Classical">Classical</option>
                    <option value="Bass">Bass</option>
                    <option value="Ukulele">Ukulele</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    name="price"
                    value={editFormData.price}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                    min="0"
                    step="0.01"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Stock
                  </label>
                  <input
                    type="number"
                    name="stock"
                    value={editFormData.stock}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                    required
                    min="0"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Color
                  </label>
                  <input
                    type="text"
                    name="specifications.color"
                    value={editFormData.specifications.color}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Material
                  </label>
                  <input
                    type="text"
                    name="specifications.material"
                    value={editFormData.specifications.material}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Strings
                  </label>
                  <input
                    type="text"
                    name="specifications.strings"
                    value={editFormData.specifications.strings}
                    onChange={handleEditFormChange}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  name="description"
                  value={editFormData.description}
                  onChange={handleEditFormChange}
                  rows="4"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <button
                  type="button"
                  onClick={closeEditModal}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition flex items-center gap-2"
                >
                  <FaSave size={14} />
                  Save Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default ManageGuitars;
