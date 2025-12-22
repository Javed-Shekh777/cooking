import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./features/authSlice"; // ✅ default export hai, isliye naam kuch bhi de sakte ho
import recipeReducer from "./features/recipeSlice"; // ✅ default export hai, isliye naam kuch bhi de sakte ho
import categoryReducer from "./features/categorySlice"; // ✅ default export hai, isliye naam kuch bhi de sakte ho
import analyticsReducer from "./features/analyticsSlice"; // ✅ default export hai, isliye naam kuch bhi de sakte ho
import adminReducer from "./features/adminSlice"; // ✅ default export hai, isliye naam kuch bhi de sakte ho





const store = configureStore({
  reducer: {
    auth: authReducer, // ✅
    recipe: recipeReducer,
    category: categoryReducer,
    analytics: analyticsReducer,
    admin: adminReducer
  },
});

export default store;
