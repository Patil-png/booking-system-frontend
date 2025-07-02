import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // ✅ for back button

const GalleryAdmin = () => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({ category: "room", alt: "", image: null });
  const navigate = useNavigate(); // ✅

  const fetchImages = async () => {
    try {
      const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/gallery-images`, {
        withCredentials: true,
      });
      setImages(res.data);
    } catch (error) {
      console.error("Failed to fetch images", error);
      alert("Failed to fetch images. Please try again later.");
    }
  };

  useEffect(() => {
    fetchImages();
  }, []);

  const handleDelete = async (id) => {
    if (window.confirm("Are you sure you want to delete this image?")) {
      try {
        await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/gallery-images/${id}`, {
          withCredentials: true,
        });
        alert("Image deleted successfully!");
        fetchImages();
      } catch (error) {
        console.error("Failed to delete image", error);
        alert("Failed to delete image. Please try again later.");
      }
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!formData.image) {
      alert("Please select an image to upload.");
      return;
    }

    const fd = new FormData();
    fd.append("category", formData.category);
    fd.append("alt", formData.alt);
    fd.append("image", formData.image);

    try {
      await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/gallery-images`, fd, {
        headers: { "Content-Type": "multipart/form-data" },
        withCredentials: true,
      });
      setFormData({ category: "room", alt: "", image: null });
      alert("Image uploaded successfully!");
      fetchImages();
    } catch (err) {
      console.error("Failed to upload image", err);
      alert("Failed to upload image. Please try again.");
    }
  };

  return (
    <div className="p-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 min-h-screen text-white font-sans">
      {/* ✅ Back Button */}
      <button
        onClick={() => navigate(-1)}
        className="mb-6 text-sm bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition"
      >
        ← Back
      </button>

      <h2 className="text-3xl font-extrabold mb-6 text-center drop-shadow-lg">
        Manage Gallery
      </h2>

      <form
        onSubmit={handleUpload}
        className="mb-8 flex flex-wrap items-center justify-center gap-3"
      >
        <select
          className="p-3 rounded text-black font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.category}
          onChange={(e) => setFormData({ ...formData, category: e.target.value })}
        >
          <option value="room">Room</option>
          <option value="lawn">Lawn</option>
        </select>

        <input
          type="text"
          placeholder="Alt text"
          className="p-3 rounded text-black flex-grow max-w-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={formData.alt}
          onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
        />

        <input
          type="file"
          accept="image/*"
          className="p-3 rounded text-black cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
          onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
        />

        <button
          type="submit"
          className="bg-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
        >
          Upload
        </button>
      </form>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
        {images.map((img) => (
          <div
            key={img._id}
            className="relative group rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-800 transform transition-transform hover:scale-105 cursor-pointer animate-fadeIn"
            style={{ animationDuration: "600ms", animationTimingFunction: "ease-out" }}
          >
            <div className="w-full h-40 relative overflow-hidden">
              <img
                src={img.image}
                alt={img.alt || "Gallery image"}
                className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
              />
            </div>

            <button
              onClick={() => handleDelete(img._id)}
              className="absolute top-2 right-2 bg-red-700 hover:bg-red-800 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg transform scale-90 group-hover:scale-100"
              title="Delete image"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default GalleryAdmin;
