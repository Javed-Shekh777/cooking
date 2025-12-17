import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import api from "../utils/axios";
import { adminApis, chefApis, recipeApis } from "../constans/ApisUtils";
// const initialState = {
//     suggestTags: [],
//     categories: [],
//     recipes: [],
//     recipeCategory: [],
//     recipe: {},
//     dashboardData: null,
//     loading: false,
//     error: null,
//     category: null
// };

const initialState = {
    suggestTags: [],
    categories: [],
    recipes: [],
    recipeCategory: [],
    recipe: {},
    recipeMeta: {
        isLiked: false,
        isSaved: false,
        likesCount: 0,
        savesCount: 0,
        viewsCount: 0,
        sharesCount: 0,
    },
    dashboardData: null,
    loading: false,
    error: null,
    category: null,
    comments: [],
    recommendRecipes: [],
    requests: [],
    auditLog:[]

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


export const getCategories = createAsyncThunk("recipe/getCategories", async (_, { rejectWithValue }) => {
    try {

        const res = await api.get(recipeApis.getCategories);
        console.log("Response:", res.data);
        return res.data.data; // ✅ sirf array of category chahiye
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to load Category");
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
        return res.data.data; // ✅ sirf array of recipes chahiye
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to load Category");
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


            console.log("Recommendations Response:", res.data);
            return res.data.data; // केवल डेटा एरे वापस करें

        } catch (error) {
            console.error("Response Error:", error);
            return rejectWithValue(error?.response?.data || "Failed to fetch recommendations");
        }
    }
);



export const getRecipesCategory = createAsyncThunk("recipe/getRecipesCategory", async (id, { rejectWithValue }) => {
    try {
        const res = await api.get(`${recipeApis.getRecipesByCategory}/${id}`);
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


export const getCategory = createAsyncThunk(
    "recipe/getCategory",
    async (id, { rejectWithValue }) => {

        try {

            console.log(`${recipeApis.getCategory}/${id}`)
            const res = await api.get(`${recipeApis.getCategory}/${id}`); // ✅ id inject hua
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


export const updateCategory = createAsyncThunk("recipe/updateCategory", async ({ id, formData }, { rejectWithValue }) => {
    try {
        const url = `${recipeApis.updateCategory}/${id}`;
        const res = await api.post(url, formData, {
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

export const recipeLikeDish = createAsyncThunk("recipe/recipeLikeDish", async (recipeId, { rejectWithValue }) => {
    try {
        console.log(recipeId)
        const res = await api.post(recipeApis.recipeLikeDish, { recipeId: recipeId });
        console.log("Response:", res.data);
        return res.data; // ✅ sirf array of recipes chahiye
    }
    catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to like dish");
    }
});

export const recipeView = createAsyncThunk("recipe/recipeView", async (recipeId, { rejectWithValue }) => {
    try {
        const res = await api.post(recipeApis.recipeView, { recipeId: recipeId });
        console.log("Response:", res.data);
        return res.data; // ✅ sirf array of recipes chahiye
    }
    catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to view dish");
    }
});

export const recipeSave = createAsyncThunk("recipe/recipeSave", async (recipeId, { rejectWithValue }) => {
    try {
        const res = await api.post(recipeApis.recipeSave, { recipeId: recipeId });
        console.log("Response:", res.data);
        return res.data; // ✅ sirf array of recipes chahiye
    }
    catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to save dish");
    }
});


export const recipeShare = createAsyncThunk("recipe/recipeShare", async (recipeId, { rejectWithValue }) => {
    try {
        const res = await api.post(recipeApis.recipeShare, { recipeId: recipeId });
        console.log("Response:", res.data);
        return res.data; // ✅ sirf array of recipes chahiye
    }
    catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to share dish");
    }
});


export const submitRating = createAsyncThunk("recipe/submitRating", async (data, { rejectWithValue }) => {
    try {
        console.log(data);
        const res = await api.post(recipeApis.submitRecipeRating, data);
        return res.data.data;
    } catch (error) {
        return rejectWithValue(error?.response?.data || "Failed to submit rating");
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
        return res.data; // यह सर्वर से successResponse का पूरा ऑब्जेक्ट होगा
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Failed to add comment/reply");
    }
});

export const deleteComment = createAsyncThunk(
    "recipe/deleteComment",
    async (data, { rejectWithValue }) => {
        try {
            console.log("Delete Data: ", data);

            const res = await api.delete(recipeApis.deleteComment, {
                data: data,  // <-- Yaha body send hoti hai
            });

            console.log("Delete Response:", res.data);

            return res.data;
        } catch (error) {
            console.log("Delete Error:", error);
            return rejectWithValue(
                error?.response?.data || "Failed to delete comment/reply"
            );
        }
    }
);


export const getComments = createAsyncThunk("recipe/getComments", async (recipeId, { rejectWithValue }) => {
    try {
        const url = `${recipeApis.getComments}/${recipeId}`;

        const res = await api.get(url);
        console.log("Response:", res.data);
        return res.data;
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to fetch comments");
    }
});

export const toggleCommentLike = createAsyncThunk("recipe/toggleCommentLike", async (commentId, { rejectWithValue }) => {
    try {
        const url = `${recipeApis.toggleCommentLike}/${commentId}`;

        const res = await api.post(url);
        console.log("Response:", res.data);
        return res.data; // ✅ sirf array of recipes chahiye
    } catch (error) {
        console.log("Response Error:", error);
        return rejectWithValue(error?.response?.data || "Falied to share dish");
    }
});




// Chef → Request delete
export const requestDelete = createAsyncThunk(
    "deleteRequest/requestDelete",
    async ({ id, itemType, reason }, { rejectWithValue }) => {
        try {
            const res = await api.post(chefApis.deleteReq, { id, itemType, reason });
            return res.data;
        } catch (err) {
            console.log(err);
            return rejectWithValue(err.response?.data || "Delete request failed");
        }
    }
);

// Admin → Fetch requests
export const fetchDeleteRequests = createAsyncThunk(
    "deleteRequest/fetchAll",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(adminApis.getDeleteReq);
            console.log(res.data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
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
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
        }
    }
);

export const fetchAuditLogs = createAsyncThunk(
    "deleteRequest/fetchAuditLogs",
    async (_, { rejectWithValue }) => {
        try {
            const res = await api.get(adminApis.auditLog);
            console.log(res.data);
            return res.data;
        } catch (err) {
            return rejectWithValue(err.response?.data);
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

            .addCase(fetchRecommendations.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(fetchRecommendations.fulfilled, (state, action) => {
                state.loading = false;
                console.log("Recocoem: ", action.payload);
                state.recommendRecipes = action.payload; // ✅ yahan array set ho raha
            })
            .addCase(fetchRecommendations.rejected, (state, action) => {
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

            .addCase(updateCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(updateCategory.fulfilled, (state, action) => {
                state.loading = false;
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
            })
            .addCase(updateCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(getRecipe.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecipe.fulfilled, (state, action) => {
                state.loading = false;
                console.log("payload: ", action.payload);

                state.recipe = action.payload.recipe;   // ✅ actual recipe data
                state.recipeMeta = action.payload.meta; // ✅ meta info (likes, saves, counts)
            })

            .addCase(getRecipe.rejected, (state, action) => {
                state.loading = false;
                console.log("payload: ", action.payload);

                state.error = action.payload;
            })


            .addCase(getRecipesCategory.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(getRecipesCategory.fulfilled, (state, action) => {
                state.loading = false;
                state.recipeCategory = action.payload; // ✅ yahan array set ho raha
            })
            .addCase(getRecipesCategory.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            //  .addCase(getCategory.pending, (state) => {
            //     state.loading = true;
            //     state.error = null;
            // })
            .addCase(getCategory.fulfilled, (state, action) => {
                state.loading = false;
                console.log("payload: ", action.payload);
                state.category = action.payload; // ✅ yahan array set ho raha
            })
            .addCase(getCategory.rejected, (state, action) => {
                state.loading = false;
                console.log("payload: ", action.payload);

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


            // commentsSlice.js (extraReducers)

            .addCase(addComment.fulfilled, (state, action) => {
                const newOrUpdatedComment = action.payload.data;

                if (newOrUpdatedComment.replies && newOrUpdatedComment.replies.length > 0) {
                    const index = state.comments.findIndex(c => c._id === newOrUpdatedComment._id);
                    if (index !== -1) {
                        state.comments[index] = newOrUpdatedComment;
                    }
                } else {
                    state.comments.unshift(newOrUpdatedComment);
                }
            })

            .addCase(deleteComment.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(deleteComment.fulfilled, (state, action) => {
                state.loading = false;

                const { deletedId, commentId } = action.payload.data;

                // -----------------------------------------
                // CASE 1: Delete Main Comment
                // -----------------------------------------
                if (!commentId) {
                    state.comments = state.comments.filter(
                        (c) => c._id !== deletedId
                    );
                    return;
                }

                // -----------------------------------------
                // CASE 2: Delete Reply
                // -----------------------------------------
                state.comments = state.comments.map((comment) => {
                    if (comment._id === commentId) {
                        return {
                            ...comment,
                            replies: comment.replies.filter(
                                (reply) => reply._id !== deletedId
                            )
                        };
                    }
                    return comment;
                });
            })
            .addCase(deleteComment.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(toggleCommentLike.fulfilled, (state, action) => {
                const { commentId, updatedLikesArray } = action.payload.data;

                const commentIndex = state.comments.findIndex(c => c._id === commentId);

                if (commentIndex !== -1) {
                    state.comments[commentIndex].likes = updatedLikesArray;

                    state.comments[commentIndex].likesCount = updatedLikesArray.length;
                }
            })
            .addCase(getComments.pending, (state) => {
                state.commentsLoading = true;
                state.commentsError = null;
            })

            .addCase(getComments.fulfilled, (state, action) => {
                state.commentsLoading = false;
                state.comments = action.payload.data;
            })

            .addCase(getComments.rejected, (state, action) => {
                state.commentsLoading = false;
                state.commentsError = action.payload || "Failed to fetch comments";
                state.comments = []; // त्रुटि होने पर एरे खाली कर दें
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
                state.loading = false;

                if (action.payload?.success) {
                    state.recipeMeta.isLiked = action.payload.data.isLiked;
                    state.recipeMeta.likesCount = action.payload.data.likesCount;
                }
            })
            .addCase(recipeLikeDish.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // ⭐ SAVE
            .addCase(recipeSave.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(recipeSave.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload?.success) {
                    state.recipeMeta.isSaved = action.payload.data.isSaved;
                    state.recipeMeta.savesCount = action.payload.data.savesCount;
                }
            })
            .addCase(recipeSave.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // ⭐ SHARE
            .addCase(recipeShare.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(recipeShare.fulfilled, (state, action) => {
                state.loading = false;

                if (action.payload?.success) {
                    state.recipeMeta.sharesCount = action.payload.data.sharesCount;
                }
            })
            .addCase(recipeShare.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })


            // ⭐ VIEW (No meta update needed)
            .addCase(recipeView.pending, (state) => {
                state.loading = true;
                state.error = null;
            })
            .addCase(recipeView.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(recipeView.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            // recipeSlice.js (extraReducers)

            .addCase(submitRating.fulfilled, (state, action) => {
                state.loading = false;
                const { avgRating, totalRatings, submittedRating } = action.payload;

                if (state.recipe && state.recipe._id === action.meta.arg.recipeId) {
                    state.recipe.avgRating = avgRating;
                    state.recipe.totalRatings = totalRatings;
                }

                state.recipeMeta.userRating = submittedRating;
            })




            .addCase(requestDelete.pending, (state) => {
                state.loading = true;
            })
            .addCase(requestDelete.fulfilled, (state) => {
                state.loading = false;
            })
            .addCase(requestDelete.rejected, (state, action) => {
                state.loading = false;
                state.error = action.payload;
            })

            .addCase(fetchDeleteRequests.fulfilled, (state, action) => {
                state.requests = action.payload.data;
            })

            .addCase(updateDeleteRequestStatus.fulfilled, (state, action) => {
                state.requests = state.requests.map((req) =>
                    req._id === action.payload.data._id ? action.payload.data : req
                );
            })


              .addCase(fetchAuditLogs.fulfilled, (state, action) => {
                state.auditLog = action.payload.data;
            })


    },
});

export const { clearSuggestTag } = recipeSlice.actions;

export default recipeSlice.reducer;
