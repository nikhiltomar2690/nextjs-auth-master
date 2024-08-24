// import User from "@/models/User";
// import mongoose from "mongoose";
// import connectDB from "@/utils/db";
// import crypto from "crypto";
// import bcrypt from "bcryptjs";
// import { NextResponse } from "next/server";
// import nodemailer from "nodemailer";

// // Setup Nodemailer
// const transporter = nodemailer.createTransport({
//   service: "gmail",
//   auth: {
//     user: process.env.EMAIL_USER,
//     pass: process.env.EMAIL_PASS,
//   },
// });

// async function sendVerificationEmail(email: string, verificationCode: string) {
//   console.log("Sending verification email to:", email);
//   const mailOptions = {
//     from: process.env.EMAIL_USER,
//     to: email,
//     subject: "Verify your SkillSnap Account",
//     text: `Your verification code is: ${verificationCode}`,
//   };
//   await transporter.sendMail(mailOptions);
//   console.log("Verification email sent");
// }

// export const POST = async (request: any) => {
//   const { email, password } = await request.json();

//   await connectDB();

//   const existingUser = await User.findOne({ email });

//   if (existingUser) {
//     return new NextResponse("Email already in use", { status: 400 });
//   }

//   // Generate a verification code and hash the password if provided
//   const verificationCode = crypto.randomInt(100000, 999999).toString();
//   const hashedPassword = password
//     ? await bcrypt.hash(password, 10)
//     : "undefined";

//   const newUser = new User({
//     email,
//     password: hashedPassword,
//     verificationCode,
//     verificationExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
//     isRegistered: true,
//     provider: password ? "credentials" : "google", // Save provider type
//     isVerified: false, // Set initial verification status
//   });

//   try {
//     await newUser.save();
//     // Send verification email
//     console.log("calling verification email");
//     await sendVerificationEmail(email, verificationCode);
//     return new NextResponse("User created", { status: 200 });
//   } catch (err: any) {
//     return new NextResponse(err, {
//       status: 500,
//     });
//   }
// };

import UnverifiedUser from "@/models/unverifiedUser";
import connectDB from "@/utils/db";
import crypto from "crypto";
import bcrypt from "bcryptjs";
import { NextResponse } from "next/server";
import nodemailer from "nodemailer";
import { serialize } from "cookie";

// Setup Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendVerificationEmail(email: string, verificationCode: string) {
  console.log("Sending verification email to:", email);
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: "Verify your SkillSnap Account",
    text: `Your verification code is: ${verificationCode}`,
  };
  await transporter.sendMail(mailOptions);
  console.log("Verification email sent");
}

export const POST = async (request: any) => {
  const { email, password } = await request.json();

  await connectDB();

  // Check if the email is already in the unverifiedUser collection
  const existingUnverifiedUser = await UnverifiedUser.findOne({ email });

  if (existingUnverifiedUser) {
    // Remove the old unverified user entry
    await UnverifiedUser.deleteOne({ email });
  }

  // Generate a verification code and hash the password
  const verificationCode = crypto.randomInt(100000, 999999).toString();
  const hashedPassword = password
    ? await bcrypt.hash(password, 10)
    : "undefined";

  const newUnverifiedUser = new UnverifiedUser({
    email,
    password: hashedPassword,
    verificationCode,
    verificationExpires: new Date(Date.now() + 15 * 60 * 1000), // 15 minutes
  });

  try {
    await newUnverifiedUser.save();
    // Send verification email
    await sendVerificationEmail(email, verificationCode);

    // Set the email in a cookie for access on the verify page
    const cookie = serialize("unverifiedEmail", email, {
      httpOnly: true,
      maxAge: 15 * 60, // 15 minutes
      path: "/",
    });

    return new NextResponse("User created", {
      status: 200,
      headers: {
        "Set-Cookie": cookie,
      },
    });
  } catch (err: any) {
    return new NextResponse(err, {
      status: 500,
    });
  }
};
