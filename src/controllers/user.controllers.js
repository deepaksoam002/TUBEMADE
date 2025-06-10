import { apiError } from "../utils/apiError.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { User } from "../models/user.models.js";
const registerUser = asyncHandler(async (req, res) => {
  const { fullName, email, username, password } = req.body;

  //validation
  if (
    [fullName, email, username, password].some((field) => field.trim() === "")
  ) {
    throw new apiError(400, "All fields are reuired");
  }

  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });

  if (existedUser) {
    throw new apiError(409, "User with email or username already existed");
  }

  const avatarLocalPath = req.files?.avatar[0]?.path;
  const coverLocalPath = req.files?.coverImage[0]?.path;

  if (!avatarLocalPath) {
    throw new apiError(400, "Avatar file is missing");
  }
});

export { registerUser };
