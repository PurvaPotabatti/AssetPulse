import API from "./axiosConfig";

/*
  fetch all notifications
*/
export const getNotifications = async () => {

  const response = await API.get("/notifications/my");

  return response.data;

};

/*
  mark all notifications as read
*/
export const markAllNotificationsRead = async () => {

  const response = await API.put(
    "/notifications/read-all"
  );

  return response.data;

};