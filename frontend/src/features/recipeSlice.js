import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../utils/axios";
import { recipeApis } from "../constans/ApisUtils";
const initialState = {
    suggestTags: [],
    categories: [],
    recipes: [],
    recipe: {},
    dashboardData: null,
    loading: false,
    error: null,
};

export const suggestTags = createAsyncThunk(
    "recipe/suggestTags",
    async (q, { rejectWithValue }) => {
        try {
            const res = await api.get(`${recipeApis.suggestTag}?search=${q}`);
            console.log("Response:", res);
            return res.data.data; // ✅ sirf array of tags chahiye
        } catch (error) {
            console.log("Response Error:", error);
            return rejectWithValue(error?.response?.data || "Something went wrong");
        }
    }
);

export const addRecipe = createAsyncThunk("recipe/add-recipe", async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post(`${recipeApis.addRecipe}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("Response:", res.data);
        return res.data; // ✅ sirf array of tags chahiye
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Something went wrong");
    }
})


export const updateRecipe = createAsyncThunk("recipe/update-recipe", async ({ id, formData }, { rejectWithValue }) => {
    try {
        const res = await api.post(`${recipeApis.updateRecipe}/${id}`, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("Response:", res.data);
        return res.data; // ✅ sirf array of tags chahiye
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Something went wrong");
    }
})


export const getCategories = createAsyncThunk("recipe/getCategory", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(recipeApis.getCageroy);
        console.log("Response:", res.data);
        return res.data.data; // ✅ sirf array of category chahiye
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to load Category");
    }
})

export const getRecipes = createAsyncThunk("recipe/getRecipes", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(recipeApis.getRecipes);
        console.log("Response:", res.data);
        return res.data.data; // ✅ sirf array of recipes chahiye
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to load Category");
    }
})

export const getRecipe = createAsyncThunk(
    "recipe/getRecipe",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`${recipeApis.getRecipe}/${id}`); // ✅ id inject hua
            console.log("Response:", res.data);
            return res.data.data;
        } catch (error) {
            console.log("Response Error:", error);
            return rejectWithValue(error?.response?.data || "Failed to load Recipe");
        }
    }
);


export const dashboard = createAsyncThunk(
    "recipe/dashboard",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`${recipeApis.dashboard}`);
            console.log("Response:", res.data);
            return res.data.data;
        } catch (error) {
            console.log("Response Error:", error);
            return rejectWithValue(error?.response?.data || "Failed to load Recipe");
        }
    }
);


export const addCategory = createAsyncThunk("recipe/addCategory", async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post(recipeApis.addCategory, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("Response:", res.data);
        return res.data; // ✅ sirf array of recipes chahiye
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to save Category");
    }
})

const recipeSlice = createSlice({
    name: "recipe",
    initialState,
    reducers: {
        clearSuggestTag: (state, action) => {
            state.suggestTags = [];
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(suggestTags.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(suggestTags.fulfilled, (state, action) => {
                state.loading = false;
                state.suggestTags = action.payload; // ✅ yahan array set ho raha
            })
            .addCase(suggestTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                state.loading = false;
                state.categories = action.payload; // ✅ yahan array set ho raha
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(getRecipes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes = action.payload; // ✅ yahan array set ho raha
            })
            .addCase(getRecipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
            .addCase(addRecipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes.push(action.payload?.data);// ✅ yahan array set ho raha
            })
            .addCase(addRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(updateRecipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes.push(action.payload?.data);// ✅ yahan array set ho raha
            })
            .addCase(updateRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(addCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.categories.push(action.payload.data); // ✅ yahan array set ho raha
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getRecipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.recipe = action.payload; // ✅ yahan array set ho raha
            })
            .addCase(getRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })
             .addCase(dashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(dashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.dashboardData = action.payload; // ✅ yahan array set ho raha
            })
            .addCase(dashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


    },
});

export const { clearSuggestTag } = recipeSlice.actions;

export default recipeSlice.reducer;
