import { createSlice } from "@reduxjs/toolkit";

const notificationSlice = createSlice({
  name: "notification",
  initialState: {
    message: "",
    visible: false,
  },
  reducers: {
    showNotification: (state, action) => {
      state.message = action.payload;
      state.visible = true;
    },
    hideNotification: (state) => {
      state.message = "";
      state.visible = false;
    },
  },
});

export const { showNotification, hideNotification } = notificationSlice.actions;
export default notificationSlice.reducer;
