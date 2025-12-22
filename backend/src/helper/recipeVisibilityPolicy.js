exports.recipeVisibilityPolicy = ({ user, query }) => {
  const filter = { isDeleted: false };

  // 🌍 Public user
  if (!user) {
    filter.isPublished = true;
    return filter;
  }

  // 👨‍🍳 Chef
  if (user.role === "chef") {
    filter.author = user.id;
    return filter; // published + draft + deleted=false
  }

  // 🛠 Admin
  if (user.role === "admin") {
    if (query.isPublished !== undefined) {
      filter.isPublished = query.isPublished === "true";
    }
    return filter;
  }

  // 👤 Normal logged user
  filter.isPublished = true;
  return filter;
};
