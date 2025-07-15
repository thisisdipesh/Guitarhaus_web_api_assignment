import axios from "axios";
import React, { useEffect, useState } from "react";

const ManageGuitars = () => {
  const [guitars, setGuitars] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

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
                    <button onClick={() => handleDelete(guitar._id)} className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-700 transition">
                      Delete
                    </button>
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
    </div>
  );
};

export default ManageGuitars;
