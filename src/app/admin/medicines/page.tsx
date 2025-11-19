"use client";

import { useState, useEffect } from "react";

type Medicine = {
  _id: string;
  name: string;
  description: string;
  price: number;
  image: string;
};

export default function AdminMedicinesPage() {
  const [form, setForm] = useState({
    name: "",
    description: "",
    price: "",
    image: "",
  });
  const [medicines, setMedicines] = useState<Medicine[]>([]);

  // Fetch medicines
  const fetchMedicines = async () => {
    const res = await fetch("/api/medicines");
    const data = await res.json();
    setMedicines(data);
  };

  useEffect(() => {
    fetchMedicines();
  }, []);

  // Handle form input
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Add medicine
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch("/api/medicines", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: form.name,
        description: form.description,
        price: Number(form.price),
        image: form.image,
      }),
    });
    if (res.ok) {
      alert("✅ Medicine added!");
      setForm({ name: "", description: "", price: "", image: "" });
      fetchMedicines();
    } else {
      alert("❌ Error adding medicine");
    }
  };

  // Delete medicine
  const deleteMedicine = async (id: string) => {
    const res = await fetch("/api/medicines", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id }),
    });
    if (res.ok) {
      alert("🗑️ Medicine deleted!");
      fetchMedicines();
    } else {
      alert("❌ Error deleting medicine");
    }
  };

  // Update image URL
  const updateImage = async (id: string, newImage: string) => {
    const res = await fetch("/api/medicines", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ _id: id, newImage }),
    });
    if (res.ok) {
      alert("✅ Image updated!");
      fetchMedicines();
    } else {
      alert("❌ Error updating image");
    }
  };

  return (
    <div className="pt-24 max-w-5xl mx-auto px-4">
      <h1 className="text-3xl font-bold mb-6 text-emerald-700">Admin: Manage Medicines</h1>

      {/* Add Medicine Form */}
      <form onSubmit={handleSubmit} className="space-y-4 mb-10">
        <input
          type="text"
          name="name"
          placeholder="Medicine Name"
          value={form.name}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <textarea
          name="description"
          placeholder="Description"
          value={form.description}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <input
          type="number"
          name="price"
          placeholder="Price"
          value={form.price}
          onChange={handleChange}
          required
          className="w-full border rounded p-2"
        />
        <input
          type="text"
          name="image"
          placeholder="Image URL"
          value={form.image}
          onChange={handleChange}
          className="w-full border rounded p-2"
        />
        <button
          type="submit"
          className="bg-emerald-600 text-white px-4 py-2 rounded hover:bg-emerald-700"
        >
          Add Medicine
        </button>
      </form>

      {/* Medicines Table */}
      <h2 className="text-2xl font-semibold mb-4">Existing Medicines</h2>
      <table className="w-full border-collapse border">
        <thead>
          <tr className="bg-emerald-100">
            <th className="border p-2">Name</th>
            <th className="border p-2">Description</th>
            <th className="border p-2">Price</th>
            <th className="border p-2">Image</th>
            <th className="border p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {medicines.map((m) => (
            <tr key={m._id}>
              <td className="border p-2">{m.name}</td>
              <td className="border p-2">{m.description}</td>
              <td className="border p-2">Rs {m.price}</td>
              <td className="border p-2">
                <img src={m.image} alt={m.name} className="w-16 h-16 object-cover" />
                <input
                  type="text"
                  placeholder="New Image URL"
                  className="mt-2 border p-1 w-full"
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault();
                      updateImage(m._id, (e.target as HTMLInputElement).value);
                    }
                  }}
                />
              </td>
              <td className="border p-2">
                <button
                  onClick={() => deleteMedicine(m._id)}
                  className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
