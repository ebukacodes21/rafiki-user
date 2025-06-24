"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CardWrapper } from "@/components/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { routes } from "@/constants";
import { apiCall, formatError } from "@/utils/helper";
import { ClipLoader } from "react-spinners";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { v4 as uuidv4 } from "uuid";
import toast from "react-hot-toast";
import Link from "next/link";

import {
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import { selectCurrentFirm } from "@/redux/features/firm";

export const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [accountExists, setAccountExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(true);
const firm = useAppSelector(selectCurrentFirm)
  const router = useRouter();

  const handleGoogleLogin = () => {
    console.log("object")
    setGoogleLoading(true);
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_CALLBACK_SIGNIN!;
    const NONCE = uuidv4();

    const googleOAuthURL =
      `https://accounts.google.com/o/oauth2/v2/auth?` +
      `client_id=${GOOGLE_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(REDIRECT_URI)}&` +
      `response_type=id_token&` +
      `scope=openid%20email%20profile&` +
      `nonce=${NONCE}`;

    window.location.href = googleOAuthURL;
  };

  const handleContinue = async () => {
    setLoading(true);
    try {
      const res = await apiCall("/api/find-account", "POST", { email: email.trim() });
      if (res && res.data) {
        setAccountExists(true);
        toast.success(res.message);
      } else {
        toast.error(formatError(res));
      }
    } catch (err) {
      toast.error(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    setLoading(true);
    try {
      const result = await apiCall("/api/login", "POST", {
        email,
        password,
      });

      if (result.name === "AxiosError") {
        toast.error(formatError(result));
        return;
      }

      router.push(`/${firm?.id}${routes.DASHBOARD}`);
    } catch (err) {
      toast.error(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Log in"
      backButtonLabel={`New to ${firm?.name}? Register with us today.`}
      backButtonHref={routes.SIGNUP}
      topSlot={
        <h1 className="text-3xl text-start font-bold text-blue-600 px-7 italic">
          Powered by Rafiki
        </h1>
      }
      subTitle={`Continue to your ${firm?.name} personalized dashboard.`}
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1">Email:</label>
            <div className="relative">
              <EnvelopeIcon className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-green-400" />
              <Input
                type="email"
                placeholder="johndoe@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading || accountExists}
                className="pl-10"
              />
            </div>
          </div>

          {accountExists && (
            <div>
              <label className="block text-sm font-medium mb-1">Password:</label>
              <div className="relative flex items-center border border-gray-200 rounded-md">
                <LockClosedIcon className="w-5 h-5 absolute left-3 text-red-400" />
                <Input
                  type={isHidden ? "password" : "text"}
                  placeholder="Enter password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 border-0 shadow-none outline-none focus-visible:ring-0"
                />
                <div
                  className="cursor-pointer pr-3 text-gray-600"
                  onClick={() => setIsHidden((prev) => !prev)}
                >
                  {isHidden ? <BsEyeSlash /> : <BsEye />}
                </div>
              </div>

              <Link
                href={routes.FORGOT}
                className="text-sm hover:underline text-gray-700 cursor-pointer"
              >
                Forgot password?
              </Link>
            </div>
          )}
        </div>

        <div className="space-y-2">
          <Button
            type="button"
            className="w-full bg-gray-800 hover:bg-gray-800 cursor-pointer"
            onClick={accountExists ? handleLogin : handleContinue}
            disabled={loading || googleLoading}
          >
            {loading
              ? accountExists
                ? "Logging in..."
                : "Checking..."
              : accountExists
              ? "Log in"
              : "Continue with email"}
            <ClipLoader
              color="#ffffff"
              loading={loading}
              size={20}
              className="ml-4"
            />
          </Button>

          <Button
            type="button"
            className="w-full bg-white hover:bg-white text-black border border-gray-900 cursor-pointer flex items-center justify-center gap-2"
            disabled={loading || googleLoading}
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="text-xl" />
            Log in with Google
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};