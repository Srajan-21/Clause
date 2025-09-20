import { asyncHandler } from "../utils/asyncHandler.js"
import { ApiError } from "../utils/ApiError.js"
import { User } from "../models/user.models.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { BlackList } from "../models/blacklistToken.models.js"

const registerUser = asyncHandler(async (req,res) => {
    
    const{fullName , email , password} = req.body;
    console.log("email : " , email);

    if([fullName , email , password].some((field) => !field || field?.trim() === ""))
    {
        throw new ApiError(400 , "All fields are required")
    }

    // user already exist or not
    const existedUser = await User.findOne({email})

    if( existedUser ){
        throw new ApiError(409 , "User with email already exists")
    }

    // CRETE USER  object
    const user = await User.create({
        fullName,
        email,
        password
    })

    // remove password and refersh tokens
    const createdUser = await User.findById(user._id).select(
        "-password -authToken"
    )

    // check for user creation
    if(!createdUser){
        throw new ApiError(500 , "Something went wrong while registering the user")
    }

    const token = await user.generateAuthToken()

    return res.status(201).json(
        new ApiResponse(200 , { user: createdUser, token } , "User Registered Successfully")
    )

})

const loginUser = asyncHandler(async(req,res) => {
    const {email , password} = req.body;

    if(!email || email.trim() === "" || !password || password.trim() === ""){
        throw new ApiError(400 , "All fields are required")
    }

    const user = await User.findOne({email}).select("+password +authToken")

    if(!user){
        throw new ApiError(404 , "User not found")
    }

    const isPasswordMatched = await user.comparePassword(password)

    if(!isPasswordMatched){
        throw new ApiError(401 , "Invalid credentials")
    }

    const token = await user.generateAuthToken()

    const loggedInUser = await User.findById(user._id).select("-password -authToken")

    const options = {
        httpOnly : true,
        secure : true
    }

    return res
    .status(200)
    .cookie("token" , token , options)
    .json(
        new ApiResponse(
            200 , 
            {
                user : loggedInUser , token
            },
            "User Logged In Successfully"
        )
    )
})

const getUserProfile = asyncHandler(async(req,res) => {
    return res
    .status(200)
    .json(new ApiResponse(
        200 , 
        req.user , 
        "User Profile fetched Successfully"
    ))
})

const logoutUser = asyncHandler(async(req,res) => {
    
    const token = req.cookies?.token || req.get("Authorization")?.replace("Bearer" , "").trim();

    if(token)
        await BlackList.create({ token })

     res.clearCookie('token',{
        httpOnly: true,
        sameSite: "strict"
     })

    return res.status(200)
    .json(new ApiResponse(200 , null , "User logged out Successfully")
    )
})

export {registerUser , loginUser , getUserProfile , logoutUser}