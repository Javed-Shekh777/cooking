const SchemaName = {
    user: "User",
    userLog: "UserLog",
    recipe: "Recipe",
    recipeLike: "RecipeLike",
    tag:"Tag",
    recipeCategory:"recipeCategory",
    contact:"Contact"

}

const cloudinaryFolderNames = {
    profile: `${process.env.CLOUDINARY_FOLDER_NAME}/profiles`,
    videos: `${process.env.CLOUDINARY_FOLDER_NAME}/videos`,
    images: `${process.env.CLOUDINARY_FOLDER_NAME}/images`,
};

const cloudinaryConfig = {
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET,
    secure:true,
}
// DB_URL=mongodb+srv://mdjavedshekh1210:javed1210@cluster1.jt6wkhm.mongodb.net/cooking?retryWrites=true&w=majority&appName=AtlasApp

const SALT = parseInt(process.env.SALT);
const dbUrl = process.env.DB_URL || "";
const dbName = process.env.DATABASE || "";

const MONGODB_URL =
  dbUrl.length <= 30
    ? `${dbUrl}/${dbName}`
    : `${dbUrl}/${dbName}?retryWrites=true&w=majority&appName=AtlasApp`;

const PORT = process.env.PORT;
const allowedOrigins = ["https://cookify-ruby-eight.vercel.app","http://10.118.125.127:5173",process.env.FRONTEND];
const Tokens = {
    acessToken: process.env.ACCESS_TOKEN,
    accessTokenExpiry: process.env.ACCESS_TOKEN_EXPIRY,
    refreshToken: process.env.REFRESH_TOKEN,
    refreshTokenExpiry: process.env.REFRESH_TOKEN_EXPIRY,
    webToken: process.env.WEB_TOKEN,
    webTokenExpiry: process.env.WEB_TOKEN_EXPIRY
};

const mailOptions = {
    username: process.env.AUTH_EMAIL,
    userKey: process.env.AUTH_KEY,
    ownerName: process.env.OWNER_NAME,
    ownerEmail: process.env.OWNER_EMAIL
};

module.exports = { SchemaName, SALT, Tokens, MONGODB_URL, PORT, allowedOrigins, mailOptions, cloudinaryFolderNames ,cloudinaryConfig};