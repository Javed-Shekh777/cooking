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
