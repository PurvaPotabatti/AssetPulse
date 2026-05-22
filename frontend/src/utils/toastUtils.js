import toast from "react-hot-toast";

export const successToast = (message) => {
  toast.success(message);
};

export const errorToast = (message) => {
  toast.error(message);
};

export const infoToast = (message) => {
  toast(message);
};

export const warningToast = (message) => {
  toast(message, {
    icon: "⚠️",
  });
};