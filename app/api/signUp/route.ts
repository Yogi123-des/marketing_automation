import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/DBconnect";
import UserModel from "@/models/user";
import { sendVerificationEmail } from "@/helpers/sendVerificationEmail";
import bcrypt from "bcryptjs";

export async function POST(req: Request) {
    await connectToDatabase();

    try {
        const { username, email, password } = await req.json();

        // 1. Check if username is taken by a verified user
        const existingUserVerifiedByUsername = await UserModel.findOne({
            username,
            isVerified: true,
        });

        if (existingUserVerifiedByUsername) {
            return NextResponse.json(
                {
                    success: false,
                    message: 'Username is already taken.',
                },
                { status: 400 }
            );
        }

        // 2. Check if email already exists in our database
        const existingUserByEmail = await UserModel.findOne({ email });
        const verifyCodeOTP = Math.floor(100000 + Math.random() * 900000).toString();
        const hashedPassword = await bcrypt.hash(password, 10);
        const expiryDate = new Date(Date.now() + 3600000); // 1 Hour Expiry

        if (existingUserByEmail) {
            // Scenario A: Email is already registered and verified
            if (existingUserByEmail.isVerified) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Email is already in use.',
                    },
                    { status: 400 }
                );
            }

            // Scenario B: Email exists but is NOT verified yet (the user is re-registering)
            // But wait! Did they change their username to something that another unverified user has?
            const usernameConflict = await UserModel.findOne({ username });
            if (usernameConflict && usernameConflict.email !== email) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Username is already taken by another account.',
                    },
                    { status: 400 }
                );
            }

            // Update details of the existing unverified account safely
            existingUserByEmail.username = username;
            existingUserByEmail.password = hashedPassword;
            existingUserByEmail.verifyCode = verifyCodeOTP;
            existingUserByEmail.verifyCodeExpiry = expiryDate;
            await existingUserByEmail.save();

        } else {
            // Scenario C: Completely new user signup
            // We must ensure the chosen username isn't held by ANYONE (even unverified) to prevent DB index collisions
            const usernameExistsAtAll = await UserModel.findOne({ username });
            if (usernameExistsAtAll) {
                return NextResponse.json(
                    {
                        success: false,
                        message: 'Username is already taken.',
                    },
                    { status: 400 }
                );
            }

            const newUser = new UserModel({
                username,
                email,
                password: hashedPassword,
                verifyCode: verifyCodeOTP,
                verifyCodeExpiry: expiryDate,
                isVerified: false,
            });
            await newUser.save();
        }

        // 3. Dispatch the verification email via Resend
        const emailResponse = await sendVerificationEmail(email, username, verifyCodeOTP);

        if (!emailResponse.success) {
            return NextResponse.json(
                {
                    success: false,
                    message: emailResponse.message,
                },
                { status: 500 }
            );
        }

        return NextResponse.json(
            {
                success: true,
                message: 'User registered successfully. Verification email sent.',
            },
            { status: 201 }
        );

    } catch (error) {
        console.error('Error during sign-up:', error);
        return NextResponse.json(
            {
                success: false,
                message: 'An error occurred during sign-up.',
            },
            { status: 500 }
        );
    }
}