import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../utils/axios";
import { authApis } from "../constans/ApisUtils";


const initialState = {
    user: JSON.parse(localStorage.getItem("user") || null) || null,
    // accessToken: localStorage.getItem("refreshToken") || null,
    loading: false,
    profile: null,
    error: null,
}

console.log(initialState);

// Register
export const localregisterUser = createAsyncThunk(
    "auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.localregisterUser, formData);
            console.log("Response:", res);
            return res.data;
        } catch (err) {
            console.log("Response Error:", err);
            return rejectWithValue(err.response.data);
        }
    }
);

// verify mail
export const verifyMail = createAsyncThunk("auth/verifyMail", async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post(authApis.verifyMail, formData);
        console.log("VerificationMail Response:", res);
        return res.data;
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error.response.data);
    }
});

// login 
export const localloginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.localloginUser, formData);
            console.log("Login Response:", res);
            return res.data.data;
        } catch (error) {
            console.log("Response Error:", error);
            return rejectWithValue(error.response?.data?.message || "Login failed");
        }
    }
);

// logout 
export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const res = await api.post(authApis.logout);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data || "Logout failed.");
    }
});

export const refreshTokenApi = createAsyncThunk(
    "auth/refresh",
    async (_, { getState, rejectWithValue }) => {
        try {

            const { refreshToken } = getState().auth;
            const res = await api.post("auth/refresh", { refreshToken });
            localStorage.setItem("authData", JSON.stringify({
                ...getState().auth,
                accessToken: res.data.data.accessToken
            }));
            return res.data.data.accessToken;
        } catch (err) {
            return rejectWithValue("Session expired. Please login again.");
        }
    }
);




export const contactUs = createAsyncThunk("auth/contact", async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post(authApis.contact,formData);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response.data || "Contact failed.");
    }
});

export const userProfile = createAsyncThunk("auth/userProfile", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(authApis.userProfile);    
        return res.data;
    }
    catch (err) {
        return rejectWithValue(err.response.data || "Fetching profile failed.");
    }
});


export const updateProfile = createAsyncThunk("auth/updateProfile", async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post(authApis.updateProfile,formData,{
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });    
        return res.data;
    }
    catch (err) {
        return rejectWithValue(err.response.data || "Updating profile failed.");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {

        loadUser: (state) => {
            const saved = localStorage.getItem("authData");
            if (saved) {
                const parsed = JSON.parse(saved);
                state.user = parsed.user;
                state.accessToken = parsed.accessToken;
                state.refreshToken = parsed.refreshToken;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            // Register
            .addCase(localregisterUser.pending, (state) => { state.loading = true; })
            .addCase(localregisterUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // state.user = action.payload?.data;
            })
            .addCase(localregisterUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Register failed";
            })

            .addCase(verifyMail.pending, (state) => { state.loading = true; })
            .addCase(verifyMail.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(verifyMail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Mail Verification failed";
            })

            // pending
            .addCase(localloginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            // fulfilled
            .addCase(localloginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.user = action.payload.user;
                // state.accessToken = action.payload.accessToken;
                // state.refreshToken = action.payload.refreshToken;
                localStorage.setItem("user", JSON.stringify(state.user));
                localStorage.setItem("accessToken", JSON.stringify(action.payload.accessToken));

            })
            // rejected
            .addCase(localloginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(logoutUser.fulfilled, (state, action) => {
                state.user = null;
                localStorage.removeItem("user");
                localStorage.removeItem("accessToken");
                state.error = action.payload?.message;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(refreshTokenApi.fulfilled, (state, action) => {
                state.accessToken = action.payload;
            })

            .addCase(contactUs.pending, (state) => { state.loading = true; })
            .addCase(contactUs.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                // state.user = action.payload?.data;
            })
            .addCase(contactUs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Contact failed";
            })


            .addCase(userProfile.pending, (state) => { state.loading = true; })
            .addCase(userProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.profile = action.payload?.data;
                
            })
            .addCase(userProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Fetching profile failed.";
            })

            .addCase(updateProfile.pending, (state) => { state.loading = true; })
            .addCase(updateProfile.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.profile = action.payload?.data;
                state.user = action.payload?.data;
                localStorage.setItem("user", JSON.stringify(state.profile));

            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message || "Updating profile failed.";
            });

    }
});

export const { logout, loadUser } = authSlice.actions;
export default authSlice.reducer;
