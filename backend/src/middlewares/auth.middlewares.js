import { ApiError } from "../utils/ApiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import jwt from "jsonwebtoken";
import { User } from "../models/user.models.js";
import { BlackList } from "../models/blacklistToken.models.js";

export const verifyUser = asyncHandler( async ( req , res , next ) => {
    try {
        const token = req.cookies?.token || req.header("Authorization")?.replace("Bearer" , "").trim();

        if(!token){
            throw new ApiError(401 , "Unathorized Access")
        }

        const blacklistedToken = await BlackList.findOne({ token : token });

        if(blacklistedToken){
            return res
            .status(401)
            .json(new ApiError(401 , "Token is blacklisted. Please login again."));
        }

        const decodedToken = jwt.verify(token , process.env.AUTH_TOKEN_SECRET)

        const user = await User.findById(decodedToken?._id).select("-password -authToken")

        if(!user){
            throw new ApiError(401 , "Invalid Authorization Token")
        }

        req.user = user;
        next();

    } catch (error) {
        throw new ApiError(401 , error?.message || "Unauthorized Access")
    }
})