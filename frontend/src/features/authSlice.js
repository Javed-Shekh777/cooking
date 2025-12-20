import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../utils/axios";
import { authApis } from "../constans/ApisUtils";
import { clearAccessToken, setAccessToken } from "../services/tokenService";


// const initialState = {
//     user: JSON.parse(localStorage.getItem("user") || null) || null,
//     // accessToken: localStorage.getItem("refreshToken") || null,
//     loading: false,
//     profile: null,
//     error: null,
// }

const initialState = {
    user: null,
    accessToken: null,
    loading: false,
    profile: null,
    authChecked: false,
    error: null,
    emailChangeSuccess: true,
    otpSent: false,
};


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



export const localloginUser = createAsyncThunk(
    "auth/loginUser",
    async (formData, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.localloginUser, formData);
            console.log("Login Response:", res);

            return res.data.data; // { accessToken, user }
        } catch (error) {
            console.log("Response Error:", error);

            return rejectWithValue(
                error.response?.data?.message || "Login failed"
            );
        }
    }
);


// logout 
export const logoutUser = createAsyncThunk("auth/logout", async (_, { rejectWithValue }) => {
    try {
        const res = await api.post(authApis.logout);
        return res.data;
    } catch (err) {
        return rejectWithValue(err.response?.data?.message || "Logout failed.");
    }
});



export const refreshTokenApi = createAsyncThunk(
    "auth/refresh",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.post(authApis.refreshToken);
            return res.data.data; // { accessToken, user }
        } catch (err) {
            return rejectWithValue("Session expired. Please login again.");
        }
    }
);




export const contactUs = createAsyncThunk("auth/contact", async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post(authApis.contact, formData);
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
        const res = await api.post(authApis.updateProfile, formData, {
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


export const mailChangeReq = createAsyncThunk("auth/mailChangeReq", async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post(authApis.mailChangeReq, formData);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(err.response.data || "Mail send failed.");
    }
});


export const mailChange = createAsyncThunk("auth/mailChange", async (formData, { rejectWithValue }) => {
    try {
        const res = await api.post(authApis.mailChange, formData);
        return res.data;
    }
    catch (err) {
        return rejectWithValue(err.response.data || "Email changed failed.");
    }
});

const authSlice = createSlice({
    name: "auth",
    initialState,
    reducers: {
 clearOtpState: (state) => {
    state.otpSent = false;
    state.emailChangeSuccess = false;
    state.error = null;
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
            // LOGIN
            .addCase(localloginUser.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(localloginUser.fulfilled, (state, action) => {
                state.loading = false;
                state.authChecked = true;
                state.user = action.payload.user;
                console.log("djsfdjsfsdkf sdfsdfils fsfsgfd", action.payload);
                state.accessToken = action.payload.accessToken;
                setAccessToken(action.payload.accessToken);
            })


            .addCase(refreshTokenApi.pending, (state) => {
                state.loading = true;
            })

            .addCase(refreshTokenApi.fulfilled, (state, action) => {
                state.loading = false;
                state.authChecked = true;
                state.user = action.payload.user;
                state.accessToken = action.payload.accessToken;
                setAccessToken(action.payload.accessToken);
            })

            .addCase(refreshTokenApi.rejected, (state) => {
                state.loading = false;
                state.authChecked = true; // 👈 even on failure
                state.user = null;
                state.accessToken = null;
            })


            // LOGOUT
            .addCase(logoutUser.fulfilled, (state) => {
                state.user = null;
                state.accessToken = null;
                clearAccessToken();
            })
            .addCase(logoutUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
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
            })



            .addCase(mailChangeReq.pending, (state) => {
                state.loading = true;
                state.error = null;
                state.otpSent = false;
            })

            .addCase(mailChangeReq.fulfilled, (state, action) => {
                state.loading = false;
                state.otpSent = true;       // 👈 OTP modal open
                state.error = null;
            })

            .addCase(mailChangeReq.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
                state.otpSent = false;
            })


            // ===============================
            // EMAIL CHANGE VERIFY (OTP VERIFY)
            // ===============================

            .addCase(mailChange.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(mailChange.fulfilled, (state, action) => {
                state.loading = false;
                state.emailChangeSuccess = true;
                state.otpSent = false;
                state.user = action.payload.data;
                state.error = null;
            })

            .addCase(mailChange.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            });



    }
});

export const { logout, loadUser,clearOtpState } = authSlice.actions;
export default authSlice.reducer;
