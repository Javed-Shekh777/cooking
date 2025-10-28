import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice"; // ✅ default export hai, isliye naam kuch bhi de sakte ho
import recipeReducer from "./features/recipeSlice"; // ✅ default export hai, isliye naam kuch bhi de sakte ho


const store = configureStore({
  reducer: {
    auth: authReducer, // ✅
    recipe:recipeReducer
  },
});

export default store;
