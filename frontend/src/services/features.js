// utils/timeAgo.js (आप इस फ़ाइल को इस नाम से सेव कर सकते हैं)

export const timeAgo = (dateString) => {
    const seconds = Math.floor((new Date() - new Date(dateString)) / 1000);

    let interval = seconds / 31536000;
    if (interval > 1) {
        return Math.floor(interval) + "y ago"; // Years ago
    }
    interval = seconds / 2592000;
    if (interval > 1) {
        return Math.floor(interval) + " mon ago"; // Months ago
    }
    interval = seconds / 86400;
    if (interval > 1) {
        return Math.floor(interval) + "d ago"; // Days ago
    }
    interval = seconds / 3600;
    if (interval > 1) {
        return Math.floor(interval) + "h ago"; // Hours ago
    }
    interval = seconds / 60;
    if (interval > 1) {
        return Math.floor(interval) + "m ago"; // Minutes ago
    }
    return Math.floor(seconds) + "s ago"; // Seconds ago
};


export const IsUserLikedRecipe = (recipe, userId) => {
    console.log(recipe.likes, recipe.saves, userId);

    const likedUserIds = recipe?.likes?.map(id => id.toString()) || [];
    const savedUserIds = recipe?.saves?.map(id => id.toString()) || [];
    console.log(likedUserIds, savedUserIds);

    const isLiked = likedUserIds.includes(userId?.toString()) || false;
    const isSaved = savedUserIds.includes(userId?.toString()) || false;
    console.log(isLiked, isSaved);

    return { isLiked, isSaved };
}

export const findReplyUser = (targetId, comments) => {
    if (!targetId || !comments?.length) return null;

    for (const comment of comments) {
        // 🟢 Case 1: ID comment ki hai
        if (comment._id === targetId) {
            return comment.user?.username || null;
        }

        // 🟡 Case 2: replies ke andar search
        if (comment.replies?.length) {
            const found = findReplyUser(targetId, comment.replies);
            if (found) return found;
        }
    }

    return null;
};


export const removeCommentRecursively = (comments, deletedId) => {
    return comments
        .filter(c => c._id !== deletedId)
        .map(c => ({
            ...c,
            replies: c.replies
                ? removeCommentRecursively(c.replies, deletedId)
                : []
        }));
};




export const insertReplyRecursively = (comments, newComment) => {
    for (const comment of comments) {
        if (comment._id === newComment.parentId) {
            comment.replies = comment.replies || [];
            comment.replies.unshift({ ...newComment, replies: [] });
            return true;
        }

        if (comment.replies?.length) {
            const inserted = insertReplyRecursively(comment.replies, newComment);
            if (inserted) return true;
        }
    }
    return false;
};


