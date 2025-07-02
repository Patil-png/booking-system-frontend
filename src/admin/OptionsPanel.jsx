// src/components/OptionsPanel.jsx
import React, { useEffect, useState } from 'react';

const OptionsPanel = () => {
  const [options, setOptions] = useState([]);
  const [form, setForm] = useState({ type: 'Room', name: '', price: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchOptions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/options');
      const data = await res.json();
      setOptions(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch options:', err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingId
      ? `http://localhost:5000/api/options/${editingId}`
      : 'http://localhost:5000/api/options';
    const method = editingId ? 'PUT' : 'POST';

    await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    });

    setForm({ type: 'Room', name: '', price: '' });
    setEditingId(null);
    fetchOptions();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:5000/api/options/${id}`, { method: 'DELETE' });
    fetchOptions();
  };

  const handleEdit = (opt) => {
    setForm({ type: opt.type, name: opt.name, price: opt.price });
    setEditingId(opt._id);
  };

  const handleCancelEdit = () => {
    setForm({ type: 'Room', name: '', price: '' });
    setEditingId(null);
  };

  useEffect(() => {
    fetchOptions();
  }, []);

  return (
    <div className="bg-white p-6 rounded-xl shadow-md mb-10">
      <h2 className="text-2xl font-bold mb-4">Manage Room & Lawn Pricing</h2>

      <form onSubmit={handleSubmit} className="flex gap-4 mb-6 flex-wrap items-center">
        <select
          value={form.type}
          onChange={(e) => setForm({ ...form, type: e.target.value })}
          className="border p-2 rounded"
        >
          <option value="Room">Room</option>
          <option value="Lawn">Lawn</option>
        </select>
        <input
          type="text"
          placeholder="Option Name"
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <input
          type="number"
          placeholder="Price"
          value={form.price}
          onChange={(e) => setForm({ ...form, price: e.target.value })}
          className="border p-2 rounded"
          required
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">
          {editingId ? 'Update' : 'Add'}
        </button>
        {editingId && (
          <button
            type="button"
            onClick={handleCancelEdit}
            className="bg-gray-400 text-white px-4 py-2 rounded"
          >
            Cancel
          </button>
        )}
      </form>

      <table className="w-full border border-gray-300 text-left">
        <thead className="bg-gray-100">
          <tr>
            <th className="p-2">Type</th>
            <th className="p-2">Name</th>
            <th className="p-2">Price</th>
            <th className="p-2">Actions</th>
          </tr>
        </thead>
        <tbody>
          {options.length === 0 ? (
            <tr>
              <td colSpan="4" className="p-4 text-center text-gray-500">No data available</td>
            </tr>
          ) : (
            options.map((opt) => (
              <tr key={opt._id} className={editingId === opt._id ? 'bg-yellow-100' : ''}>
                <td className="p-2">{opt.type}</td>
                <td className="p-2">{opt.name}</td>
                <td className="p-2">₹{opt.price}</td>
                <td className="p-2 flex gap-2">
                  <button onClick={() => handleEdit(opt)} className="text-blue-500 hover:underline">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(opt._id)} className="text-red-500 hover:underline">
                    Delete
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default OptionsPanel;

// import React, { useEffect, useState } from 'react';

// const OptionsPanel = () => {
//   const [options, setOptions] = useState([]);
//   const [form, setForm] = useState({ type: 'Room', name: '', price: '' });

// const fetchOptions = async () => {
//   try {
//     const res = await fetch('http://localhost:5000/api/options');
//     const data = await res.json();
//     const combined = Array.isArray(data) ? data : [...(data.rooms || []), ...(data.lawns || [])];
//     setOptions(combined);
//   } catch (err) {
//     console.error('Failed to fetch options:', err);
//   }
// };


//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     await fetch('http://localhost:5000/api/options', {
//       method: 'POST',
//       headers: { 'Content-Type': 'application/json' },
//       body: JSON.stringify(form),
//     });
//     setForm({ type: 'Room', name: '', price: '' });
//     fetchOptions();
//   };

//   const handleDelete = async (id) => {
//     await fetch(`http://localhost:5000/api/options/${id}`, { method: 'DELETE' });
//     fetchOptions();
//   };

//   useEffect(() => {
//     fetchOptions();
//   }, []);

//   return (
//     <div className="bg-white p-6 rounded-xl shadow-md mb-10">
//       <h2 className="text-2xl font-bold mb-4">Manage Room & Lawn Pricing</h2>

//       <form onSubmit={handleSubmit} className="flex gap-4 mb-6 flex-wrap">
//         <select
//           value={form.type}
//           onChange={(e) => setForm({ ...form, type: e.target.value })}
//           className="border p-2 rounded"
//         >
//           <option value="Room">Room</option>
//           <option value="Lawn">Lawn</option>
//         </select>
//         <input
//           type="text"
//           placeholder="Option Name"
//           value={form.name}
//           onChange={(e) => setForm({ ...form, name: e.target.value })}
//           className="border p-2 rounded"
//           required
//         />
//         <input
//           type="number"
//           placeholder="Price"
//           value={form.price}
//           onChange={(e) => setForm({ ...form, price: e.target.value })}
//           className="border p-2 rounded"
//           required
//         />
//         <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded">Add</button>
//       </form>

//       <table className="w-full border border-gray-300 text-left">
//         <thead className="bg-gray-100">
//           <tr>
//             <th className="p-2">Type</th>
//             <th className="p-2">Name</th>
//             <th className="p-2">Price</th>
//             <th className="p-2">Action</th>
//           </tr>
//         </thead>
//         <tbody>
//           {options.map((opt) => (
//             <tr key={opt._id}>
//               <td className="p-2">{opt.type}</td>
//               <td className="p-2">{opt.name}</td>
//               <td className="p-2">₹{opt.price}</td>
//               <td className="p-2">
//                 <button onClick={() => handleDelete(opt._id)} className="text-red-500">Delete</button>
//               </td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default OptionsPanel;
