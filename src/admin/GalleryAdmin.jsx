import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import AdminSidebar from './AdminSidebar';

const GalleryAdmin = () => {
  const [images, setImages] = useState([]);
  const [formData, setFormData] = useState({ category: "room", alt: "", image: null });
  const [preview, setPreview] = useState(null);
  const navigate = useNavigate();

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
      setPreview(null);
      alert("Image uploaded successfully!");
      fetchImages();
    } catch (err) {
      console.error("Failed to upload image", err);
      alert("Failed to upload image. Please try again.");
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    setFormData({ ...formData, image: file });
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPreview(null);
    }
  };

  return (
    <div className="relative min-h-screen font-sans overflow-x-hidden flex">
      <AdminSidebar />
      <div className="flex-1">
      {/* Animated Gradient Background */}
      <div className="absolute inset-0 -z-10 animate-gradient bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900" />
      {/* Soft Overlay */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_left,_var(--tw-gradient-stops))] from-indigo-400/20 via-transparent to-transparent pointer-events-none" />
      {/* Main Content */}
      <div className="p-2 sm:p-6 text-white">
        {/* Back Button */}

        <h2 className="text-3xl sm:text-4xl font-extrabold mb-8 text-center drop-shadow-lg tracking-tight">
          Manage Gallery
        </h2>

        {/* Upload Card */}
        <div className="max-w-2xl mx-auto mb-10">
          <div className="bg-white/10 rounded-2xl shadow-xl p-4 sm:p-8 flex flex-col sm:flex-row items-center gap-6 border border-white/10">
            <form
              onSubmit={handleUpload}
              className="flex flex-col sm:flex-row items-center gap-4 w-full"
            >
              <select
                id="category"
                name="category"
                className="p-3 rounded text-black font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
              >
                <option value="room">Room</option>
                <option value="lawn">Lawn</option>
              </select>

              <input
                type="text"
                id="alt"
                name="alt"
                placeholder="Alt text"
                className="p-3 rounded text-black w-full sm:max-w-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={formData.alt}
                onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
              />

              <input
                type="file"
                id="imageFile"
                name="imageFile"
                accept="image/*"
                className="p-3 rounded text-black cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500 bg-white/80"
                onChange={handleFileChange}
              />

              <button
                type="submit"
                className="bg-gradient-to-r from-indigo-600 to-blue-600 px-6 py-3 rounded-lg font-semibold hover:from-indigo-700 hover:to-blue-700 transition shadow text-white"
              >
                Upload
              </button>
            </form>
            {preview && (
              <div className="w-24 h-24 rounded-lg overflow-hidden border-2 border-indigo-400 shadow-lg flex items-center justify-center bg-white/20">
                <img src={preview} alt="Preview" className="object-cover w-full h-full" />
              </div>
            )}
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">
          {images.map((img) => (
            <div
              key={img._id}
              className="relative group rounded-2xl overflow-hidden shadow-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-800 transform transition-transform hover:scale-105 cursor-pointer animate-fadeIn border border-white/10"
              style={{ animationDuration: "600ms", animationTimingFunction: "ease-out" }}
            >
              <div className="w-full aspect-[4/3] relative overflow-hidden bg-black/10">
                <img
                  src={img.image}
                  alt={img.alt || "Gallery image"}
                  className="w-full h-full object-cover transition-transform duration-300 ease-in-out group-hover:scale-110"
                />
              </div>
              <div className="absolute bottom-0 left-0 w-full bg-gradient-to-t from-black/70 to-transparent p-2 flex items-center justify-between opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <span className="text-xs font-medium truncate max-w-[70%]">{img.alt || "No description"}</span>
                <button
                  onClick={() => handleDelete(img._id)}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded shadow text-xs font-semibold ml-2"
                  title="Delete image"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      </div>
    </div>
  );
};

export default GalleryAdmin;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { useNavigate } from "react-router-dom";

// const GalleryAdmin = () => {
//   const [images, setImages] = useState([]);
//   const [formData, setFormData] = useState({ category: "room", alt: "", image: null });
//   const navigate = useNavigate();

//   const fetchImages = async () => {
//     try {
//       const res = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/gallery-images`, {
//         withCredentials: true,
//       });
//       setImages(res.data);
//     } catch (error) {
//       console.error("Failed to fetch images", error);
//       alert("Failed to fetch images. Please try again later.");
//     }
//   };

//   useEffect(() => {
//     fetchImages();
//   }, []);

//   const handleDelete = async (id) => {
//     if (window.confirm("Are you sure you want to delete this image?")) {
//       try {
//         await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/gallery-images/${id}`, {
//           withCredentials: true,
//         });
//         alert("Image deleted successfully!");
//         fetchImages();
//       } catch (error) {
//         console.error("Failed to delete image", error);
//         alert("Failed to delete image. Please try again later.");
//       }
//     }
//   };

//   const handleUpload = async (e) => {
//     e.preventDefault();
//     if (!formData.image) {
//       alert("Please select an image to upload.");
//       return;
//     }

//     const fd = new FormData();
//     fd.append("category", formData.category);
//     fd.append("alt", formData.alt);
//     fd.append("image", formData.image);

//     try {
//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/gallery-images`, fd, {
//         headers: { "Content-Type": "multipart/form-data" },
//         withCredentials: true,
//       });
//       setFormData({ category: "room", alt: "", image: null });
//       alert("Image uploaded successfully!");
//       fetchImages();
//     } catch (err) {
//       console.error("Failed to upload image", err);
//       alert("Failed to upload image. Please try again.");
//     }
//   };

//   return (
//     <div className="p-4 sm:p-8 bg-gradient-to-r from-purple-900 via-indigo-900 to-blue-900 min-h-screen text-white font-sans">
//       {/* Back Button */}
//       <button
//         onClick={() => navigate(-1)}
//         className="mb-6 text-sm bg-gray-200 text-black px-4 py-2 rounded hover:bg-gray-300 transition"
//       >
//         ← Back
//       </button>

//       <h2 className="text-2xl sm:text-3xl font-extrabold mb-6 text-center drop-shadow-lg">
//         Manage Gallery
//       </h2>

//       <form
//         onSubmit={handleUpload}
//         className="mb-8 flex flex-col md:flex-row items-stretch md:items-center justify-center gap-4"
//       >
//         <select
//           className="p-3 rounded text-black font-semibold focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={formData.category}
//           onChange={(e) => setFormData({ ...formData, category: e.target.value })}
//         >
//           <option value="room">Room</option>
//           <option value="lawn">Lawn</option>
//         </select>

//         <input
//           type="text"
//           placeholder="Alt text"
//           className="p-3 rounded text-black w-full md:max-w-xs font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           value={formData.alt}
//           onChange={(e) => setFormData({ ...formData, alt: e.target.value })}
//         />

//         <input
//           type="file"
//           accept="image/*"
//           className="p-3 rounded text-black cursor-pointer font-medium focus:outline-none focus:ring-2 focus:ring-indigo-500"
//           onChange={(e) => setFormData({ ...formData, image: e.target.files[0] })}
//         />

//         <button
//           type="submit"
//           className="bg-indigo-600 px-6 py-3 rounded-lg font-semibold hover:bg-indigo-700 transition"
//         >
//           Upload
//         </button>
//       </form>

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 max-w-6xl mx-auto">
//         {images.map((img) => (
//           <div
//             key={img._id}
//             className="relative group rounded-lg overflow-hidden shadow-2xl bg-gradient-to-br from-purple-700 via-indigo-800 to-blue-800 transform transition-transform hover:scale-105 cursor-pointer animate-fadeIn"
//             style={{ animationDuration: "600ms", animationTimingFunction: "ease-out" }}
//           >
//             <div className="w-full h-40 relative overflow-hidden">
//               <img
//                 src={img.image}
//                 alt={img.alt || "Gallery image"}
//                 className="w-full h-full object-cover transition-transform duration-300 ease-in-out hover:scale-110"
//               />
//             </div>

//             <button
//               onClick={() => handleDelete(img._id)}
//               className="absolute top-2 right-2 bg-red-700 hover:bg-red-800 text-white p-2 rounded-md opacity-0 group-hover:opacity-100 transition-opacity duration-300 shadow-lg transform scale-90 group-hover:scale-100"
//               title="Delete image"
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default GalleryAdmin;
