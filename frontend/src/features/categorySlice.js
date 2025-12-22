import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import {  categoryApi} from "../constans/ApisUtils";
import api from "../utils/axios";

const initialState = {
    categories: [],
    recipeCategory: [],
    loading: false,
    error: null,
    category: null,
};


export const getCategory = createAsyncThunk(
    "category/getCategory",
    async (id, { rejectWithValue }) => {

        try {

            console.log(`${categoryApi.getCategory}/${id}`)
            const res = await api.get(`${categoryApi.getCategory}/${id}`); // ✅ id inject hua
            console.log("Response:", res.data);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "failed to load";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);


export const addCategory = createAsyncThunk("category/addCategory", async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post(categoryApi.addCategory, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
})


export const updateCategory = createAsyncThunk("category/updateCategory", async ({ id, formData }, { rejectWithValue }) => {
    try {
        const url = `${categoryApi.updateCategory}/${id}`;
        const res = await api.post(url, formData, {
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
})

export const getCategories = createAsyncThunk("category/getCategories", async (_, { rejectWithValue }) => {
    try {

        const res = await api.get(categoryApi.getCategories);
       console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
})


const categorySlice = createSlice({
    name: "category",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(addCategory.pending, (state) => {
            state.loading = true;
            state.error = null;
        })
            .addCase(addCategory.fulfilled, (state, action) => {
                 
                state.categories.push(action.payload.data); // ✅ yahan array set ho raha
                       state.loading = false;
                state.error=null;
            })
            .addCase(addCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })

            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                 
                console.log(action.payload.data);
                const updatedCategory = action.payload.data;

                const index = state.categories.findIndex(
                    c => c._id === updatedCategory._id
                );

                if (index !== -1) {
                    state.categories[index] = updatedCategory;
                }

                if (state.category && state.category._id === updatedCategory._id) {
                    state.category = updatedCategory;
                }

                       state.loading = false;
                state.error=null;
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })


            .addCase(getCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategory.fulfilled, (state, action) => {
               
                console.log("payload: ", action.payload);
                state.category = action.payload.data; // ✅ yahan array set ho raha
                       state.loading = false;
                state.error=null;
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.loading = false;
                console.log("payload: ", action.payload);

                state.error = action.payload?.message;

            })

            .addCase(getCategories.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getCategories.fulfilled, (state, action) => {
                
                state.categories = action.payload.data; // ✅ yahan array set ho raha
                       state.loading = false;
                state.error=null;
            })
            .addCase(getCategories.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })


    }
});

export const { } = categorySlice.actions;
export default categorySlice.reducer;


