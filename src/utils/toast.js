import { toast } from 'react-toastify';

const defaultOptions = {
  position: "top-center",
  autoClose: 3000,
  hideProgressBar: false,
  closeOnClick: true,
  pauseOnHover: true,
  draggable: true,
};

export const showToast = {
  success: (message) => {
    toast.success(message, defaultOptions);
  },
  error: (message) => {
    toast.error(message, defaultOptions);
  }
};