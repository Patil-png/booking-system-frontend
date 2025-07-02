// frontend/utils/otpService.js
import axios from 'axios';

export const sendOTP = async (email, phone) => {
  return axios.post('http://localhost:5000/api/otp/send', { email, phone });
};

export const verifyOTP = async (email, otp) => {
  const res = await axios.post('http://localhost:5000/api/otp/verify', { email, otp });
  return res.data.success;
};
