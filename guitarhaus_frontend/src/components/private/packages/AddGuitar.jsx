import axios from "axios";
import React, { useState } from "react";

const AddPackages = () => {
  const [formData, setFormData] = useState({
    name: "",
    brand: "",
    category: "Acoustic",
    description: "",
    price: "",
    stock: "",
    color: "",
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");

    const formDataToSend = new FormData();
    formDataToSend.append("name", formData.name);
    formDataToSend.append("brand", formData.brand);
    formDataToSend.append("category", formData.category);
    formDataToSend.append("description", formData.description);
    formDataToSend.append("price", formData.price);
    formDataToSend.append("stock", formData.stock);
    formDataToSend.append("color", formData.color);
    formDataToSend.append("images", formData.image);

    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:3000/api/v1/guitars",
        formDataToSend,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setMessage("Guitar added successfully!");
      setFormData({
        name: "",
        brand: "",
        category: "Acoustic",
        description: "",
        price: "",
        stock: "",
        color: "",
        image: null,
      });
    } catch (error) {
      console.error('Add Guitar Error:', error, error?.response?.data);
      setError(typeof error === 'string' ? error : error?.response?.data?.message || 'Error adding guitar. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add New Guitar</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <input type="text" name="name" value={formData.name} onChange={handleChange} placeholder="Guitar Name" required className="p-2 border rounded" />
        <input type="text" name="brand" value={formData.brand} onChange={handleChange} placeholder="Brand" required className="p-2 border rounded" />
        <select name="category" value={formData.category} onChange={handleChange} className="p-2 border rounded">
          <option value="Acoustic">Acoustic</option>
          <option value="Electric">Electric</option>
          <option value="Bass">Bass</option>
          <option value="Classical">Classical</option>
          <option value="Ukulele">Ukulele</option>
          <option value="Accessories">Accessories</option>
        </select>
        <input type="text" name="color" value={formData.color} onChange={handleChange} placeholder="Color" className="p-2 border rounded" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price in ₹" required className="p-2 border rounded" />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" required className="p-2 border rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="p-2 border rounded col-span-2"></textarea>
        <input type="file" name="image" onChange={handleFileChange} required className="p-2 border rounded col-span-2" />
        <button
          type="submit"
          className="w-full bg-yellow-500 text-black py-2 px-4 rounded-md hover:bg-yellow-600 transition duration-300 font-bold shadow-md col-span-2"
          disabled={loading}
        >
          {loading ? "Adding..." : "Add Guitar"}
        </button>
      </form>
    </div>
  );
};

export default AddPackages;
