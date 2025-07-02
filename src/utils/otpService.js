// frontend/utils/otpService.js
import axios from 'axios';

export const sendOTP = async (email, phone) => {
  return axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/send`, { email, phone });
};

export const verifyOTP = async (email, otp) => {
  const res = await axios.post(`${import.meta.env.VITE_API_BASE_URL}/api/otp/verify`, { email, otp });
  return res.data.success;
};
