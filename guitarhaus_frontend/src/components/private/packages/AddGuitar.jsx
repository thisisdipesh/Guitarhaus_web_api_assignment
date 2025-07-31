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
    specifications: {
      color: "",
      material: "",
      strings: ""
    },
    image: null,
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [createStripeProduct, setCreateStripeProduct] = useState(false);
  const [stripeSuccess, setStripeSuccess] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    if (name.startsWith('specifications.')) {
      const specField = name.split('.')[1];
      setFormData(prev => ({
        ...prev,
        specifications: {
          ...prev.specifications,
          [specField]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleFileChange = (e) => {
    setFormData({ ...formData, image: e.target.files[0] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");
    setError("");
    setStripeSuccess("");
    let stripeProductId = null;
    let stripePriceId = null;
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setError("No authentication token found. Please login again.");
        setLoading(false);
        return;
      }
      if (createStripeProduct) {
        // Call backend to create Stripe product and price
        const res = await axios.post(
          "http://localhost:3000/api/v1/guitars/create-stripe-product",
          {
            name: formData.name,
            description: formData.description,
            price: Math.round(Number(formData.price) * 100), // convert to cents
            category: formData.category,
            brand: formData.brand,
            stock: formData.stock,
            specifications: JSON.stringify(formData.specifications)
          },
          {
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        stripeProductId = res.data.product.stripeProductId || res.data.product.stripeProductId;
        stripePriceId = res.data.product.stripePriceId || res.data.product.stripePriceId;
        setStripeSuccess("Stripe product created successfully! Stripe Product ID: " + stripeProductId);
      }
      // Now upload the rest (image, etc.)
      const formDataToSend = new FormData();
      formDataToSend.append("name", formData.name);
      formDataToSend.append("brand", formData.brand);
      formDataToSend.append("category", formData.category);
      formDataToSend.append("description", formData.description);
      formDataToSend.append("price", formData.price);
      formDataToSend.append("stock", formData.stock);
      formDataToSend.append("specifications", JSON.stringify(formData.specifications));
      formDataToSend.append("image", formData.image);
      if (stripeProductId) formDataToSend.append("stripeProductId", stripeProductId);
      if (stripePriceId) formDataToSend.append("stripePriceId", stripePriceId);
      await axios.post(
        "http://localhost:3000/api/v1/guitars",
        formDataToSend,
        {
          headers: {
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
        specifications: {
          color: "",
          material: "",
          strings: ""
        },
        image: null,
      });
      setCreateStripeProduct(false);
    } catch (error) {
      console.error('Add Guitar Error:', error, error?.response?.data);
      setError(typeof error === 'string' ? error : error?.response?.data?.message || 'Error adding guitar. Please try again.');
      setStripeSuccess("");
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-semibold mb-4">Add New Guitar</h2>
      {message && <p className="text-green-600">{message}</p>}
      {error && <p className="text-red-600">{error}</p>}
      {stripeSuccess && <p className="text-blue-600">{stripeSuccess}</p>}
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
        <input type="text" name="specifications.color" value={formData.specifications.color} onChange={handleChange} placeholder="Color" className="p-2 border rounded" />
        <input type="text" name="specifications.material" value={formData.specifications.material} onChange={handleChange} placeholder="Material" className="p-2 border rounded" />
        <input type="text" name="specifications.strings" value={formData.specifications.strings} onChange={handleChange} placeholder="Strings" className="p-2 border rounded" />
        <input type="number" name="price" value={formData.price} onChange={handleChange} placeholder="Price in ₹" required className="p-2 border rounded" />
        <input type="number" name="stock" value={formData.stock} onChange={handleChange} placeholder="Stock" required className="p-2 border rounded" />
        <textarea name="description" value={formData.description} onChange={handleChange} placeholder="Description" required className="p-2 border rounded col-span-2"></textarea>
        <input type="file" name="image" onChange={handleFileChange} required className="p-2 border rounded col-span-2" />
        <div className="col-span-2 flex items-center">
          <input
            type="checkbox"
            id="createStripeProduct"
            checked={createStripeProduct}
            onChange={e => setCreateStripeProduct(e.target.checked)}
            className="mr-2"
          />
          <label htmlFor="createStripeProduct">Create as Stripe Subscription Product</label>
        </div>
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
