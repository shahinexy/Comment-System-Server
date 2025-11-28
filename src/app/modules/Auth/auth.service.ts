import { Secret } from "jsonwebtoken";
import config from "../../../config";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import prisma from "../../../shared/prisma";
import * as bcrypt from "bcrypt";
import ApiError from "../../../errors/ApiErrors";
import httpStatus from "http-status";
import crypto from "crypto";
import { emailSender } from "../../../shared/emailSender";

const loginUser = async (payload: { email: string; password: string }) => {
  const userData = await prisma.user.findUnique({
    where: {
      email: payload.email,
    },
    select: {
      id: true,
      fullName: true,
      email: true,
      image: true,
      password: true,
      role: true,
      expirationOtp: true,
    },
  });

  if (!userData?.email) {
    throw new ApiError(
      httpStatus.NOT_FOUND,
      "User not found! with this email " + payload.email
    );
  }
  const isCorrectPassword: boolean = await bcrypt.compare(
    payload.password,
    userData.password
  );

  if (!isCorrectPassword) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Password incorrect!");
  }

  const accessToken = jwtHelpers.generateToken(
    {
      id: userData.id,
      email: userData.email,
      role: userData.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    user: {
      id: userData.id,
      fullName: userData.fullName,
      image: userData.image,
    },
    token: accessToken,
  };
};

const changePassword = async (
  userToken: string,
  newPassword: string,
  oldPassword: string
) => {
  const decodedToken = jwtHelpers.verifyToken(
    userToken,
    config.jwt.jwt_secret!
  );

  const user = await prisma.user.findUnique({
    where: { id: decodedToken?.id },
  });

  if (!user) {
    throw new ApiError(404, "User not found");
  }

  const isPasswordValid = await bcrypt.compare(oldPassword, user?.password);

  if (!isPasswordValid) {
    throw new ApiError(401, "Incorrect old password");
  }

  const hashedPassword = await bcrypt.hash(newPassword, 12);

  await prisma.user.update({
    where: {
      id: decodedToken.id,
    },
    data: {
      password: hashedPassword,
    },
  });

  return { message: "Password changed successfully" };
};

const forgotPassword = async (payload: { email: string }) => {
  const userData = await prisma.user.findFirstOrThrow({
    where: {
      email: payload.email,
    },
  });

  const otp = Number(crypto.randomInt(1000, 9999));

  const otpExpires = new Date(Date.now() + 10 * 60 * 1000);

  const html = `
<div style="font-family: Arial, sans-serif; background-color: #f6f8f7; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
    
    <div style="background-color: #0A4225; padding: 25px 0; text-align: center;">
      <h2 style="color: #ffffff; font-size: 24px; margin: 0;">Forgot Password OTP</h2>
    </div>

    <div style="padding: 30px; text-align: center; color: #333;">
      <p style="font-size: 16px; margin-bottom: 10px;">
        Use the OTP code below to reset your password.
      </p>
      <p style="font-size: 36px; font-weight: bold; color: #0A4225; margin: 20px 0;">
        ${otp}
      </p>

      <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
        This OTP will expire in <strong>10 minutes</strong>.<br/>
        If you didn’t request a password reset, you can safely ignore this message.
      </p>

      <a href="mailto:support@humkadam.com" style="display: inline-block; padding: 10px 20px; background-color: #0A4225; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
        Contact Support
      </a>
    </div>

    <div style="background-color: #f1f4f2; text-align: center; padding: 15px; font-size: 12px; color: #777;">
      <p style="margin: 0;">Best regards,<br/>
      <strong style="color: #0A4225;">Comment System Team</strong></p>
    </div>
  </div>
</div>
`;

  await emailSender(userData.email, html, "Forgot Password OTP");

  await prisma.user.update({
    where: { id: userData.id },
    data: {
      otp: otp,
      expirationOtp: otpExpires,
    },
  });

  return { message: "Reset password OTP sent to your email successfully" };
};

const resendOtp = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: { email: email },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  const otp = Number(crypto.randomInt(1000, 9999));

  const otpExpires = new Date(Date.now() + 5 * 60 * 1000);

  const html = `
<div style="font-family: Arial, sans-serif; background-color: #f6f8f7; padding: 40px;">
  <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.05); overflow: hidden;">
    
    <div style="background-color: #0A4225; padding: 25px 0; text-align: center;">
      <h2 style="color: #ffffff; font-size: 24px; margin: 0;">Resend OTP</h2>
    </div>

    <div style="padding: 30px; text-align: center; color: #333;">
      <p style="font-size: 16px; margin-bottom: 10px;">
        Here is your new OTP code to continue the verification process.
      </p>

      <p style="font-size: 36px; font-weight: bold; color: #0A4225; margin: 20px 0;">
        ${otp}
      </p>

      <p style="font-size: 14px; color: #555; margin-bottom: 20px;">
        This OTP will expire in <strong>5 minutes</strong>.<br/>
        If you didn’t request this code, please ignore this email.
      </p>

      <a href="mailto:support@humkadam.com" style="display: inline-block; padding: 10px 20px; background-color: #0A4225; color: #ffffff; text-decoration: none; border-radius: 6px; font-weight: bold; margin-top: 10px;">
        Contact Support
      </a>
    </div>

    <!-- Footer -->
    <div style="background-color: #f1f4f2; text-align: center; padding: 15px; font-size: 12px; color: #777;">
      <p style="margin: 0;">Best regards,<br/>
      <strong style="color: #0A4225;">Comment System Team</strong></p>
    </div>
  </div>
</div>
`;

  await emailSender(user.email, html, "Resend OTP");

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: otp,
      expirationOtp: otpExpires,
    },
  });

  return { message: "OTP resent successfully" };
};

const verifyOtp = async (payload: { email: string; otp: number }) => {
  const user = await prisma.user.findUnique({
    where: { email: payload.email },
    select: {
      id: true,
      email: true,
      role: true,
      otp: true,
      expirationOtp: true,
    },
  });

  if (!user) {
    throw new ApiError(httpStatus.NOT_FOUND, "This user is not found!");
  }

  if (
    user.otp !== payload.otp ||
    !user.expirationOtp ||
    user.expirationOtp < new Date()
  ) {
    throw new ApiError(httpStatus.BAD_REQUEST, "Invalid OTP");
  }

  await prisma.user.update({
    where: { id: user.id },
    data: {
      otp: null,
      expirationOtp: null,
      verifiedEmail: true,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    {
      id: user.id,
      email: user.email,
      role: user.role,
    },
    config.jwt.jwt_secret as Secret,
    config.jwt.expires_in as string
  );

  return {
    message: "OTP verification successful",
    role: user.role,
    token: accessToken,
  };
};

export const AuthServices = {
  loginUser,
  changePassword,
  forgotPassword,
  resendOtp,
  verifyOtp,
};
