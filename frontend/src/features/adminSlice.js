import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import api from "../utils/axios";
import { adminApis, chefApis } from "../constans/ApisUtils";


const initialState = {
    users: [],
    recipes: [],
    categories: [],
    requests: [],
    auditLogs: [],
    dashboard: null,
    setting: null,
    adminLoading: false,
    adminError: null
};

export const getAdminDashboard = createAsyncThunk("admin/getAdminDashboard", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(adminApis.adminDashboard);
        return { data: res.data?.data, message: res?.data?.message };
    } catch (error) {
        const backendMessage = error.response?.data?.message || error.message || "Failed to load";
        return rejectWithValue({ message: backendMessage, data: error?.response?.data });
    }
});


export const getUsers = createAsyncThunk("admin/getUsers", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(adminApis.manageUsers);
        return { data: res.data?.data, message: res?.data?.message };
    } catch (error) {
        const backendMessage = error.response?.data?.message || error.message || "Failed to load";
        return rejectWithValue({ message: backendMessage, data: error?.response?.data });
    }
});

export const getAllRequests = createAsyncThunk("analytics/getAllRequests", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(chefApis.allRequests);
        return { data: res.data.data, message: res.data.message };

    } catch (error) {
        const backendMessage = error?.response?.data?.message || err.message || "Failed to load";
        return rejectWithValue({ message: backendMessage, data: error?.response?.data });
    }
})



export const getAuditLogs = createAsyncThunk("admin/getAuditLogs", async (_, { rejectWithValue }) => {
    try {
        const res = await api.get(adminApis.auditLog);
        return { data: res.data?.data, message: res?.data?.message };
    } catch (error) {
        const backendMessage = error.response?.data?.message || error.message || "Failed to load";
        return rejectWithValue({ message: backendMessage, data: error?.response?.data });
    }
});


export const rejectRequest = createAsyncThunk("admin/rejectRequest", async (id, { rejectWithValue }) => {
    try {
        const res = await api.post(`${adminApis.rejectReq}/${id}`);
        return { data: res.data?.data, message: res?.data?.message };
    } catch (error) {
        const backendMessage = error.response?.data?.message || error.message || "Failed to load";
        return rejectWithValue({ message: backendMessage, data: error?.response?.data });
    }
});


export const approveRequest = createAsyncThunk(
  "admin/approveRequest",
  async ({ id, type, approve = null }, { rejectWithValue }) => {
    try {
      let url;
      let res;

      if (type === "CATEGORY") {
        url = `${adminApis.categorySoftDel}/${id}`;
        res = await api.delete(url, { data: { approve } });
      } else if (type === "RECIPE") {
        url = `${adminApis.recipeSoftDel}/${id}`;
        res = await api.delete(url, { data: { approve } });
      } else if (["USER", "ADMIN", "CHEF"].includes(type)) {
        url = `${adminApis.chefApprove}/${id}`;
        res = await api.patch(url, { approve });
      }

      return { data: res.data?.data, message: res?.data?.message };
    } catch (error) {
      const backendMessage =
        error.response?.data?.message || error.message || "Failed to load";
      return rejectWithValue({
        message: backendMessage,
        data: error?.response?.data,
      });
    }
  }
);


export const blockUnblockUser = createAsyncThunk("admin/blockUnblockUser", async (id, { rejectWithValue }) => {
    try {
        const res = await api.post(`${adminApis.userBlockUnBlock}/${id}`);
        return { data: res.data?.data, message: res?.data?.message };
    } catch (error) {
        const backendMessage = error.response?.data?.message || error.message || "Failed to load";
        return rejectWithValue({ message: backendMessage, data: error?.response?.data });
    }
});


const adminSlice = createSlice({
    name: "admin",
    initialState,
    reducers: {

    },
    extraReducers: (builder) => {
        builder
            .addCase(getAdminDashboard.pending, (state, action) => {
                state.adminLoading = true;
                state.adminError = null;

            })
            .addCase(getAdminDashboard.fulfilled, (state, action) => {
                state.dashboard = action.payload.data;
                state.adminLoading = false;
                state.adminError = null;
            })
            .addCase(getAdminDashboard.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = action.payload?.message;
            })


            .addCase(getUsers.pending, (state, action) => {
                state.adminLoading = true;
                state.adminError = null;

            })
            .addCase(getUsers.fulfilled, (state, action) => {
                state.users = action.payload.data;
                state.adminLoading = false;
                state.adminError = null;
            })
            .addCase(getUsers.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = action.payload?.message;
            })

            .addCase(getAuditLogs.pending, (state, action) => {
                state.adminLoading = true;
                state.adminError = null;
            })
            .addCase(getAuditLogs.fulfilled, (state, action) => {
                state.auditLogs = action.payload.data;
                state.adminLoading = false;
                state.adminError = null;
            })
            .addCase(getAuditLogs.rejected, (state, action) => {
                state.adminLoading = false;
                state.adminError = action.payload?.message;
            })
            .addCase(getAllRequests.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(getAllRequests.fulfilled, (state, action) => {
                console.log(action.payload.data);
                state.requests = action.payload.data;
                state.loading = false;
                state.error = null;
            })
            .addCase(getAllRequests.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })


            .addCase(rejectRequest.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(rejectRequest.fulfilled, (state, action) => {
                console.log(action.payload.data);
                const { reqId, status } = action.payload.data;
                const reqIndex = state.requests?.findIndex(r => r._id === reqId);

                if (reqIndex !== -1 && reqIndex !== undefined) {
                    state.requests[reqIndex].status = status;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(rejectRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })


            .addCase(approveRequest.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(approveRequest.fulfilled, (state, action) => {
                console.log(action.payload.data);
                const { reqId, status } = action.payload.data;
                const reqIndex = state.requests?.findIndex(r => r._id === reqId);

                if (reqIndex !== -1 && reqIndex !== undefined) {
                    state.requests[reqIndex].status = status;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(approveRequest.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })



            .addCase(blockUnblockUser.pending, (state, action) => {
                state.loading = true;
            })
            .addCase(blockUnblockUser.fulfilled, (state, action) => {
                console.log(action.payload.data);
                const { userId, isBlocked } = action.payload.data;
                const userIndex = state.users?.findIndex(r => r._id === userId);

                if (userIndex !== -1 && userIndex !== undefined) {
                    state.users[userIndex].isBlocked = isBlocked;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(blockUnblockUser.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload.message;
            })



    },

});

export const { } = adminSlice.actions;
export default adminSlice.reducer;


