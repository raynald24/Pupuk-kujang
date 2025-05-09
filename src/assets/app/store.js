import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/Authslice"; // Perhatikan kapitalisasi

export const store = configureStore({
  reducer: {
    auth: authReducer,
  },
});
