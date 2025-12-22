// commentsController.js
const { errorResponse, successResponse } = require("../util/response");
const Recipe = require("../models/recipe.model");
const RecipeComment = require("../models/comment.model");

// Recursive helper to build tree
const buildCommentTree = (comments, parentId = null) => {
  return comments
    .filter(c => String(c.parentId) === String(parentId)) // top-level if parentId=null
    .map(c => ({
      ...c,
      replies: buildCommentTree(
        comments.filter(r => !r.isDeleted), // filter out deleted replies
        c._id
      )
    }));
};

exports.getComments = async (req, res, next) => {
  try {
    const recipeId = req.params.id || req.query.id || req.body.id;

    if (!recipeId) {
      return errorResponse(res, "Recipe ID is required", 400);
    }

    const flatComments = await RecipeComment.find({
      recipeId
    })
      .populate("user", "username profileImage")
      .lean();

    // ✅ Only include comments/replies which are not deleted
    const activeComments = flatComments.filter(c => !c.isDeleted);

    const commentsTree = buildCommentTree(activeComments);

    return successResponse(res, "Comments fetched", commentsTree);

  } catch (error) {
    console.error(error);
    next(error);
  }
};





exports.addComment = async (req, res, next) => {
  try {
    const { recipeId, text, } = req.body;
    let { parentId = null } = req.body;
    const userId = req.user._id;

    if (!recipeId || !text?.trim()) {
      return errorResponse(res, "RecipeId & text are required", 400);
    }

    const recipe = await Recipe.findById(recipeId);
    if (!recipe) {
      return errorResponse(res, "Recipe not found", 404);
    }

    // sanitize parentId 

    if (!parentId || parentId === "null" || parentId === "") {
      parentId = null;
    } else {
      const parentExists = await RecipeComment.exists({ _id: parentId, isDeleted: false });
      if (!parentExists) {
        return errorResponse(res, "Parent comment not found", 404);
      }
    }

    // ========================
    // 💬 ADD MAIN COMMENT
    // ========================
    const newComment = await RecipeComment.create({
      recipeId,
      user: userId,
      text: text.trim(),
      parentId
    });

    await newComment.populate("user", "username profileImage");

    if (!parentId) {
      await Recipe.findByIdAndUpdate(recipeId, {
        $inc: { commentsCount: 1 }
      });
    }

    return successResponse(
      res,
      parentId ? "Reply added successfully" : "Comment added successfully",
      newComment
    );


  } catch (error) {
    console.log(error);
    next(error);

    // return errorResponse(res, "Failed to add comment/reply", 500);
  }
};

exports.toggleCommentLike = async (req, res, next) => {
  try {
    const { commentId } = req.body;   // replyId ki zarurat hi nahi
    const userId = req.user._id;

    console.log(commentId);
    if (!commentId) {
      return errorResponse(res, "Comment ID is required", 400);
    }

    const comment = await RecipeComment.findOne({
      _id: commentId,
      isDeleted: false
    });

    if (!comment) {
      return errorResponse(res, "Comment not found", 404);
    }

    const likeIndex = comment.likes.findIndex(
      id => id.toString() === userId.toString()
    );

    let isLiked;

    if (likeIndex > -1) {
      comment.likes.splice(likeIndex, 1);
      isLiked = false;
    } else {
      comment.likes.push(userId);
      isLiked = true;
    }

    await comment.save();

    return successResponse(res, "Like updated", {
      target: comment.parentId ? "REPLY" : "COMMENT",
      commentId: comment._id,
      parentId: comment.parentId,
      isLiked,
      likesCount: comment.likes?.length,
      userId
    });

  } catch (error) {
    console.error(error);
    next(error);
  }
};



exports.deleteComment = async (req, res, next) => {
  try {
    const { commentId } = req.body;
    const userId = req.user._id;

    if (!commentId) {
      return errorResponse(res, "Comment ID required", 400);
    }

    const comment = await RecipeComment.findById(commentId);
    if (!comment) {
      return errorResponse(res, "Comment not found", 404);
    }

    // mark this comment deleted
    await RecipeComment.findByIdAndUpdate(commentId, {
      isDeleted: true,
      deletedAt: new Date(),
      deletedBy: userId
    });

    // delete only its children (not parent)
    const deleteChildren = async (id) => {
      const replies = await RecipeComment.find({ parentId: id });
      for (const r of replies) {
        await RecipeComment.findByIdAndUpdate(r._id, {
          isDeleted: true,
          deletedAt: new Date(),
          deletedBy: userId
        });
        await deleteChildren(r._id); // recursion downward only
      }
    };

    await deleteChildren(commentId);

    // decrement count only if top-level comment
    if (!comment.parentId) {
      await Recipe.findByIdAndUpdate(comment.recipeId, {
        $inc: { commentsCount: -1 }
      });
    }

    return successResponse(res, "Comment deleted", { deletedId: commentId });

  } catch (error) {
    console.error(error);
    next(error);
  }
};



// exports.deleteComment = async (req, res, next) => {
//   try {
//     const { commentId } = req.body;
//     const userId = req.user._id;

//     if (!commentId) {
//       return errorResponse(res, "Comment ID required", 400);
//     }

//     const comment = await RecipeComment.findById(commentId);
//     if (!comment) {
//       return errorResponse(res, "Comment not found", 404);
//     }

//     // 🔁 Recursive delete (works for comment & reply both)
//     const markDeletedRecursively = async (id) => {
//       await RecipeComment.findByIdAndUpdate(id, {
//         isDeleted: true,
//         deletedAt: new Date(),
//         deletedBy: userId
//       });

//       const replies = await RecipeComment.find({ parentId: id });
//       for (const r of replies) {
//         await markDeletedRecursively(r._id);
//       }
//     };

//     await markDeletedRecursively(commentId);

//     // only main comment affects count
//     if (!comment.parentId) {
//       await Recipe.findByIdAndUpdate(comment.recipeId, {
//         $inc: { commentsCount: -1 }
//       });
//     }

//     return successResponse(res, "Comment deleted", {
//       deletedId: commentId
//     });

//   } catch (error) {
//     console.error(error);
//     next(error);
//   }
// };


