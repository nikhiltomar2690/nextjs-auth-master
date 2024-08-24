// import { NextResponse } from "next/server";
// import connectDB from "@/utils/db";
// import User from "@/models/User";

// export const POST = async (request: any) => {
//   const { code, email } = await request.json();

//   await connectDB();

//   try {
//     const user = await User.findOne({ email });

//     if (!user) {
//       return new NextResponse("User not found", { status: 404 });
//     }

//     // Check if the code is valid and not expired
//     if (
//       user.verificationCode !== code ||
//       new Date() > user.verificationExpires
//     ) {
//       return new NextResponse("Invalid or expired code", { status: 400 });
//     }

//     // Mark the user as verified
//     user.verificationCode = undefined; // Remove the code
//     user.verificationExpires = undefined; // Remove the expiration date
//     user.isVerified = true; // Assuming you have an `isVerified` field

//     await user.save();

//     return new NextResponse("User verified successfully", { status: 200 });
//   } catch (error: any) {
//     return new NextResponse("An error occurred", { status: 500 });
//   }
// };

import { NextResponse } from "next/server";
import connectDB from "@/utils/db";
import User from "@/models/User";
import UnverifiedUser from "@/models/unverifiedUser";
import { parse } from "cookie";

export const POST = async (request: any) => {
  // Parse cookies from the request headers
  const cookies = parse(request.headers.get("cookie") || "");
  const email = cookies.unverifiedEmail; // Get the email from the cookie

  if (!email) {
    return new NextResponse("Email not found in cookie", { status: 400 });
  }

  const { code } = await request.json();

  await connectDB();

  try {
    // Find the user in the UnverifiedUser collection
    const unverifiedUser = await UnverifiedUser.findOne({ email });

    if (!unverifiedUser) {
      return new NextResponse("User not found", { status: 404 });
    }

    // Check if the verification code is valid and not expired
    if (
      unverifiedUser.verificationCode !== code ||
      new Date() > unverifiedUser.verificationExpires
    ) {
      return new NextResponse("Invalid or expired code", { status: 400 });
    }

    // Create a new user document based on the unverified user's data
    const newUser = new User({
      email: unverifiedUser.email,
      password: unverifiedUser.password,
      provider: unverifiedUser.provider,
      isVerified: true, // Mark the user as verified
    });

    // Save the new user to the User collection
    await newUser.save();

    // Remove the entry from the UnverifiedUser collection
    await UnverifiedUser.deleteOne({ email });

    // Clear the unverifiedEmail cookie after successful verification
    const response = new NextResponse("User verified successfully", {
      status: 200,
    });
    response.headers.set(
      "Set-Cookie",
      `unverifiedEmail=; Path=/; Max-Age=0; HttpOnly`
    );
    return response;
  } catch (error: any) {
    return new NextResponse("An error occurred", { status: 500 });
  }
};
