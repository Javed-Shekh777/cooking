import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import api from "../utils/axios";
import { authApis } from "../constans/ApisUtils";
import { clearAccessToken, setAccessToken } from "../services/tokenService";

const initialState = {
    user: null,
    accessToken: null,
    loading: false,
    authChecked: false,
    error: null,
    emailChangeSuccess: true,
    otpSent: false,
    profile: null,
};

console.log(initialState);

// ------------------- ASYNC THUNKS -------------------

// REGISTER
export const localregisterUser = createAsyncThunk(
    "auth/register",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.localregisterUser, formData);
            console.log("Res", res);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "Register failed";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

// VERIFY MAIL
export const verifyMail = createAsyncThunk(
    "auth/verifyMail",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.verifyMail, formData);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            const backendMessage = err.response?.data?.message || err.message || "Verification failed";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

// LOGIN
export const localloginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.localloginUser, formData);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            const backendMessage = err.response?.data?.message || err.message || "Login failed";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

// LOGOUT
export const logoutUser = createAsyncThunk(
    "auth/logout",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.logout);
            return res.data;
        } catch (err) {
            const backendMessage = err.response?.data?.message || err.message || "Logout failed";
            return rejectWithValue({ message: backendMessage });
        }
    }
);

// REFRESH TOKEN
export const refreshTokenApi = createAsyncThunk(
    "auth/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.refreshToken);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            return rejectWithValue({ message: "Session expired. Please login again." });
        }
    }
);

// CONTACT
export const contactUs = createAsyncThunk(
    "auth/contact",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.contact, formData);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            const backendMessage = err.response?.data?.message || err.message || "Contact failed.";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

// USER PROFILE
export const userProfile = createAsyncThunk(
    "auth/userProfile",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(authApis.userProfile);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            const backendMessage = err.response?.data?.message || err.message || "Fetching profile failed.";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

// UPDATE PROFILE
export const updateProfile = createAsyncThunk(
    "auth/updateProfile",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.updateProfile, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            const backendMessage = err.response?.data?.message || err.message || "Updating profile failed.";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

// EMAIL CHANGE REQUEST
export const mailChangeReq = createAsyncThunk(
    "auth/mailChangeReq",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.mailChangeReq, formData);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            const backendMessage = err.response?.data?.message || err.message || "Mail send failed.";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

// EMAIL CHANGE VERIFY (OTP)
export const mailChange = createAsyncThunk(
    "auth/mailChange",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.mailChange, formData);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            const backendMessage = err.response?.data?.message || err.message || "Email change failed.";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

// ------------------- SLICE -------------------
const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
        clearOtpState: (state) => {
            state.otpSent = false;
            state.emailChangeSuccess = false;
            state.error = null;
        },
        clearAuthError: (state) => {
            state.error = null;
        },
        logout: (state) => {
            state.user = null;
            state.authChecked = false;
            state.accessToken = null;
            clearAccessToken();
        },
    },
    extraReducers: (builder) => {
        builder
            // REGISTER
            .addCase(localregisterUser.pending, (state) => { state.loading = true; })
            .addCase(localregisterUser.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                console.log("action success", action.payload);

            })
            .addCase(localregisterUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
                console.log("action Error", action.payload);
            })

            // VERIFY MAIL
            .addCase(verifyMail.pending, (state) => { state.loading = true; })
            .addCase(verifyMail.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(verifyMail.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // LOGIN
            .addCase(localloginUser.pending, (state) => { state.loading = true; state.error = null; })
            .addCase(localloginUser.fulfilled, (state, action) => {

                state.authChecked = true;
                state.user = action.payload.data.user;
                state.accessToken = action.payload.data.accessToken;
                setAccessToken(state.accessToken);
                state.loading = false;
                state.error = null;
            })
            .addCase(localloginUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // REFRESH TOKEN
            .addCase(refreshTokenApi.fulfilled, (state, action) => {
                state.authChecked = true;
                state.user = action.payload.data.user;
                state.accessToken = action.payload.data.accessToken;
                setAccessToken(state.accessToken);
                state.loading = false;
                state.error = null;
            })
            .addCase(refreshTokenApi.rejected, (state, action) => {
                state.authChecked = true;
                state.user = null;
                state.accessToken = null;
                clearAccessToken();
            })

            // LOGOUT
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                clearAccessToken();
                state.loading = false;
                state.error = null;
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.error = action.payload?.message;
            })

            // CONTACT
            .addCase(contactUs.pending, (state) => { state.loading = true; })
            .addCase(contactUs.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(contactUs.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // USER PROFILE
            .addCase(userProfile.fulfilled, (state, action) => {

                state.profile = action.payload.data;
                state.loading = false;
                state.error = null;
            })

            // UPDATE PROFILE
            .addCase(updateProfile.fulfilled, (state, action) => {

                state.profile = action.payload.data;
                state.user = action.payload.data;
                localStorage.setItem("user", JSON.stringify(state.profile));
                state.loading = false;
                state.error = null;
            })
            .addCase(updateProfile.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            // EMAIL CHANGE
            .addCase(mailChangeReq.fulfilled, (state, action) => {

                state.otpSent = true;
                state.loading = false;
                state.error = null;
            })
            .addCase(mailChangeReq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            .addCase(mailChange.fulfilled, (state, action) => {
                state.emailChangeSuccess = true;
                state.otpSent = false;
                state.user = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(mailChange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            });
    },
});

export const { logout, clearOtpState, clearAuthError } = authSlice.actions;
export default authSlice.reducer;
