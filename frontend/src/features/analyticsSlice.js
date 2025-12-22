import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/axios";
import { chefApis } from "../constans/ApisUtils";

const initialState = {
    loading: false,


    recipes: {
        total: 0,
        published: null,
        drafts: null,
        deleted: null,
        totalLikes: 0,
        totalShares: 0,
        totalViews: 0
    },
    deleteRequests: {
        pending: 0
    },

    charts: {
        last7DaysRecipes: [],
        last7DaysLikes: [],
    },
    topRecipes: [],
    error: null,
    allRequests: []
}

export const getDashboard = createAsyncThunk("analytics/getDashboard", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(chefApis.chefDashboard);
        return { data: res.data.data, message: res.data.message };

    } catch (error) {
        const backendMessage = error?.response?.data?.message || err.message || "Failed to load";
        return rejectWithValue({ message: backendMessage, data: error?.response?.data });
    }
});






const analyticSlice = createSlice({
    name: "analytics",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder.addCase(getDashboard.pending, (state, action) => {
            state.loading = true;
        })
            .addCase(getDashboard.fulfilled, (state, action) => {
                console.log(action.payload.data);
                state.deleteRequests = action.payload.data?.deleteRequests;
                state.recipes = action.payload.data?.recipes;
                state.loading = false;
                state.error = null;


            })
            .addCase(getDashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })




    },

});

// export const { clearSuggestTag } = recipeSlice.actions;

// export default recipeSlice.reducer;


export const { } = analyticSlice.actions;
export default analyticSlice.reducer;


