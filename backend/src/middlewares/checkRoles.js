const { errorResponse } = require("../util/response");

const allowRoles = (...roles)=>{
    return (req,res,next)=>{
        const userRole  = req?.user?.role ;
        if(!roles.includes(userRole )){
            return errorResponse(res,"Access denied.",403);
        }
        next();
    };
};

module.exports =allowRoles;