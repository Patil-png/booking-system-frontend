import React, { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion"; // For animations
import { Transition } from "@headlessui/react"; // For simple transitions
import {
  XCircleIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  TrashIcon,
  ArrowDownCircleIcon, // New icon for showing the add section
} from "@heroicons/react/24/solid";

const AdminRoomManager = () => {
  const [searchTerms, setSearchTerms] = useState({});

  const [showTodayCheckoutOnly, setShowTodayCheckoutOnly] = useState(false);

  const [selectedRoomTypeId, setSelectedRoomTypeId] = useState("all");


  const [newRoomNumbers, setNewRoomNumbers] = useState({});

  const [form, setForm] = useState({
    name: "",
    basePrice: "",
    seasonalPrice: "",
    amenities: "",
    photos: [],
  });

  const [roomNumbers, setRoomNumbers] = useState([""]);
  const [roomTypes, setRoomTypes] = useState([]);
  const [roomEdits, setRoomEdits] = useState({});
  const [loading, setLoading] = useState(true);
  const [alertMessage, setAlertMessage] = useState(null);
  const [showAlert, setShowAlert] = useState(false);
  const [showAddRoomSection, setShowAddRoomSection] = useState(false); // New state for visibility

  const fetchRoomTypes = async () => {
    setLoading(true);
    try {
      const { data } = await axios.get("http://localhost:5000/api/room-types");
      setRoomTypes(data);
      const edits = {};
      data.forEach((type) =>
        type.rooms.forEach((room) => {
          edits[`${type._id}-${room.number}`] = { ...room };
        })
      );
      setRoomEdits(edits);
    } catch (err) {
      console.error("Failed to fetch room types:", err);
      showAlertMessage("Failed to fetch room types", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRoomTypes();
  }, []);

  const showAlertMessage = (message, type) => {
    setAlertMessage({ message, type });
    setShowAlert(true);
    setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds
  };

  const handleFileChange = (e) => {
    setForm((prev) => ({ ...prev, photos: e.target.files }));
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (
      !form.name ||
      !form.basePrice ||
      !form.amenities ||
      roomNumbers.some((num) => !num.trim())
    ) {
      showAlertMessage("Please fill in all required fields.", "error");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("basePrice", form.basePrice);
      formData.append("seasonalPrice", form.seasonalPrice);
      formData.append("amenities", form.amenities);
      formData.append(
        "roomNumbers",
        JSON.stringify(
          roomNumbers
            .filter((num) => num.trim() !== "")
            .map((num) => num.trim())
        )
      ); // Filter empty room numbers
      for (let i = 0; i < form.photos.length; i++) {
        formData.append("photos", form.photos[i]);
      }

      await axios.post("http://localhost:5000/api/room-types", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setForm({
        name: "",
        basePrice: "",
        seasonalPrice: "",
        amenities: "",
        photos: [],
      });
      setRoomNumbers([""]);
      fetchRoomTypes();
      showAlertMessage("Room type added successfully!", "success");
      setShowAddRoomSection(false); // Hide the form after successful submission
    } catch (err) {
      console.error("Failed to create room type:", err);
      showAlertMessage(
        "Error creating room type. Please check server logs.",
        "error"
      );
    }
  };

  const handleDeleteRoomType = async (roomTypeId) => {
    if (!window.confirm("Are you sure you want to delete this room type?"))
      return;
    try {
      await axios.delete(`http://localhost:5000/api/room-types/${roomTypeId}`);
      fetchRoomTypes();
      showAlertMessage("Room type deleted successfully", "success");
    } catch (err) {
      console.error("Failed to delete room type:", err);
      showAlertMessage("Error deleting room type", "error");
    }
  };

  const handleRoomUpdate = async (roomTypeId, roomNumberRaw) => {
    const roomNumber = String(roomNumberRaw).trim();
    const key = `${roomTypeId}-${roomNumber}`;
    const updatedRoom = roomEdits[key];

    if (!window.confirm(`Are you sure you want to update room ${roomNumber}?`))
      return;

    try {
      const maintenanceStatus = updatedRoom.maintenanceStatus || null;
      await axios.put(
        `http://localhost:5000/api/room-types/${roomTypeId}/room-status/${roomNumber}`,
        {
          isBooked: updatedRoom.isBooked,
          bookedFrom: updatedRoom.bookedFrom,
          bookedTo: updatedRoom.bookedTo,
          bookedToTime: updatedRoom.bookedToTime,
          maintenanceStatus,
        }
      );

      await fetchRoomTypes();
      showAlertMessage(`Room ${roomNumber} updated successfully`, "success");
    } catch (err) {
      console.error("Failed to update room:", err);
      showAlertMessage("Error updating room", "error");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
      {/* Global Alert Message */}
      <Transition
        show={showAlert}
        enter="transition-opacity duration-300"
        enterFrom="opacity-0"
        enterTo="opacity-100"
        leave="transition-opacity duration-500"
        leaveFrom="opacity-100"
        leaveTo="opacity-0"
      >
        {alertMessage && (
          <div
            className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3
            ${
              alertMessage.type === "success"
                ? "bg-green-500 text-white"
                : "bg-red-500 text-white"
            }`}
            role="alert"
          >
            {alertMessage.type === "success" ? (
              <CheckCircleIcon className="h-6 w-6" />
            ) : (
              <XCircleIcon className="h-6 w-6" />
            )}
            <span>{alertMessage.message}</span>
          </div>
        )}
      </Transition>

      <motion.h1
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-extrabold text-gray-800 mb-8 text-center"
      >
        Admin Room Management
      </motion.h1>

      {/* Button to toggle Add Room Type Form */}
      <div className="flex justify-center mb-8">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowAddRoomSection(!showAddRoomSection)}
          className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg"
        >
          {showAddRoomSection ? (
            <>
              <XCircleIcon className="h-6 w-6" />
              <span>Hide Add Room Section</span>
            </>
          ) : (
            <>
              <PlusCircleIcon className="h-6 w-6" />
              <span>Add New Room Type</span>
            </>
          )}
        </motion.button>
      </div>

      {/* Add Room Type Form - Conditionally rendered */}
      <AnimatePresence>
        {showAddRoomSection && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto overflow-hidden"
          >
            <h2 className="text-2xl font-bold text-gray-700 mb-5">
              Add New Room Type
            </h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <input
                className="border border-gray-300 p-3 w-full rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Room Type Name (e.g., Deluxe Suite, Standard Room)"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                required
              />
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="number"
                  className="border border-gray-300 p-3 w-full rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Base Price (₹)"
                  value={form.basePrice}
                  onChange={(e) =>
                    setForm({ ...form, basePrice: e.target.value })
                  }
                  required
                />
                <input
                  type="number"
                  className="border border-gray-300 p-3 w-full rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                  placeholder="Seasonal Price (₹) (Optional)"
                  value={form.seasonalPrice}
                  onChange={(e) =>
                    setForm({ ...form, seasonalPrice: e.target.value })
                  }
                />
              </div>
              <input
                className="border border-gray-300 p-3 w-full rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                placeholder="Amenities (comma separated, e.g., AC, WiFi, Balcony)"
                value={form.amenities}
                onChange={(e) =>
                  setForm({ ...form, amenities: e.target.value })
                }
                required
              />

              <div>
                <label className="block font-semibold text-gray-700 mb-2">
                  Room Numbers:
                </label>
                <AnimatePresence>
                  {roomNumbers.map((num, i) => (
                    <motion.div
                      key={i}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.3 }}
                      className="flex items-center gap-2 mb-2"
                    >
                      <input
                        className="border border-gray-300 p-2 flex-1 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                        placeholder="Room Number"
                        value={num}
                        onChange={(e) => {
                          const updated = [...roomNumbers];
                          updated[i] = e.target.value;
                          setRoomNumbers(updated);
                        }}
                        required
                      />
                      <button
                        type="button"
                        className="text-red-500 hover:text-red-700 transition duration-200 p-1"
                        onClick={() =>
                          setRoomNumbers((prev) =>
                            prev.filter((_, idx) => idx !== i)
                          )
                        }
                      >
                        <XCircleIcon className="h-6 w-6" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
                <button
                  type="button"
                  onClick={() => setRoomNumbers((prev) => [...prev, ""])}
                  className="text-sm text-blue-600 hover:text-blue-800 transition duration-200 mt-2 flex items-center gap-1"
                >
                  <PlusCircleIcon className="h-5 w-5" /> Add Room Number
                </button>
              </div>

              <label className="block font-semibold text-gray-700 mb-2">
                Room Photos:
              </label>
              <input
                type="file"
                multiple
                accept="image/*"
                onChange={handleFileChange}
                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
                file:rounded-full file:border-0 file:text-sm file:font-semibold
                file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
              />
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="submit"
                className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition duration-300 ease-in-out shadow-lg"
              >
                Add Room Type
              </motion.button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Existing Room Types */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="max-w-6xl mx-auto"
      >
        <h2 className="text-2xl font-bold text-gray-700 mb-5 text-center">
  Existing Room Types
</h2>


<div className="mb-6 flex justify-end">
  <button
    onClick={() => setShowTodayCheckoutOnly((prev) => !prev)}
    className={`px-4 py-2 rounded-md font-semibold text-sm shadow transition duration-300 ${
      showTodayCheckoutOnly
        ? "bg-green-600 text-white"
        : "bg-gray-200 text-gray-700"
    }`}
  >
    {showTodayCheckoutOnly ? "Showing Today Checkouts" : "Show Today Checkout Only"}
  </button>
</div>

{loading ? (
          <div className="flex justify-center items-center h-48">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
          </div>
        ) : roomTypes.length === 0 ? (
          <p className="text-center text-gray-600 text-lg py-10">
            No room types added yet. Start by adding one above!
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
            <AnimatePresence>
              {roomTypes.map((type) => {
                const bookedRooms = type.rooms.filter((r) => r.isBooked).length;
                const maintenanceRooms = type.rooms.filter(
                  (r) =>
                    r.maintenanceStatus === "Cleaning" ||
                    r.maintenanceStatus === "Repair" ||
                    r.maintenanceStatus === "Blocked"
                ).length;
                const availableRooms =
                  type.rooms.length - bookedRooms - maintenanceRooms;

                return (
                  <motion.div
                    key={type._id}
                    layout
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.3 }}
                    className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="text-xl font-bold text-gray-800">
                        {type.name}
                      </h3>
                      <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        onClick={() => handleDeleteRoomType(type._id)}
                        className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 hover:bg-red-600 transition duration-200"
                      >
                        <TrashIcon className="h-4 w-4" /> Delete
                      </motion.button>
                    </div>

                    <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
                      <p>
                        <strong>Base Price:</strong>{" "}
                        <span className="font-medium">₹{type.basePrice}</span>
                      </p>
                      <p>
                        <strong>Seasonal Price:</strong>{" "}
                        <span className="font-medium">
                          ₹{type.seasonalPrice || "N/A"}
                        </span>
                      </p>
                      <p className="col-span-2">
                        <strong>Amenities:</strong>{" "}
                        <span className="font-medium">
                          {type.amenities?.join(", ") || "None"}
                        </span>
                      </p>
                    </div>

                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm font-semibold text-gray-700 mb-4 py-4 border-t border-b border-gray-200">
                      <div className="flex flex-col items-center">
                        <span>Total</span>
                        <span className="text-lg font-bold">
                          {type.rooms.length}
                        </span>
                      </div>
                      <div>
                        Available:{" "}
                        <span className="block text-lg font-bold text-green-600">
                          {availableRooms}
                        </span>
                      </div>
                      <div>
                        Booked:{" "}
                        <span className="block text-lg font-bold text-yellow-600">
                          {bookedRooms}
                        </span>
                      </div>
                      <div>
                        Maintenance:{" "}
                        <span className="block text-lg font-bold text-red-600">
                          {maintenanceRooms}
                        </span>
                      </div>
                    </div>

                    {type.photos?.length > 0 && (
                      <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
                        {type.photos.map((photo, idx) => (
                          <motion.img
                            key={idx}
                            src={`http://localhost:5000/${photo}`}
                            alt={`Room ${type.name}`}
                            className="h-32 w-full object-cover rounded-md shadow-sm transform hover:scale-105 transition-transform duration-300"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: idx * 0.1, duration: 0.5 }}
                          />
                        ))}
                      </div>
                    )}

                    <div className="mt-auto">
                      {" "}
                      {/* Pushes room numbers table to the bottom */}
                      <h4 className="font-semibold text-gray-700 mb-3">
                        Individual Room Status
                      </h4>
                      {/* ✅ Add Room Number Section */}
                      <div className="flex items-center gap-2 mb-4">
                        <input
                          type="text"
                          placeholder="New room number"
                          value={newRoomNumbers[type._id] || ""}
                          onChange={(e) =>
                            setNewRoomNumbers((prev) => ({
                              ...prev,
                              [type._id]: e.target.value,
                            }))
                          }
                          className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                        />
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition duration-200"
                          onClick={async () => {
                            const number = (
                              newRoomNumbers[type._id] || ""
                            ).trim();
                            if (!number) {
                              showAlertMessage(
                                "Room number cannot be empty",
                                "error"
                              );
                              return;
                            }

                            try {
                              await axios.put(
                                `http://localhost:5000/api/room-types/${type._id}/add-room`,
                                { number }
                              );
                              setNewRoomNumbers((prev) => ({
                                ...prev,
                                [type._id]: "",
                              }));
                              await fetchRoomTypes();
                              showAlertMessage(
                                `Room ${number} added successfully`,
                                "success"
                              );
                            } catch (err) {
                              console.error("❌ Failed to add room:", err);
                              showAlertMessage(
                                err.response?.data?.error ||
                                  "Failed to add room",
                                "error"
                              );
                            }
                          }}
                        >
                          <PlusCircleIcon className="h-4 w-4 inline-block mr-1" />
                          Add
                        </motion.button>
                      </div>
                      <div className="overflow-x-auto">
                        <div className="mb-2">
                          <input
                            type="text"
                            value={searchTerms[type._id] || ""}
                            onChange={(e) =>
                              setSearchTerms((prev) => ({
                                ...prev,
                                [type._id]: e.target.value,
                              }))
                            }
                            placeholder="Search room number..."
                            className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                        </div>
                        <table className="w-full text-sm border-collapse border border-gray-200">
                          <thead className="bg-gray-100">
                            <tr>
                              <th className="border border-gray-200 px-3 py-2 text-left">
                                Number
                              </th>
                              <th className="border border-gray-200 px-3 py-2 text-left">
                                Booked
                              </th>
                              <th className="border border-gray-200 px-3 py-2 text-left">
                                From
                              </th>
                              <th className="border border-gray-200 px-3 py-2 text-left">
                                To
                              </th>
                              <th className="border border-gray-200 px-3 py-2 text-left">
                                To Time
                              </th>
                              <th className="border border-gray-200 px-3 py-2 text-left">
                                Maintenance
                              </th>

                              <th className="border border-gray-200 px-3 py-2 text-left">
                                Action
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            <AnimatePresence>
                              {type.rooms
  .filter((room) => {
    const matchesSearch = room.number
      .toLowerCase()
      .includes((searchTerms[type._id] || "").toLowerCase());

    if (!showTodayCheckoutOnly) return matchesSearch;

    const today = new Date().toISOString().split("T")[0];
    const bookedTo = room.bookedTo?.split("T")[0];

    return matchesSearch && bookedTo === today;
  })
                                .map((room, i) => {
                                  const key = `${type._id}-${room.number}`;
                                  const tempRoom = roomEdits[key];

                                  return (
                                    <motion.tr
                                      key={i}
                                      initial={{ opacity: 0, y: 10 }}
                                      animate={{ opacity: 1, y: 0 }}
                                      exit={{ opacity: 0, y: -10 }}
                                      transition={{ duration: 0.2 }}
                                      className="hover:bg-gray-50 transition-colors duration-150"
                                    >
                                      <td className="border border-gray-200 px-3 py-2 font-medium">
                                        {room.number}
                                      </td>
                                      <td className="border border-gray-200 px-3 py-2">
                                        <select
                                          value={
                                            tempRoom?.isBooked
                                              ? "true"
                                              : "false"
                                          }
                                          onChange={(e) =>
                                            setRoomEdits((prev) => ({
                                              ...prev,
                                              [key]: {
                                                ...prev[key],
                                                isBooked:
                                                  e.target.value === "true",
                                              },
                                            }))
                                          }
                                          className="border border-gray-300 rounded-md p-1 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                          <option value="false">No</option>
                                          <option value="true">Yes</option>
                                        </select>
                                      </td>
                                      <td className="border border-gray-200 px-3 py-2">
                                        <input
                                          type="date"
                                          value={
                                            tempRoom?.bookedFrom?.split(
                                              "T"
                                            )[0] || ""
                                          }
                                          onChange={(e) =>
                                            setRoomEdits((prev) => ({
                                              ...prev,
                                              [key]: {
                                                ...prev[key],
                                                bookedFrom: e.target.value,
                                              },
                                            }))
                                          }
                                          className="border border-gray-300 rounded-md p-1 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </td>
                                      <td className="border border-gray-200 px-3 py-2">
                                        <input
                                          type="date"
                                          value={
                                            tempRoom?.bookedTo?.split("T")[0] ||
                                            ""
                                          }
                                          onChange={(e) =>
                                            setRoomEdits((prev) => ({
                                              ...prev,
                                              [key]: {
                                                ...prev[key],
                                                bookedTo: e.target.value,
                                              },
                                            }))
                                          }
                                          className="border border-gray-300 rounded-md p-1 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </td>
                                      <td className="border border-gray-200 px-3 py-2">
                                        <input
                                          type="time"
                                          value={tempRoom?.bookedToTime || ""}
                                          onChange={(e) =>
                                            setRoomEdits((prev) => ({
                                              ...prev,
                                              [key]: {
                                                ...prev[key],
                                                bookedToTime: e.target.value,
                                              },
                                            }))
                                          }
                                          className="border border-gray-300 rounded-md p-1 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                        />
                                      </td>
                                      <td className="border border-gray-200 px-3 py-2">
                                        <select
                                          value={
                                            tempRoom?.maintenanceStatus || ""
                                          }
                                          onChange={(e) =>
                                            setRoomEdits((prev) => ({
                                              ...prev,
                                              [key]: {
                                                ...prev[key],
                                                maintenanceStatus:
                                                  e.target.value,
                                              },
                                            }))
                                          }
                                          className="border border-gray-300 rounded-md p-1 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
                                        >
                                          <option value="">None</option>
                                          <option value="Cleaning">
                                            Cleaning
                                          </option>
                                          <option value="Repair">Repair</option>
                                          <option value="Blocked">
                                            Blocked
                                          </option>
                                        </select>
                                      </td>

                                      <td className="border border-gray-200 px-3 py-2 text-center">
                                        <motion.button
                                          whileHover={{ scale: 1.1 }}
                                          whileTap={{ scale: 0.9 }}
                                          onClick={() =>
                                            handleRoomUpdate(
                                              type._id,
                                              room.number
                                            )
                                          }
                                          className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-semibold flex items-center justify-center gap-1 hover:bg-blue-600 transition duration-200"
                                        >
                                          <CheckCircleIcon className="h-4 w-4" />{" "}
                                          Save
                                        </motion.button>
                                      </td>
                                    </motion.tr>
                                  );
                                })}
                            </AnimatePresence>
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default AdminRoomManager;
