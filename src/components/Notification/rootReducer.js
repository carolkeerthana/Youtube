import { combineReducers } from "redux";
import authReducer from "../Notification/authSlice"; // Adjust the path as needed
import notificationReducer from "../Notification/notificationSlice"; // Adjust the path as needed

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
  // Add other reducers here
});

export default rootReducer;
