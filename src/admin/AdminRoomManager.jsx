import React, { useEffect, useState } from "react";
import axios from "axios";
import { AnimatePresence, motion } from "framer-motion";
import { Transition } from "@headlessui/react";
import {
  XCircleIcon,
  PlusCircleIcon,
  CheckCircleIcon,
  TrashIcon,
  ArrowDownCircleIcon,
  HomeIcon,
  CalendarIcon,
  UserGroupIcon,
  CameraIcon,
  MagnifyingGlassIcon,
  ClockIcon,
  WrenchScrewdriverIcon,
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
  const [showAddRoomSection, setShowAddRoomSection] = useState(false);

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
    setTimeout(() => setShowAlert(false), 3000);
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
      );
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
      setShowAddRoomSection(false);
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

  const containerVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: [0.25, 0.46, 0.45, 0.94],
        when: "beforeChildren",
        staggerChildren: 0.1
      }
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.98 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { 
        duration: 0.6, 
        ease: [0.25, 0.46, 0.45, 0.94] 
      } 
    },
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Mobile-Optimized Alert System */}
      <Transition
        show={showAlert}
        enter="transition-all duration-300 ease-out"
        enterFrom="opacity-0 translate-y-[-50px] scale-95"
        enterTo="opacity-100 translate-y-0 scale-100"
        leave="transition-all duration-500 ease-in"
        leaveFrom="opacity-100 translate-y-0 scale-100"
        leaveTo="opacity-0 translate-y-[-50px] scale-95"
      >
        {alertMessage && (
          <div
            className={`fixed top-4 left-4 right-4 sm:top-6 sm:right-6 sm:left-auto z-50 p-4 sm:p-5 rounded-2xl shadow-2xl flex items-center space-x-3 sm:space-x-4 backdrop-blur-md border-2 max-w-md mx-auto sm:mx-0
            ${
              alertMessage.type === "success"
                ? "bg-emerald-500/90 text-white border-emerald-300"
                : "bg-red-500/90 text-white border-red-300"
            }`}
            role="alert"
          >
            <div className="flex-shrink-0">
              {alertMessage.type === "success" ? (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <CheckCircleIcon className="h-5 w-5" />
                </div>
              ) : (
                <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                  <XCircleIcon className="h-5 w-5" />
                </div>
              )}
            </div>
            <div className="flex-1">
              <p className="font-semibold text-sm sm:text-base">{alertMessage.message}</p>
            </div>
          </div>
        )}
      </Transition>

      <motion.div 
        className="container mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Mobile-Responsive Header */}
        <motion.div 
          className="text-center mb-8 sm:mb-12"
          variants={itemVariants}
        >
          <div className="inline-flex items-center justify-center w-16 h-16 sm:w-20 sm:h-20 bg-gradient-to-br from-blue-600 to-indigo-700 rounded-2xl sm:rounded-3xl mb-4 sm:mb-6 shadow-xl">
            <HomeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-white" />
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent mb-3 sm:mb-4 px-4">
            Admin Room Management
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 max-w-2xl mx-auto px-4">
            Efficiently manage your hotel rooms, bookings, and maintenance status
          </p>
        </motion.div>

        {/* Mobile-Responsive Add Room Toggle Button */}
        <motion.div 
          className="flex justify-center mb-8 sm:mb-10 px-4"
          variants={itemVariants}
        >
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddRoomSection(!showAddRoomSection)}
            className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl sm:rounded-2xl font-bold text-base sm:text-lg flex items-center space-x-2 sm:space-x-3 hover:from-blue-700 hover:to-indigo-800 transition-all duration-300 shadow-xl hover:shadow-2xl w-full sm:w-auto max-w-sm"
          >
            {showAddRoomSection ? (
              <>
                <XCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Hide Add Room Section</span>
              </>
            ) : (
              <>
                <PlusCircleIcon className="h-5 w-5 sm:h-6 sm:w-6" />
                <span className="text-sm sm:text-base">Add New Room Type</span>
              </>
            )}
          </motion.button>
        </motion.div>

        {/* Mobile-Responsive Add Room Form */}
        <AnimatePresence>
          {showAddRoomSection && (
            <motion.div
              initial={{ opacity: 0, height: 0, y: -20 }}
              animate={{ opacity: 1, height: "auto", y: 0 }}
              exit={{ opacity: 0, height: 0, y: -20 }}
              transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
              className="bg-white/80 backdrop-blur-sm p-4 sm:p-6 lg:p-8 rounded-2xl sm:rounded-3xl shadow-2xl mb-8 sm:mb-12 max-w-5xl mx-auto border border-white/20 overflow-hidden"
            >
              <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-4 mb-6 sm:mb-8">
                <div className="w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br from-emerald-500 to-teal-600 rounded-xl sm:rounded-2xl flex items-center justify-center flex-shrink-0">
                  <PlusCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-white" />
                </div>
                <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Add New Room Type</h2>
              </div>
              
              <form onSubmit={handleCreate} className="space-y-4 sm:space-y-6">
                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <HomeIcon className="w-4 h-4 text-blue-500" />
                    Room Type Name
                  </label>
                  <input
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base sm:text-lg bg-white hover:shadow-md"
                    placeholder="e.g., Deluxe Suite, Standard Room"
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    required
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-4 h-4 bg-green-500 rounded-full"></span>
                      Base Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base sm:text-lg bg-white hover:shadow-md"
                      placeholder="Base Price"
                      value={form.basePrice}
                      onChange={(e) => setForm({ ...form, basePrice: e.target.value })}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                      <span className="w-4 h-4 bg-yellow-500 rounded-full"></span>
                      Seasonal Price (₹)
                    </label>
                    <input
                      type="number"
                      className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base sm:text-lg bg-white hover:shadow-md"
                      placeholder="Seasonal Price (Optional)"
                      value={form.seasonalPrice}
                      onChange={(e) => setForm({ ...form, seasonalPrice: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <span className="w-4 h-4 bg-purple-500 rounded-full"></span>
                    Amenities
                  </label>
                  <input
                    className="w-full p-3 sm:p-4 border-2 border-gray-200 rounded-xl sm:rounded-2xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 text-base sm:text-lg bg-white hover:shadow-md"
                    placeholder="e.g., AC, WiFi, Balcony, Room Service"
                    value={form.amenities}
                    onChange={(e) => setForm({ ...form, amenities: e.target.value })}
                    required
                  />
                </div>

                <div className="space-y-3 sm:space-y-4">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <UserGroupIcon className="w-4 h-4 text-indigo-500" />
                    Room Numbers
                  </label>
                  <div className="bg-gray-50 p-4 sm:p-6 rounded-xl sm:rounded-2xl space-y-3">
                    <AnimatePresence>
                      {roomNumbers.map((num, i) => (
                        <motion.div
                          key={i}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: 20 }}
                          transition={{ duration: 0.3 }}
                          className="flex items-center gap-3"
                        >
                          <input
                            className="flex-1 p-3 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300 bg-white text-base"
                            placeholder="Room Number"
                            value={num}
                            onChange={(e) => {
                              const updated = [...roomNumbers];
                              updated[i] = e.target.value;
                              setRoomNumbers(updated);
                            }}
                            required
                          />
                          <motion.button
                            type="button"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            className="w-10 h-10 sm:w-12 sm:h-12 bg-red-500 text-white rounded-lg sm:rounded-xl flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                            onClick={() =>
                              setRoomNumbers((prev) =>
                                prev.filter((_, idx) => idx !== i)
                              )
                            }
                          >
                            <XCircleIcon className="h-5 w-5" />
                          </motion.button>
                        </motion.div>
                      ))}
                    </AnimatePresence>
                    <motion.button
                      type="button"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setRoomNumbers((prev) => [...prev, ""])}
                      className="w-full p-3 border-2 border-dashed border-blue-300 text-blue-600 rounded-lg sm:rounded-xl hover:border-blue-500 hover:bg-blue-50 transition-all duration-200 flex items-center justify-center gap-2 font-medium text-sm sm:text-base"
                    >
                      <PlusCircleIcon className="h-5 w-5" /> Add Room Number
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-bold text-gray-700 flex items-center gap-2">
                    <CameraIcon className="w-4 h-4 text-pink-500" />
                    Room Photos
                  </label>
                  <div className="relative">
                    <input
                      type="file"
                      multiple
                      accept="image/*"
                      onChange={handleFileChange}
                      className="w-full p-3 sm:p-4 border-2 border-dashed border-gray-300 rounded-xl sm:rounded-2xl transition-all duration-300 hover:border-blue-400 hover:bg-blue-50 file:mr-4 file:py-2 file:px-4 sm:file:px-6 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-600 file:text-white hover:file:bg-blue-700 text-sm sm:text-base"
                    />
                  </div>
                </div>

                <motion.button
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="w-full bg-gradient-to-r from-emerald-600 to-teal-700 text-white py-4 sm:py-5 rounded-xl sm:rounded-2xl font-bold text-lg sm:text-xl tracking-wide hover:from-emerald-700 hover:to-teal-800 transition-all duration-300 shadow-xl hover:shadow-2xl flex items-center justify-center gap-3"
                >
                  <CheckCircleIcon className="w-5 h-5 sm:w-6 sm:h-6" />
                  <span>Add Room Type</span>
                </motion.button>
              </form>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Mobile-Responsive Existing Room Types */}
        <motion.div
          variants={itemVariants}
          className="max-w-7xl mx-auto"
        >
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-6 sm:mb-8 gap-4 sm:gap-0">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className="w-8 h-8 sm:w-10 sm:h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl sm:rounded-2xl flex items-center justify-center">
                <HomeIcon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
              </div>
              <h2 className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-800">Existing Room Types</h2>
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowTodayCheckoutOnly((prev) => !prev)}
              className={`px-4 sm:px-6 py-2 sm:py-3 rounded-xl sm:rounded-2xl font-semibold text-xs sm:text-sm shadow-lg transition-all duration-300 flex items-center gap-2 w-full sm:w-auto justify-center ${
                showTodayCheckoutOnly
                  ? "bg-emerald-600 text-white shadow-emerald-200"
                  : "bg-white text-gray-700 shadow-gray-200 hover:shadow-lg"
              }`}
            >
              <CalendarIcon className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden sm:inline">
                {showTodayCheckoutOnly ? "Showing Today Checkouts" : "Show Today Checkout Only"}
              </span>
              <span className="sm:hidden">
                {showTodayCheckoutOnly ? "Today Only" : "Show Today"}
              </span>
            </motion.button>
          </div>

          {loading ? (
            <div className="flex justify-center items-center h-48 sm:h-64">
              <div className="relative">
                <div className="w-16 h-16 sm:w-24 sm:h-24 border-4 border-blue-200 rounded-full animate-spin border-t-blue-600"></div>
                <div className="absolute inset-0 flex items-center justify-center">
                  <HomeIcon className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
                </div>
              </div>
            </div>
          ) : roomTypes.length === 0 ? (
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-12 sm:py-16 bg-white/60 backdrop-blur-sm rounded-2xl sm:rounded-3xl border border-white/20 mx-4 sm:mx-0"
            >
              <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 sm:mb-6">
                <HomeIcon className="w-8 h-8 sm:w-10 sm:h-10 text-gray-400" />
              </div>
              <p className="text-xl sm:text-2xl text-gray-600 font-medium px-4">No room types added yet</p>
              <p className="text-gray-500 mt-2 px-4">Start by adding your first room type above!</p>
            </motion.div>
          ) : (
            <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 sm:gap-8">
              <AnimatePresence>
                {roomTypes.map((type) => {
                  const bookedRooms = type.rooms.filter((r) => r.isBooked).length;
                  const maintenanceRooms = type.rooms.filter(
                    (r) =>
                      r.maintenanceStatus === "Cleaning" ||
                      r.maintenanceStatus === "Repair" ||
                      r.maintenanceStatus === "Blocked"
                  ).length;
                  const availableRooms = type.rooms.length - bookedRooms - maintenanceRooms;

                  return (
                    <motion.div
                      key={type._id}
                      layout
                      initial={{ opacity: 0, scale: 0.9, y: 20 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.9, y: -20 }}
                      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
                      className="bg-white/80 backdrop-blur-sm rounded-2xl sm:rounded-3xl shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden border border-white/20"
                    >
                      {/* Mobile-Responsive Header */}
                      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 p-4 sm:p-6 relative overflow-hidden">
                        <div className="absolute inset-0 bg-black/10"></div>
                        <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start gap-3 sm:gap-0">
                          <div className="flex-1">
                            <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">{type.name}</h3>
                            <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-blue-100 text-xs sm:text-sm">
                              <span className="flex items-center gap-1">
                                <span className="w-2 h-2 bg-green-400 rounded-full"></span>
                                ₹{type.basePrice} base
                              </span>
                              {type.seasonalPrice && (
                                <span className="flex items-center gap-1">
                                  <span className="w-2 h-2 bg-yellow-400 rounded-full"></span>
                                  ₹{type.seasonalPrice} seasonal
                                </span>
                              )}
                            </div>
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => handleDeleteRoomType(type._id)}
                            className="bg-red-500/20 text-white text-xs sm:text-sm px-3 sm:px-4 py-1.5 sm:py-2 rounded-full flex items-center gap-1 sm:gap-2 hover:bg-red-500/30 transition-all duration-200 backdrop-blur-sm"
                          >
                            <TrashIcon className="h-3 w-3 sm:h-4 sm:w-4" /> 
                            <span className="hidden sm:inline">Delete</span>
                          </motion.button>
                        </div>
                      </div>

                      <div className="p-4 sm:p-6">
                        {/* Mobile-Responsive Amenities */}
                        <div className="mb-4 sm:mb-6">
                          <p className="text-sm text-gray-600 mb-2 font-medium">Amenities:</p>
                          <div className="flex flex-wrap gap-1 sm:gap-2">
                            {(type.amenities?.join(", ").split(", ") || []).map((amenity, idx) => (
                              <span
                                key={idx}
                                className="px-2 sm:px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-xs font-medium"
                              >
                                {amenity}
                              </span>
                            ))}
                          </div>
                        </div>

                        {/* Mobile-Responsive Room Statistics */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-4 mb-4 sm:mb-6">
                          <div className="text-center p-3 sm:p-4 bg-gray-50 rounded-xl sm:rounded-2xl">
                            <div className="text-lg sm:text-2xl font-bold text-gray-800">{type.rooms.length}</div>
                            <div className="text-xs text-gray-600 font-medium">Total</div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-emerald-50 rounded-xl sm:rounded-2xl">
                            <div className="text-lg sm:text-2xl font-bold text-emerald-600">{availableRooms}</div>
                            <div className="text-xs text-emerald-700 font-medium">Available</div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-yellow-50 rounded-xl sm:rounded-2xl">
                            <div className="text-lg sm:text-2xl font-bold text-yellow-600">{bookedRooms}</div>
                            <div className="text-xs text-yellow-700 font-medium">Booked</div>
                          </div>
                          <div className="text-center p-3 sm:p-4 bg-red-50 rounded-xl sm:rounded-2xl">
                            <div className="text-lg sm:text-2xl font-bold text-red-600">{maintenanceRooms}</div>
                            <div className="text-xs text-red-700 font-medium">Maintenance</div>
                          </div>
                        </div>

                        {/* Mobile-Responsive Photos */}
                        {type.photos?.length > 0 && (
                          <div className="mb-4 sm:mb-6">
                            <div className="grid grid-cols-2 gap-2 sm:gap-3">
                              {type.photos.map((photo, idx) => (
                                <motion.img
                                  key={idx}
                                  src={`http://localhost:5000/${photo}`}
                                  alt={`Room ${type.name}`}
                                  className="h-20 sm:h-24 w-full object-cover rounded-lg sm:rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
                                  initial={{ opacity: 0, scale: 0.9 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: idx * 0.1, duration: 0.5 }}
                                  whileHover={{ scale: 1.05 }}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Mobile-Responsive Add Room Number */}
                        <div className="mb-4 sm:mb-6">
                          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 sm:gap-3">
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
                              className="flex-1 p-2.5 sm:p-3 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                            />
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              className="bg-emerald-600 text-white px-4 py-2.5 sm:py-3 rounded-lg sm:rounded-xl text-sm font-semibold hover:bg-emerald-700 transition-all duration-200 flex items-center justify-center gap-2"
                              onClick={async () => {
                                const number = (newRoomNumbers[type._id] || "").trim();
                                if (!number) {
                                  showAlertMessage("Room number cannot be empty", "error");
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
                                  console.error("Failed to add room:", err);
                                  showAlertMessage(
                                    err.response?.data?.error || "Failed to add room",
                                    "error"
                                  );
                                }
                              }}
                            >
                              <PlusCircleIcon className="h-4 w-4" />
                              <span>Add</span>
                            </motion.button>
                          </div>
                        </div>

                        {/* Mobile-Responsive Room Management Table */}
                        <div className="mt-auto">
                          <h4 className="font-semibold text-gray-700 mb-3 text-sm sm:text-base">
                            Individual Room Status
                          </h4>
                          
                          <div className="mb-3">
                            <div className="relative">
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
                                className="w-full pl-10 pr-4 py-2 border-2 border-gray-200 rounded-lg sm:rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                              />
                              <MagnifyingGlassIcon className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
                            </div>
                          </div>

                          <div className="overflow-x-auto">
                            <table className="w-full text-xs sm:text-sm border-collapse border border-gray-200 rounded-lg overflow-hidden">
                              <thead className="bg-gray-100">
                                <tr>
                                  <th className="border border-gray-200 px-2 sm:px-3 py-2 text-left font-medium">
                                    Number
                                  </th>
                                  <th className="border border-gray-200 px-2 sm:px-3 py-2 text-left font-medium">
                                    Booked
                                  </th>
                                  <th className="border border-gray-200 px-2 sm:px-3 py-2 text-left font-medium">
                                    From
                                  </th>
                                  <th className="border border-gray-200 px-2 sm:px-3 py-2 text-left font-medium">
                                    To
                                  </th>
                                  <th className="border border-gray-200 px-2 sm:px-3 py-2 text-left font-medium">
                                    Time
                                  </th>
                                  <th className="border border-gray-200 px-2 sm:px-3 py-2 text-left font-medium">
                                    Status
                                  </th>
                                  <th className="border border-gray-200 px-2 sm:px-3 py-2 text-left font-medium">
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
                                          <td className="border border-gray-200 px-2 sm:px-3 py-2 font-medium">
                                            {room.number}
                                          </td>
                                          <td className="border border-gray-200 px-2 sm:px-3 py-2">
                                            <select
                                              value={tempRoom?.isBooked ? "true" : "false"}
                                              onChange={(e) =>
                                                setRoomEdits((prev) => ({
                                                  ...prev,
                                                  [key]: {
                                                    ...prev[key],
                                                    isBooked: e.target.value === "true",
                                                  },
                                                }))
                                              }
                                              className="w-full border border-gray-300 rounded-md p-1 text-xs focus:ring-blue-500 focus:border-blue-500"
                                            >
                                              <option value="false">No</option>
                                              <option value="true">Yes</option>
                                            </select>
                                          </td>
                                          <td className="border border-gray-200 px-2 sm:px-3 py-2">
                                            <input
                                              type="date"
                                              value={tempRoom?.bookedFrom?.split("T")[0] || ""}
                                              onChange={(e) =>
                                                setRoomEdits((prev) => ({
                                                  ...prev,
                                                  [key]: {
                                                    ...prev[key],
                                                    bookedFrom: e.target.value,
                                                  },
                                                }))
                                              }
                                              className="w-full border border-gray-300 rounded-md p-1 text-xs focus:ring-blue-500 focus:border-blue-500"
                                            />
                                          </td>
                                          <td className="border border-gray-200 px-2 sm:px-3 py-2">
                                            <input
                                              type="date"
                                              value={tempRoom?.bookedTo?.split("T")[0] || ""}
                                              onChange={(e) =>
                                                setRoomEdits((prev) => ({
                                                  ...prev,
                                                  [key]: {
                                                    ...prev[key],
                                                    bookedTo: e.target.value,
                                                  },
                                                }))
                                              }
                                              className="w-full border border-gray-300 rounded-md p-1 text-xs focus:ring-blue-500 focus:border-blue-500"
                                            />
                                          </td>
                                          <td className="border border-gray-200 px-2 sm:px-3 py-2">
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
                                              className="w-full border border-gray-300 rounded-md p-1 text-xs focus:ring-blue-500 focus:border-blue-500"
                                            />
                                          </td>
                                          <td className="border border-gray-200 px-2 sm:px-3 py-2">
                                            <select
                                              value={tempRoom?.maintenanceStatus || ""}
                                              onChange={(e) =>
                                                setRoomEdits((prev) => ({
                                                  ...prev,
                                                  [key]: {
                                                    ...prev[key],
                                                    maintenanceStatus: e.target.value,
                                                  },
                                                }))
                                              }
                                              className="w-full border border-gray-300 rounded-md p-1 text-xs focus:ring-blue-500 focus:border-blue-500"
                                            >
                                              <option value="">None</option>
                                              <option value="Cleaning">Cleaning</option>
                                              <option value="Repair">Repair</option>
                                              <option value="Blocked">Blocked</option>
                                            </select>
                                          </td>
                                          <td className="border border-gray-200 px-2 sm:px-3 py-2 text-center">
                                            <motion.button
                                              whileHover={{ scale: 1.1 }}
                                              whileTap={{ scale: 0.9 }}
                                              onClick={() => handleRoomUpdate(type._id, room.number)}
                                              className="bg-blue-500 text-white px-2 sm:px-3 py-1 rounded-md text-xs font-semibold flex items-center justify-center gap-1 hover:bg-blue-600 transition duration-200 w-full"
                                            >
                                              <CheckCircleIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                                              <span className="hidden sm:inline">Save</span>
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
                      </div>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
};

export default AdminRoomManager;


// import React, { useEffect, useState } from "react";
// import axios from "axios";
// import { AnimatePresence, motion } from "framer-motion"; // For animations
// import { Transition } from "@headlessui/react"; // For simple transitions
// import {
//   XCircleIcon,
//   PlusCircleIcon,
//   CheckCircleIcon,
//   TrashIcon,
//   ArrowDownCircleIcon, // New icon for showing the add section
// } from "@heroicons/react/24/solid";

// const AdminRoomManager = () => {
//   const [searchTerms, setSearchTerms] = useState({});

//   const [showTodayCheckoutOnly, setShowTodayCheckoutOnly] = useState(false);

//   const [selectedRoomTypeId, setSelectedRoomTypeId] = useState("all");


//   const [newRoomNumbers, setNewRoomNumbers] = useState({});

//   const [form, setForm] = useState({
//     name: "",
//     basePrice: "",
//     seasonalPrice: "",
//     amenities: "",
//     photos: [],
//   });

//   const [roomNumbers, setRoomNumbers] = useState([""]);
//   const [roomTypes, setRoomTypes] = useState([]);
//   const [roomEdits, setRoomEdits] = useState({});
//   const [loading, setLoading] = useState(true);
//   const [alertMessage, setAlertMessage] = useState(null);
//   const [showAlert, setShowAlert] = useState(false);
//   const [showAddRoomSection, setShowAddRoomSection] = useState(false); // New state for visibility

//   const fetchRoomTypes = async () => {
//     setLoading(true);
//     try {
//       const { data } = await axios.get(`${import.meta.env.VITE_API_BASE_URL}/api/room-types`);
//       setRoomTypes(data);
//       const edits = {};
//       data.forEach((type) =>
//         type.rooms.forEach((room) => {
//           edits[`${type._id}-${room.number}`] = { ...room };
//         })
//       );
//       setRoomEdits(edits);
//     } catch (err) {
//       console.error("Failed to fetch room types:", err);
//       showAlertMessage("Failed to fetch room types", "error");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchRoomTypes();
//   }, []);

//   const showAlertMessage = (message, type) => {
//     setAlertMessage({ message, type });
//     setShowAlert(true);
//     setTimeout(() => setShowAlert(false), 3000); // Hide after 3 seconds
//   };

//   const handleFileChange = (e) => {
//     setForm((prev) => ({ ...prev, photos: e.target.files }));
//   };

//   const handleCreate = async (e) => {
//     e.preventDefault();
//     if (
//       !form.name ||
//       !form.basePrice ||
//       !form.amenities ||
//       roomNumbers.some((num) => !num.trim())
//     ) {
//       showAlertMessage("Please fill in all required fields.", "error");
//       return;
//     }

//     try {
//       const formData = new FormData();
//       formData.append("name", form.name);
//       formData.append("basePrice", form.basePrice);
//       formData.append("seasonalPrice", form.seasonalPrice);
//       formData.append("amenities", form.amenities);
//       formData.append(
//         "roomNumbers",
//         JSON.stringify(
//           roomNumbers
//             .filter((num) => num.trim() !== "")
//             .map((num) => num.trim())
//         )
//       ); // Filter empty room numbers
//       for (let i = 0; i < form.photos.length; i++) {
//         formData.append("photos", form.photos[i]);
//       }

//       await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/room-types`, formData, {
//         headers: { "Content-Type": "multipart/form-data" },
//       });

//       setForm({
//         name: "",
//         basePrice: "",
//         seasonalPrice: "",
//         amenities: "",
//         photos: [],
//       });
//       setRoomNumbers([""]);
//       fetchRoomTypes();
//       showAlertMessage("Room type added successfully!", "success");
//       setShowAddRoomSection(false); // Hide the form after successful submission
//     } catch (err) {
//       console.error("Failed to create room type:", err);
//       showAlertMessage(
//         "Error creating room type. Please check server logs.",
//         "error"
//       );
//     }
//   };

//   const handleDeleteRoomType = async (roomTypeId) => {
//     if (!window.confirm("Are you sure you want to delete this room type?"))
//       return;
//     try {
//       await axios.delete(`${import.meta.env.VITE_API_BASE_URL}/api/room-types/${roomTypeId}`);
//       fetchRoomTypes();
//       showAlertMessage("Room type deleted successfully", "success");
//     } catch (err) {
//       console.error("Failed to delete room type:", err);
//       showAlertMessage("Error deleting room type", "error");
//     }
//   };

//   const handleRoomUpdate = async (roomTypeId, roomNumberRaw) => {
//     const roomNumber = String(roomNumberRaw).trim();
//     const key = `${roomTypeId}-${roomNumber}`;
//     const updatedRoom = roomEdits[key];

//     if (!window.confirm(`Are you sure you want to update room ${roomNumber}?`))
//       return;

//     try {
//       const maintenanceStatus = updatedRoom.maintenanceStatus || null;
//       await axios.put(
//         `${import.meta.env.VITE_API_BASE_URL}/api/room-types/${roomTypeId}/room-status/${roomNumber}`,
//         {
//           isBooked: updatedRoom.isBooked,
//           bookedFrom: updatedRoom.bookedFrom,
//           bookedTo: updatedRoom.bookedTo,
//           bookedToTime: updatedRoom.bookedToTime,
//           maintenanceStatus,
//         }
//       );

//       await fetchRoomTypes();
//       showAlertMessage(`Room ${roomNumber} updated successfully`, "success");
//     } catch (err) {
//       console.error("Failed to update room:", err);
//       showAlertMessage("Error updating room", "error");
//     }
//   };

//   return (
//     <div className="min-h-screen bg-gray-100 p-4 sm:p-6 lg:p-8">
//       {/* Global Alert Message */}
//       <Transition
//         show={showAlert}
//         enter="transition-opacity duration-300"
//         enterFrom="opacity-0"
//         enterTo="opacity-100"
//         leave="transition-opacity duration-500"
//         leaveFrom="opacity-100"
//         leaveTo="opacity-0"
//       >
//         {alertMessage && (
//           <div
//             className={`fixed top-4 right-4 z-50 p-4 rounded-lg shadow-lg flex items-center space-x-3
//             ${
//               alertMessage.type === "success"
//                 ? "bg-green-500 text-white"
//                 : "bg-red-500 text-white"
//             }`}
//             role="alert"
//           >
//             {alertMessage.type === "success" ? (
//               <CheckCircleIcon className="h-6 w-6" />
//             ) : (
//               <XCircleIcon className="h-6 w-6" />
//             )}
//             <span>{alertMessage.message}</span>
//           </div>
//         )}
//       </Transition>

//       <motion.h1
//         initial={{ opacity: 0, y: -20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ duration: 0.5 }}
//         className="text-3xl font-extrabold text-gray-800 mb-8 text-center"
//       >
//         Admin Room Management
//       </motion.h1>

//       {/* Button to toggle Add Room Type Form */}
//       <div className="flex justify-center mb-8">
//         <motion.button
//           whileHover={{ scale: 1.05 }}
//           whileTap={{ scale: 0.95 }}
//           onClick={() => setShowAddRoomSection(!showAddRoomSection)}
//           className="bg-blue-600 text-white px-6 py-3 rounded-md font-semibold text-lg flex items-center space-x-2 hover:bg-blue-700 transition duration-300 ease-in-out shadow-lg"
//         >
//           {showAddRoomSection ? (
//             <>
//               <XCircleIcon className="h-6 w-6" />
//               <span>Hide Add Room Section</span>
//             </>
//           ) : (
//             <>
//               <PlusCircleIcon className="h-6 w-6" />
//               <span>Add New Room Type</span>
//             </>
//           )}
//         </motion.button>
//       </div>

//       {/* Add Room Type Form - Conditionally rendered */}
//       <AnimatePresence>
//         {showAddRoomSection && (
//           <motion.div
//             initial={{ opacity: 0, height: 0 }}
//             animate={{ opacity: 1, height: "auto" }}
//             exit={{ opacity: 0, height: 0 }}
//             transition={{ duration: 0.5 }}
//             className="bg-white p-6 rounded-lg shadow-md mb-8 max-w-4xl mx-auto overflow-hidden"
//           >
//             <h2 className="text-2xl font-bold text-gray-700 mb-5">
//               Add New Room Type
//             </h2>
//             <form onSubmit={handleCreate} className="space-y-4">
//               <input
//                 className="border border-gray-300 p-3 w-full rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                 placeholder="Room Type Name (e.g., Deluxe Suite, Standard Room)"
//                 value={form.name}
//                 onChange={(e) => setForm({ ...form, name: e.target.value })}
//                 required
//               />
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 <input
//                   type="number"
//                   className="border border-gray-300 p-3 w-full rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                   placeholder="Base Price (₹)"
//                   value={form.basePrice}
//                   onChange={(e) =>
//                     setForm({ ...form, basePrice: e.target.value })
//                   }
//                   required
//                 />
//                 <input
//                   type="number"
//                   className="border border-gray-300 p-3 w-full rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                   placeholder="Seasonal Price (₹) (Optional)"
//                   value={form.seasonalPrice}
//                   onChange={(e) =>
//                     setForm({ ...form, seasonalPrice: e.target.value })
//                   }
//                 />
//               </div>
//               <input
//                 className="border border-gray-300 p-3 w-full rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                 placeholder="Amenities (comma separated, e.g., AC, WiFi, Balcony)"
//                 value={form.amenities}
//                 onChange={(e) =>
//                   setForm({ ...form, amenities: e.target.value })
//                 }
//                 required
//               />

//               <div>
//                 <label className="block font-semibold text-gray-700 mb-2">
//                   Room Numbers:
//                 </label>
//                 <AnimatePresence>
//                   {roomNumbers.map((num, i) => (
//                     <motion.div
//                       key={i}
//                       initial={{ opacity: 0, x: -20 }}
//                       animate={{ opacity: 1, x: 0 }}
//                       exit={{ opacity: 0, x: 20 }}
//                       transition={{ duration: 0.3 }}
//                       className="flex items-center gap-2 mb-2"
//                     >
//                       <input
//                         className="border border-gray-300 p-2 flex-1 rounded-md focus:ring-blue-500 focus:border-blue-500 transition duration-200"
//                         placeholder="Room Number"
//                         value={num}
//                         onChange={(e) => {
//                           const updated = [...roomNumbers];
//                           updated[i] = e.target.value;
//                           setRoomNumbers(updated);
//                         }}
//                         required
//                       />
//                       <button
//                         type="button"
//                         className="text-red-500 hover:text-red-700 transition duration-200 p-1"
//                         onClick={() =>
//                           setRoomNumbers((prev) =>
//                             prev.filter((_, idx) => idx !== i)
//                           )
//                         }
//                       >
//                         <XCircleIcon className="h-6 w-6" />
//                       </button>
//                     </motion.div>
//                   ))}
//                 </AnimatePresence>
//                 <button
//                   type="button"
//                   onClick={() => setRoomNumbers((prev) => [...prev, ""])}
//                   className="text-sm text-blue-600 hover:text-blue-800 transition duration-200 mt-2 flex items-center gap-1"
//                 >
//                   <PlusCircleIcon className="h-5 w-5" /> Add Room Number
//                 </button>
//               </div>

//               <label className="block font-semibold text-gray-700 mb-2">
//                 Room Photos:
//               </label>
//               <input
//                 type="file"
//                 multiple
//                 accept="image/*"
//                 onChange={handleFileChange}
//                 className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4
//                 file:rounded-full file:border-0 file:text-sm file:font-semibold
//                 file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100 transition duration-200"
//               />
//               <motion.button
//                 whileHover={{ scale: 1.02 }}
//                 whileTap={{ scale: 0.98 }}
//                 type="submit"
//                 className="w-full bg-gradient-to-r from-green-500 to-emerald-600 text-white px-6 py-3 rounded-md font-semibold text-lg hover:from-green-600 hover:to-emerald-700 transition duration-300 ease-in-out shadow-lg"
//               >
//                 Add Room Type
//               </motion.button>
//             </form>
//           </motion.div>
//         )}
//       </AnimatePresence>

//       {/* Existing Room Types */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4, duration: 0.5 }}
//         className="max-w-6xl mx-auto"
//       >
//         <h2 className="text-2xl font-bold text-gray-700 mb-5 text-center">
//   Existing Room Types
// </h2>


// <div className="mb-6 flex justify-end">
//   <button
//     onClick={() => setShowTodayCheckoutOnly((prev) => !prev)}
//     className={`px-4 py-2 rounded-md font-semibold text-sm shadow transition duration-300 ${
//       showTodayCheckoutOnly
//         ? "bg-green-600 text-white"
//         : "bg-gray-200 text-gray-700"
//     }`}
//   >
//     {showTodayCheckoutOnly ? "Showing Today Checkouts" : "Show Today Checkout Only"}
//   </button>
// </div>

// {loading ? (
//           <div className="flex justify-center items-center h-48">
//             <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-500"></div>
//           </div>
//         ) : roomTypes.length === 0 ? (
//           <p className="text-center text-gray-600 text-lg py-10">
//             No room types added yet. Start by adding one above!
//           </p>
//         ) : (
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
//             <AnimatePresence>
//               {roomTypes.map((type) => {
//                 const bookedRooms = type.rooms.filter((r) => r.isBooked).length;
//                 const maintenanceRooms = type.rooms.filter(
//                   (r) =>
//                     r.maintenanceStatus === "Cleaning" ||
//                     r.maintenanceStatus === "Repair" ||
//                     r.maintenanceStatus === "Blocked"
//                 ).length;
//                 const availableRooms =
//                   type.rooms.length - bookedRooms - maintenanceRooms;

//                 return (
//                   <motion.div
//                     key={type._id}
//                     layout
//                     initial={{ opacity: 0, scale: 0.9 }}
//                     animate={{ opacity: 1, scale: 1 }}
//                     exit={{ opacity: 0, scale: 0.9 }}
//                     transition={{ duration: 0.3 }}
//                     className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow duration-300 flex flex-col"
//                   >
//                     <div className="flex justify-between items-start mb-3">
//                       <h3 className="text-xl font-bold text-gray-800">
//                         {type.name}
//                       </h3>
//                       <motion.button
//                         whileHover={{ scale: 1.1 }}
//                         whileTap={{ scale: 0.9 }}
//                         onClick={() => handleDeleteRoomType(type._id)}
//                         className="bg-red-500 text-white text-xs px-3 py-1 rounded-full flex items-center gap-1 hover:bg-red-600 transition duration-200"
//                       >
//                         <TrashIcon className="h-4 w-4" /> Delete
//                       </motion.button>
//                     </div>

//                     <div className="grid grid-cols-2 gap-2 mb-4 text-sm text-gray-600">
//                       <p>
//                         <strong>Base Price:</strong>{" "}
//                         <span className="font-medium">₹{type.basePrice}</span>
//                       </p>
//                       <p>
//                         <strong>Seasonal Price:</strong>{" "}
//                         <span className="font-medium">
//                           ₹{type.seasonalPrice || "N/A"}
//                         </span>
//                       </p>
//                       <p className="col-span-2">
//                         <strong>Amenities:</strong>{" "}
//                         <span className="font-medium">
//                           {type.amenities?.join(", ") || "None"}
//                         </span>
//                       </p>
//                     </div>

//                     <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center text-sm font-semibold text-gray-700 mb-4 py-4 border-t border-b border-gray-200">
//                       <div className="flex flex-col items-center">
//                         <span>Total</span>
//                         <span className="text-lg font-bold">
//                           {type.rooms.length}
//                         </span>
//                       </div>
//                       <div>
//                         Available:{" "}
//                         <span className="block text-lg font-bold text-green-600">
//                           {availableRooms}
//                         </span>
//                       </div>
//                       <div>
//                         Booked:{" "}
//                         <span className="block text-lg font-bold text-yellow-600">
//                           {bookedRooms}
//                         </span>
//                       </div>
//                       <div>
//                         Maintenance:{" "}
//                         <span className="block text-lg font-bold text-red-600">
//                           {maintenanceRooms}
//                         </span>
//                       </div>
//                     </div>

//                     {type.photos?.length > 0 && (
//                       <div className="grid grid-cols-2 gap-2 mt-2 mb-4">
//                         {type.photos.map((photo, idx) => (
//                           <motion.img
//                             key={idx}
//                             src={`${import.meta.env.VITE_API_BASE_URL}/${photo}`}
//                             alt={`Room ${type.name}`}
//                             className="h-32 w-full object-cover rounded-md shadow-sm transform hover:scale-105 transition-transform duration-300"
//                             initial={{ opacity: 0 }}
//                             animate={{ opacity: 1 }}
//                             transition={{ delay: idx * 0.1, duration: 0.5 }}
//                           />
//                         ))}
//                       </div>
//                     )}

//                     <div className="mt-auto">
//                       {" "}
//                       {/* Pushes room numbers table to the bottom */}
//                       <h4 className="font-semibold text-gray-700 mb-3">
//                         Individual Room Status
//                       </h4>
//                       {/* ✅ Add Room Number Section */}
//                       <div className="flex items-center gap-2 mb-4">
//                         <input
//                           type="text"
//                           placeholder="New room number"
//                           value={newRoomNumbers[type._id] || ""}
//                           onChange={(e) =>
//                             setNewRoomNumbers((prev) => ({
//                               ...prev,
//                               [type._id]: e.target.value,
//                             }))
//                           }
//                           className="border border-gray-300 rounded-md px-3 py-2 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
//                         />
//                         <motion.button
//                           whileHover={{ scale: 1.05 }}
//                           whileTap={{ scale: 0.95 }}
//                           className="bg-green-600 text-white px-4 py-2 rounded-md text-sm font-semibold hover:bg-green-700 transition duration-200"
//                           onClick={async () => {
//                             const number = (
//                               newRoomNumbers[type._id] || ""
//                             ).trim();
//                             if (!number) {
//                               showAlertMessage(
//                                 "Room number cannot be empty",
//                                 "error"
//                               );
//                               return;
//                             }

//                             try {
//                               await axios.put(
//                                 `${import.meta.env.VITE_API_BASE_URL}/api/room-types/${type._id}/add-room`,
//                                 { number }
//                               );
//                               setNewRoomNumbers((prev) => ({
//                                 ...prev,
//                                 [type._id]: "",
//                               }));
//                               await fetchRoomTypes();
//                               showAlertMessage(
//                                 `Room ${number} added successfully`,
//                                 "success"
//                               );
//                             } catch (err) {
//                               console.error("❌ Failed to add room:", err);
//                               showAlertMessage(
//                                 err.response?.data?.error ||
//                                   "Failed to add room",
//                                 "error"
//                               );
//                             }
//                           }}
//                         >
//                           <PlusCircleIcon className="h-4 w-4 inline-block mr-1" />
//                           Add
//                         </motion.button>
//                       </div>
//                       <div className="overflow-x-auto">
//                         <div className="mb-2">
//                           <input
//                             type="text"
//                             value={searchTerms[type._id] || ""}
//                             onChange={(e) =>
//                               setSearchTerms((prev) => ({
//                                 ...prev,
//                                 [type._id]: e.target.value,
//                               }))
//                             }
//                             placeholder="Search room number..."
//                             className="w-full border border-gray-300 rounded-md px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
//                           />
//                         </div>
//                         <table className="w-full text-sm border-collapse border border-gray-200">
//                           <thead className="bg-gray-100">
//                             <tr>
//                               <th className="border border-gray-200 px-3 py-2 text-left">
//                                 Number
//                               </th>
//                               <th className="border border-gray-200 px-3 py-2 text-left">
//                                 Booked
//                               </th>
//                               <th className="border border-gray-200 px-3 py-2 text-left">
//                                 From
//                               </th>
//                               <th className="border border-gray-200 px-3 py-2 text-left">
//                                 To
//                               </th>
//                               <th className="border border-gray-200 px-3 py-2 text-left">
//                                 To Time
//                               </th>
//                               <th className="border border-gray-200 px-3 py-2 text-left">
//                                 Maintenance
//                               </th>

//                               <th className="border border-gray-200 px-3 py-2 text-left">
//                                 Action
//                               </th>
//                             </tr>
//                           </thead>
//                           <tbody>
//                             <AnimatePresence>
//                               {type.rooms
//   .filter((room) => {
//     const matchesSearch = room.number
//       .toLowerCase()
//       .includes((searchTerms[type._id] || "").toLowerCase());

//     if (!showTodayCheckoutOnly) return matchesSearch;

//     const today = new Date().toISOString().split("T")[0];
//     const bookedTo = room.bookedTo?.split("T")[0];

//     return matchesSearch && bookedTo === today;
//   })
//                                 .map((room, i) => {
//                                   const key = `${type._id}-${room.number}`;
//                                   const tempRoom = roomEdits[key];

//                                   return (
//                                     <motion.tr
//                                       key={i}
//                                       initial={{ opacity: 0, y: 10 }}
//                                       animate={{ opacity: 1, y: 0 }}
//                                       exit={{ opacity: 0, y: -10 }}
//                                       transition={{ duration: 0.2 }}
//                                       className="hover:bg-gray-50 transition-colors duration-150"
//                                     >
//                                       <td className="border border-gray-200 px-3 py-2 font-medium">
//                                         {room.number}
//                                       </td>
//                                       <td className="border border-gray-200 px-3 py-2">
//                                         <select
//                                           value={
//                                             tempRoom?.isBooked
//                                               ? "true"
//                                               : "false"
//                                           }
//                                           onChange={(e) =>
//                                             setRoomEdits((prev) => ({
//                                               ...prev,
//                                               [key]: {
//                                                 ...prev[key],
//                                                 isBooked:
//                                                   e.target.value === "true",
//                                               },
//                                             }))
//                                           }
//                                           className="border border-gray-300 rounded-md p-1 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
//                                         >
//                                           <option value="false">No</option>
//                                           <option value="true">Yes</option>
//                                         </select>
//                                       </td>
//                                       <td className="border border-gray-200 px-3 py-2">
//                                         <input
//                                           type="date"
//                                           value={
//                                             tempRoom?.bookedFrom?.split(
//                                               "T"
//                                             )[0] || ""
//                                           }
//                                           onChange={(e) =>
//                                             setRoomEdits((prev) => ({
//                                               ...prev,
//                                               [key]: {
//                                                 ...prev[key],
//                                                 bookedFrom: e.target.value,
//                                               },
//                                             }))
//                                           }
//                                           className="border border-gray-300 rounded-md p-1 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
//                                         />
//                                       </td>
//                                       <td className="border border-gray-200 px-3 py-2">
//                                         <input
//                                           type="date"
//                                           value={
//                                             tempRoom?.bookedTo?.split("T")[0] ||
//                                             ""
//                                           }
//                                           onChange={(e) =>
//                                             setRoomEdits((prev) => ({
//                                               ...prev,
//                                               [key]: {
//                                                 ...prev[key],
//                                                 bookedTo: e.target.value,
//                                               },
//                                             }))
//                                           }
//                                           className="border border-gray-300 rounded-md p-1 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
//                                         />
//                                       </td>
//                                       <td className="border border-gray-200 px-3 py-2">
//                                         <input
//                                           type="time"
//                                           value={tempRoom?.bookedToTime || ""}
//                                           onChange={(e) =>
//                                             setRoomEdits((prev) => ({
//                                               ...prev,
//                                               [key]: {
//                                                 ...prev[key],
//                                                 bookedToTime: e.target.value,
//                                               },
//                                             }))
//                                           }
//                                           className="border border-gray-300 rounded-md p-1 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
//                                         />
//                                       </td>
//                                       <td className="border border-gray-200 px-3 py-2">
//                                         <select
//                                           value={
//                                             tempRoom?.maintenanceStatus || ""
//                                           }
//                                           onChange={(e) =>
//                                             setRoomEdits((prev) => ({
//                                               ...prev,
//                                               [key]: {
//                                                 ...prev[key],
//                                                 maintenanceStatus:
//                                                   e.target.value,
//                                               },
//                                             }))
//                                           }
//                                           className="border border-gray-300 rounded-md p-1 w-full text-sm focus:ring-blue-500 focus:border-blue-500"
//                                         >
//                                           <option value="">None</option>
//                                           <option value="Cleaning">
//                                             Cleaning
//                                           </option>
//                                           <option value="Repair">Repair</option>
//                                           <option value="Blocked">
//                                             Blocked
//                                           </option>
//                                         </select>
//                                       </td>

//                                       <td className="border border-gray-200 px-3 py-2 text-center">
//                                         <motion.button
//                                           whileHover={{ scale: 1.1 }}
//                                           whileTap={{ scale: 0.9 }}
//                                           onClick={() =>
//                                             handleRoomUpdate(
//                                               type._id,
//                                               room.number
//                                             )
//                                           }
//                                           className="bg-blue-500 text-white px-3 py-1 rounded-md text-xs font-semibold flex items-center justify-center gap-1 hover:bg-blue-600 transition duration-200"
//                                         >
//                                           <CheckCircleIcon className="h-4 w-4" />{" "}
//                                           Save
//                                         </motion.button>
//                                       </td>
//                                     </motion.tr>
//                                   );
//                                 })}
//                             </AnimatePresence>
//                           </tbody>
//                         </table>
//                       </div>
//                     </div>
//                   </motion.div>
//                 );
//               })}
//             </AnimatePresence>
//           </div>
//         )}
//       </motion.div>
//     </div>
//   );
// };

// export default AdminRoomManager;
