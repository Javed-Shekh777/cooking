import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../utils/axios";
import { adminApis, chefApis, recipeApis } from "../constans/ApisUtils";
import { removeCommentRecursively, insertReplyRecursively } from "../services/features";





const initialState = {
    suggestTags: [],
    recipes: [],
    recipeCategory: [],
    recipe: {},
    recipeMeta: {
        likesCount: 0,
        savesCount: 0,
        viewsCount: 0,
        sharesCount: 0,
    },
    dashboardData: null,
    loading: false,
    error: null,
    comments: [],
    recommendRecipes: [],
    requests: [],
    auditLog: []

};


export const suggestTags = createAsyncThunk(
    "recipe/suggestTags",
    async (q, { rejectWithValue }) => {
        try {
            const res = await api.get(`${recipeApis.suggestTag}?search=${q}`);
            console.log("Response:", res.data);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "failed to load";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
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
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
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
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
})




export const getRecipes = createAsyncThunk("recipe/getRecipes", async ({ categoryId = null, isPublished = null }, { rejectWithValue }) => {
    try {
        const url = categoryId
            ? `${recipeApis.getRecipes}?categoryId=${categoryId}&isPublished=${isPublished}`
            : `${recipeApis.getRecipes}?isPublished=${isPublished}`;
        console.log("URL:", url);
        console.log("fksdfndsfdsf")

        const res = await api.get(url);
        console.log(api);
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
})

export const fetchRecommendations = createAsyncThunk(
    "recipe/fetchRecommendations",
    async ({ recipeId, categoryId, limit }, { rejectWithValue }) => {
        try {
            console.log("Indide")
            const params = new URLSearchParams();
            if (recipeId) params.append('recipeId', recipeId);
            if (limit) params.append('limit', limit);

            if (categoryId) params.append('categoryId', categoryId);


            const url = `${recipeApis.getRecommendedRecipes}?${params.toString()}`;
            console.log(url, params);

            const res = await api.get(url);


            console.log("Response:", res.data);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "failed to load";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);



export const getRecipesCategory = createAsyncThunk("recipe/getRecipesCategory", async (id, { rejectWithValue }) => {
    try {
        const res = await api.get(`${recipeApis.getRecipesByCategory}/${id}`);
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
})


export const getRecipe = createAsyncThunk(
    "recipe/getRecipe",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`${recipeApis.getRecipe}/${id}`); // ✅ id inject hua
            console.log("Response:", res.data);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "failed to load";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);



export const dashboard = createAsyncThunk(
    "recipe/dashboard",
    async (id, { rejectWithValue }) => {
        try {
            const res = await api.get(`${recipeApis.dashboard}`);
            console.log("Response:", res.data);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "failed to load";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

export const recipeLikeDish = createAsyncThunk("recipe/recipeLikeDish", async (recipeId, { rejectWithValue }) => {
    try {
        console.log(recipeId)
        const res = await api.post(recipeApis.recipeLikeDish, { recipeId: recipeId });
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
});

export const recipeView = createAsyncThunk("recipe/recipeView", async (recipeId, { rejectWithValue }) => {
    try {
        const res = await api.post(recipeApis.recipeView, { recipeId: recipeId });
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
});

export const recipeSave = createAsyncThunk("recipe/recipeSave", async (recipeId, { rejectWithValue }) => {
    try {
        const res = await api.post(recipeApis.recipeSave, { recipeId: recipeId });
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
});


export const recipeShare = createAsyncThunk("recipe/recipeShare", async (recipeId, { rejectWithValue }) => {
    try {
        const res = await api.post(recipeApis.recipeShare, { recipeId: recipeId });
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
});


export const submitRating = createAsyncThunk("recipe/submitRating", async (data, { rejectWithValue }) => {
    try {
        console.log(data);
        const res = await api.post(recipeApis.submitRecipeRating, data);
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
});


// ✅ 'addComemnt' को 'addComment' में बदलें
export const addComment = createAsyncThunk("recipe/addComment", async (data, { rejectWithValue }) => {
    try {
        console.log("Data: ", data);
        const url = `${recipeApis.addComment}/${data?.recipeId}`;
        console.log(url);
        const res = await api.post(url, data);
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
});

export const deleteComment = createAsyncThunk(
    "recipe/deleteComment",
    async (commentId, { rejectWithValue }) => {
        try {
            console.log("Delete Data: ", commentId);
            const res = await api.delete(recipeApis.deleteComment, {
                data: { commentId }
            });


            console.log("Response:", res.data);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "failed to load";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);


export const getComments = createAsyncThunk("recipe/getComments", async (recipeId, { rejectWithValue }) => {
    try {
        const url = `${recipeApis.getComments}/${recipeId}`;

        const res = await api.get(url);
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
});

export const toggleCommentLike = createAsyncThunk("recipe/toggleCommentLike", async (commentId, { rejectWithValue }) => {
    try {

        const res = await api.post(recipeApis.toggleCommentLike, { commentId });
        console.log("Response:", res.data);
        return { data: res.data.data, message: res.data.message };
    } catch (err) {
        console.log("Error", err);
        const backendMessage = err.response?.data?.message || err.message || "failed to load";
        return rejectWithValue({ message: backendMessage, data: err.response?.data });
    }
});




// Chef → Request delete
export const requestDelete = createAsyncThunk(
    "deleteRequest/requestDelete",
    async ({ id, itemType, reason }, { rejectWithValue }) => {
        try {
            const res = await api.post(chefApis.createReq, { id, itemType, reason });
            console.log("Response:", res.data);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "failed to load";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

// Admin → Fetch requests
export const fetchDeleteRequests = createAsyncThunk(
    "deleteRequest/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(adminApis.getDeleteReq);
            console.log("Response:", res.data);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "failed to load";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

// Admin → Approve / Reject
export const updateDeleteRequestStatus = createAsyncThunk(
    "deleteRequest/updateStatus",
    async ({ requestId, status }, { rejectWithValue }) => {
        try {
            const res = await api.patch(`${adminApis.updateDeleteReq}/${requestId}`, {
                status // APPROVED | REJECTED
            });
            console.log("Response:", res.data);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "failed to load";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);

export const fetchAuditLogs = createAsyncThunk(
    "deleteRequest/fetchAuditLogs",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(adminApis.auditLog);
            console.log("Response:", res.data);
            return { data: res.data.data, message: res.data.message };
        } catch (err) {
            console.log("Error", err);
            const backendMessage = err.response?.data?.message || err.message || "failed to load";
            return rejectWithValue({ message: backendMessage, data: err.response?.data });
        }
    }
);



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
                state.error = null;
                state.suggestTags = action.payload.data; // ✅ yahan array set ho raha
            })
            .addCase(suggestTags.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })


            .addCase(getRecipes.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecipes.fulfilled, (state, action) => {
                state.loading = false;
                state.recipes = action.payload.data; // ✅ yahan array set ho raha
                state.error = null;
            })
            .addCase(getRecipes.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })

            .addCase(fetchRecommendations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Recocoem: ", action.payload);
                state.error = null;

                state.recommendRecipes = action.payload.data; // ✅ yahan array set ho raha
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })

            .addCase(addRecipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(addRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                state.recipes.push(action.payload?.data);// ✅ yahan array set ho raha
            })
            .addCase(addRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })

            .addCase(updateRecipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.recipes.push(action.payload?.data);// ✅ yahan array set ho raha
            })
            .addCase(updateRecipe.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })


            .addCase(getRecipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecipe.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                console.log("payload: ", action.payload.data);

                state.recipe = action.payload.data.recipe;   // ✅ actual recipe data
                state.recipeMeta = action.payload.data.meta; // ✅ meta info (likes, saves, counts)
            })

            .addCase(getRecipe.rejected, (state, action) => {
                state.loading = false;
                console.log("payload: ", action.payload);

                state.error = action.payload?.message;

            })


            .addCase(getRecipesCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecipesCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.recipeCategory = action.payload.data; // ✅ yahan array set ho raha
            })
            .addCase(getRecipesCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })





            .addCase(dashboard.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(dashboard.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;
                state.dashboardData = action.payload.data; // ✅ yahan array set ho raha
            })
            .addCase(dashboard.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })


            // commentsSlice.js (extraReducers)

            .addCase(addComment.fulfilled, (state, action) => {
                const newComment = action.payload.data;
                state.loading = false;
                state.error = null;

                // 🟢 TOP LEVEL COMMENT
                if (!newComment.parentId) {
                    state.comments.unshift({ ...newComment, replies: [] });
                    return;
                }

                // 🔵 REPLY (any depth)
                insertReplyRecursively(state.comments, newComment);
            })



            .addCase(deleteComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })

            .addCase(deleteComment.fulfilled, (state, action) => {
                state.loading = false;
                state.error = null;

                const { deletedId } = action.payload.data;
                state.comments = removeCommentRecursively(state.comments, deletedId);
            })

            .addCase(deleteComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;
            })

            .addCase(toggleCommentLike.fulfilled, (state, action) => {
                const { commentId, isLiked, likesCount, userId } = action.payload.data;
                const updateLikeRecursively = (comments) => {
                    for (const comment of comments) {
                        if (comment._id === commentId) {
                            if (isLiked) {
                                comment.likes.push(userId);
                            } else {
                                comment.likes = comment.likes.filter(
                                    id => id !== userId
                                );
                            }
                            comment.likesCount = likesCount;
                            return true;
                        }

                        if (comment.replies?.length) {
                            if (updateLikeRecursively(comment.replies)) return true;
                        }
                    }
                    return false;
                };


                updateLikeRecursively(state.comments);
                state.loading = false;
                state.error = null;
            })


            .addCase(getComments.pending, (state) => {
                state.commentsLoading = true;
                state.commentsError = null;
            })

            .addCase(getComments.fulfilled, (state, action) => {
                state.commentsLoading = false;
                state.comments = action.payload.data; // already tree
                state.loading = false;
                state.error = null;
            })

            .addCase(getComments.rejected, (state, action) => {
                state.comments = [];
                state.commentsLoading = false;
                state.commentsError = action.payload?.message;
            })


            // ===========================
            // FIXED REDUCER
            // ===========================

            // ⭐ LIKE
            .addCase(recipeLikeDish.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(recipeLikeDish.fulfilled, (state, action) => {


                state.recipeMeta.likesCount = action.payload.data.likesCount;
                state.loading = false;
                state.error = null;
            })
            .addCase(recipeLikeDish.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })


            // ⭐ SAVE
            .addCase(recipeSave.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(recipeSave.fulfilled, (state, action) => {

                state.recipeMeta.savesCount = action.payload.data.savesCount;
                state.loading = false;
                state.error = null;
            })
            .addCase(recipeSave.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })


            // ⭐ SHARE
            .addCase(recipeShare.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(recipeShare.fulfilled, (state, action) => {

                if (action.payload?.success) {
                    state.recipeMeta.sharesCount = action.payload.data.sharesCount;
                }
                state.loading = false;
                state.error = null;
            })
            .addCase(recipeShare.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })


            // ⭐ VIEW (No meta update needed)
            .addCase(recipeView.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(recipeView.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(recipeView.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })

            // recipeSlice.js (extraReducers)

            .addCase(submitRating.fulfilled, (state, action) => {

                const { avgRating, totalRatings, submittedRating } = action.payload.data;

                if (state.recipe && state.recipe._id === action.meta.arg.recipeId) {
                    state.recipe.avgRating = avgRating;
                    state.recipe.totalRatings = totalRatings;
                }

                state.recipeMeta.userRating = submittedRating;
                state.loading = false;
                state.error = null;
            })




            .addCase(requestDelete.pending, (state) => {
                state.loading = true;
            })
            .addCase(requestDelete.fulfilled, (state) => {
                state.loading = false;
                state.error = null;
            })
            .addCase(requestDelete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload?.message;

            })

            .addCase(fetchDeleteRequests.fulfilled, (state, action) => {
                state.requests = action.payload.data;
                state.loading = false;
                state.error = null;
            })

            .addCase(updateDeleteRequestStatus.fulfilled, (state, action) => {
                state.requests = state.requests.map((req) =>
                    req._id === action.payload.data._id ? action.payload.data : req
                );
                state.loading = false;
                state.error = null;
            })


            .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.auditLog = action.payload.data;
                state.loading = false;
                state.error = null;
            })


    },
});

export const { clearSuggestTag } = recipeSlice.actions;

export default recipeSlice.reducer;
