import React, { useEffect } from "react";
import "./CustomNotification.css";
import { useDispatch, useSelector } from "react-redux";
import { hideNotification } from "./notificationSlice";

const CustomNotification = () => {
  const dispatch = useDispatch();
  const message = useSelector((state) => state.notifications.message);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        dispatch(hideNotification());
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [dispatch, message]);

  if (!message) return null;

  return (
    <div className="custom-notification">
      <p>{message}</p>
    </div>
  );
};

export default CustomNotification;
