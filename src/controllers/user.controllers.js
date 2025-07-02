import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
import {
  deleteFromCloudinary,
  uploadOnCloudinary,
} from "../utils/cloudinary.js";
import { apiResponse } from "../utils/apiResponse.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullname, email, username, password } = req.body;

  //validation
  if (
    [fullname, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new apiError(400, "All fields are reuired");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already existed");
  }
  console.warn(req.files);
  const avatarLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  // checking for avatar file (required for user)
  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is missing");
  }

  //const avatar = await uploadOnCloudinary(avatarLocalPath);

  //checking for cover image and if there is a cpver image then upoad it (optional for user)
  //let coverImage = "";
  //if (coverImageLocalPath) {
  //coverImage = await uploadOnCloudinary(coverImageLocalPath);
  // }

  let avatar;
  try {
    avatar = await uploadOnCloudinary(avatarLocalPath);
    console.log("upload avatar", avatar);
  } catch (error) {
    console.log("Error uploading avatar", error);
    throw new apiError(500, "Failed to Upload Avatar");
  }

  let coverImage;
  try {
    coverImage = await uploadOnCloudinary(coverImageLocalPath);
    console.log("upload coverImage", coverImage);
  } catch (error) {
    console.log("Error uploading coverImage", error);
    throw new apiError(500, "Failed to Upload coverImage");
  }

  try {
    const user = await User.create({
      fullname,
      avatar: avatar.url,
      coverImage: coverImage?.url || "",
      email,
      password,
      username: username.toLowerCase(),
    });

    const createdUser = await User.findById(user._id).select(
      "-password -refreshToken"
    );

    if (!createdUser) {
      throw new apiError(500, "Something Went Wrong While registering a user");
    }

    return res
      .status(201)
      .json(new apiResponse(200, createdUser, "User registed successfully"));
  } catch (error) {
    console.log("user creation failed");

    if (avatar) {
      await deleteFromCloudinary(avatar.public_id);
    }
    if (coverImage) {
      await deleteFromCloudinary(coverImage.public_id);
    }

    throw new apiError(
      500,
      "something went wrong while registering a user and image were deleted "
    );
  }
});
export { registerUser };
