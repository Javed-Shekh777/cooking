import React, { useEffect } from 'react';
import { MdMoreHoriz } from 'react-icons/md';


import { FaRegComment, FaHeart } from 'react-icons/fa';
import { useState } from 'react';
import { timeAgo } from '../services/features';


const CommentsSection = ({ comments, user, handleAddComment, shownReplies, newCommentText, setNewCommentText, handleLikeComment, startReply, replyingToCommentId, toggleMoreMenu, toggleReplies, openMenuId, setOpenMenuId }) => {

    // State to manage which comment's 'More' menu is open
    // State to manage which comments have their replies expanded

    // Toggle the 'More' menu for a specific comment
    // const toggleMoreMenu = (commentId) => {
    //     setOpenMenuId(openMenuId === commentId ? null : commentId);
    // };

    // Toggle visibility of replies for a specific comment
    // const toggleReplies = (commentId) => {
    //     if (shownReplies.includes(commentId)) {
    //         setShownReplies(shownReplies.filter(id => id !== commentId));
    //     } else {
    //         setShownReplies([...shownReplies, commentId]);
    //     }
    // };

    // Placeholder functions for More menu actions
    const handleDeleteComment = (commentId) => { console.log("Deleting:", commentId); setOpenMenuId(null); };
    const handleReportComment = (commentId) => { console.log("Reporting:", commentId); setOpenMenuId(null); };



    return (
        <div className="mt-10 no-print">
            <h2 className="text-4xl font-semibold mb-2">Comments</h2>
            <hr className="border-t-2 border-gray-300 w-24 mb-6" />

            {/* Comments List */}
            <div className="max-w-3xl">
                <div className="">
                    {comments?.length > 0 ? (
                        comments.map((comment) => {
                            const isMenuOpen = openMenuId === comment._id;
                            const isRepliesShown = shownReplies.includes(comment._id); // ✅ Check if THIS comment's replies should be shown
                            // Check if current user liked this comment (requires user._id check)
                            const userLikedComment = comment.likes?.map(id => id.toString()).includes(user?._id?.toString());

                            return (
                                <div key={comment._id} className="bg-gray-50 sm:p-4 p-2 rounded-lg flex gap-x-4  mb-4 ">
                                    <div className="">
                                        <img src={comment?.user?.profileImage?.url || "/profile/Ellipse 2 (3).jpg"} alt="Profile" className='h-8 w-8 object-cover rounded-full' />
                                    </div>
                                    <div className="flex-grow">
                                        <div className="">
                                            <p className="font-semibold mb-[-5px] p-0">{comment?.user?.username || "Unknown User"}</p>
                                            {/* Display actual time, not hardcoded "4s ago" */}
                                            <span className="text-xs text-gray-400">{comment?.createdAt ? timeAgo(comment?.createdAt) : new Date(comment.createdAt).toLocaleDateString()}</span>
                                        </div>

                                        <p className="text-black my-1">{comment.text}</p>

                                        <div className="social flex items-center gap-x-4 text-gray-400 ">
                                            {/* Replies Button */}

                                            <div id="commentReply" onClick={() => startReply(comment._id)} className="bx flex items-center gap-x-1 cursor-pointer">
                                                <p className='text-[13px] font-medium hover:text-gray-600'>Reply</p>
                                            </div>

                                            {/* Comment Like Button */}
                                            <div onClick={() => handleLikeComment(comment._id)}
                                                className={`bx flex items-center gap-x-1 cursor-pointer ${userLikedComment ? 'text-red-500' : ''}`}>
                                                <FaHeart />
                                                {/* Display actual likes count */}
                                                <p className='text-sm'>{comment?.likes?.length || 0}</p>
                                            </div>
                                            {/* More Button */}
                                            <div className="relative">
                                                <div onClick={() => toggleMoreMenu(comment._id)} className="bx flex items-center gap-x-1 cursor-pointer">
                                                    <MdMoreHoriz />
                                                    <p className='text-[13px]'>More</p>
                                                </div>
                                                {/* More Menu Dropdown */}
                                                {isMenuOpen && (
                                                    <div className="absolute left-0 top-5 mb-2  bg-white w-28 rounded-md shadow-lg z-10">
                                                        {/* Check if current user is the author of the comment */}
                                                        {user?._id === comment.user._id ? (
                                                            <>
                                                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => {/* handle edit */ }}>Edit</button>
                                                                <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleDeleteComment(comment._id)}>Delete</button>
                                                            </>
                                                        ) : (
                                                            <button className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" onClick={() => handleReportComment(comment._id)}>Report</button>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div
                                            onClick={() => toggleReplies(comment._id)}
                                            className="bx flex items-center justify-between w-full gap-x-4 cursor-pointer text-gray-500 hover:text-blue-500 transition duration-150"
                                        >
                                            <div className="flex-grow h-px bg-gray-300"></div>

                                            <div className="w-fit min-w-[150px] text-center">
                                                <p className='text-xs font-medium'>
                                                    {isRepliesShown ? 'Hide Replies' : `View all ${comment?.replies?.length || 0} Replies`}
                                                </p>
                                            </div>

                                            <div className="flex-grow h-px bg-gray-300"></div>
                                        </div>


                                        {/* Replies List */}
                                        {isRepliesShown && comment?.replies?.length > 0 && (
                                            <div className=" pl-4 border-l-2 border-gray-200 space-y-3">
                                                {comment.replies.map((reply) => (
                                                    // Use reply._id as key and correct property names
                                                    <div key={reply._id} className='flex gap-x-4'>
                                                        <div className="">
                                                            <img src={reply?.user?.profileImage?.url || "/profile/Ellipse 2 (3).jpg"} alt="Profile" className='h-8 w-8 object-cover rounded-full' />
                                                        </div>
                                                        <div className="">
                                                            <div className="">
                                                                <p className="font-semibold mb-[-5px] p-0">{reply?.user?.username || "Unknown User"}</p>
                                                                <span className="text-xs text-gray-400">{reply?.createdAt ? timeAgo(reply?.createdAt) : new Date(comment.createdAt).toLocaleDateString()}</span>

                                                            </div>
                                                            <p className="text-black my-1">{reply.text}</p>
                                                            {/* Add reply actions here if needed */}
                                                        </div>
                                                    </div>
                                                ))}
                                            </div>
                                        )}

                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <p>No comments yet. Be the first to comment!</p>
                    )}
                </div>
            </div>

            {/* Comment Input */}
            <div className="my-6 max-w-3xl" id='commentReply'>
                <h3 className='text-3xl mb-2 font-semibold'>Write a Comment</h3>
                {replyingToCommentId && (
                    <div className="mb-2 p-2 bg-blue-100 rounded flex justify-between items-center">
                        <span>Replying to {comments.find(c => c._id === replyingToCommentId)?.user?.username || 'a comment'}</span>
                        <button onClick={() => startReply(null)} className="text-blue-600 font-bold">Cancel</button>
                    </div>
                )}
                <div className="w-full border border-gray-300 rounded-lg p-2">
                    <textarea
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        placeholder="Write your comment..."
                        className="w-full p-1 focus:border-0 focus:outline-0 rounded-lg resize-none"
                        rows={3}
                    />
                    <div className="w-full flex items-center justify-end">
                        <button
                            onClick={handleAddComment}
                            className="mt-2 px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
                        >
                            Post Comment
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CommentsSection; // You might make this a sub-component or inline it
