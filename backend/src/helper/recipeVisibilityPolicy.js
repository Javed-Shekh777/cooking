exports.recipeVisibilityPolicy = ({ user, query }) => {
  const filter = { isDeleted: false };

  // 🌍 Public user
  if (!user) {
    filter.isPublished = true;
    return filter;
  }

  console.log(user,query);
  // 👨‍🍳 Chef
  if (user.role === "CHEF") {
    filter.author = user.id;
    return filter; // published + draft + deleted=false
  }

  // 🛠 Admin
  if (user.role === "ADMIN" || user.role === "SUPERADMIN") {
    if (query.isPublished !== undefined) {
      filter.isPublished = query.isPublished === "true";
    }
    return filter;
  }

  // 👤 Normal logged user
  filter.isPublished = true;
  return filter;
};
