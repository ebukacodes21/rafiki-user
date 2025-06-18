"use client";

import React, { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CardWrapper } from "@/components/card-wrapper";
import { routes } from "@/constants";
import { apiCall, formatError } from "@/utils/helper";
import { ClipLoader } from "react-spinners";
import { BsEye, BsEyeSlash } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import toast from "react-hot-toast";
import Link from "next/link";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import { selectCurrentFirm } from "@/redux/features/firm";

import {
  EnvelopeIcon,
  LockClosedIcon,
} from "@heroicons/react/24/outline";
import { Button } from "../ui/button";

export const LoginForm = () => {
  const searchParams = useSearchParams();
  const initialEmail = searchParams.get("email") || "";
  const firm = useAppSelector(selectCurrentFirm);

  const [email, setEmail] = useState(initialEmail);
  const [password, setPassword] = useState("");
  const [accountExists, setAccountExists] = useState(false);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
  const [isHidden, setIsHidden] = useState(true);

  const router = useRouter();

  const handleGoogleLogin = () => {
    setGoogleLoading(true);
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_CALLBACK_SIGNIN!;
    const NONCE = crypto.randomUUID();

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
    if (!email || email.trim() === "") {
      toast.error("Email address is required");
      return;
    }

    setLoading(true);
    try {
      const res = await apiCall("/api/findAccount", "POST", { email: email.trim() });

      if (res?.data) {
        setAccountExists(true);
        toast.success("Welcome back! Please enter your password.");
      } else {
        toast.error("No account found for this email.");
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
      const result = await apiCall("/api/login", "POST", { email, password });

      if (result.name === "AxiosError") {
        toast.error(formatError(result));
        return;
      }

      router.push(routes.DASHBOARD);
    } catch (err) {
      toast.error(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (initialEmail) {
      handleContinue();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const InputField = ({
    label,
    value,
    onChange,
    icon: Icon,
    type = "text",
    disabled = false,
    placeholder,
    rightElement,
  }: {
    label: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    icon: React.ElementType;
    type?: string;
    disabled?: boolean;
    placeholder: string;
    rightElement?: React.ReactNode;
  }) => (
    <div className="space-y-1">
      <label className="text-sm text-gray-700 font-medium">{label}</label>
      <div className="flex items-center border rounded-md px-3 py-2 focus-within:ring-2 focus-within:ring-black border-gray-300">
        <Icon className="h-5 w-5 mr-2 text-gray-500" />
        <input
          value={value}
          onChange={onChange}
          type={type}
          placeholder={placeholder}
          disabled={disabled}
          className="w-full border-none outline-none text-sm text-gray-800 placeholder-gray-400"
        />
        {rightElement && <div className="ml-2">{rightElement}</div>}
      </div>
    </div>
  );

  return (
    <CardWrapper
      headerLabel="Log in"
      subTitle="Continue to your personalized dashboard"
      backButtonLabel={`New to ${firm?.name}? Register with us`}
      backButtonHref={`${routes.SIGNUP}`}
      topSlot={
        <h1 className="text-3xl text-start font-bold text-blue-600 px-7 italic">
          Powered by Rafiki
        </h1>
      }
    >
      <div className="space-y-6">
        <div className="space-y-4">
          <InputField
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="johndoe@example.com"
            icon={EnvelopeIcon}
            type="email"
            disabled={loading || accountExists}
          />

          {accountExists && (
            <>
              <InputField
                label="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter your password"
                icon={LockClosedIcon}
                type={isHidden ? "password" : "text"}
                rightElement={
                  <div
                    onClick={() => setIsHidden((prev) => !prev)}
                    className="cursor-pointer text-gray-600"
                  >
                    {isHidden ? <BsEyeSlash /> : <BsEye />}
                  </div>
                }
              />

              <Link
                href={routes.FORGOT}
                className="text-sm text-gray-600 hover:underline"
              >
                Forgot password?
              </Link>
            </>
          )}
        </div>

        <div className="space-y-2">
          <Button
            type="button"
            className="w-full bg-gray-800 hover:bg-gray-800"
            onClick={accountExists ? handleLogin : handleContinue}
            disabled={loading || googleLoading}
          >
            {accountExists
              ? loading
                ? "Logging in..."
                : "Log in"
              : loading
              ? "Checking..."
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
            className="w-full bg-white hover:bg-white text-black border border-gray-900"
            disabled={loading || googleLoading}
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2" />
            Log in with Google
          </Button>
        </div>
      </div>
    </CardWrapper>
  );
};
