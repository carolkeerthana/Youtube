import { combineReducers } from "redux";
import authReducer from "../Notification/authSlice";
import notificationReducer from "../Notification/notificationSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  notifications: notificationReducer,
});

export default rootReducer;
