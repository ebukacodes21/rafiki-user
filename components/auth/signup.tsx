"use client";

import React, { useState } from "react";
import { CardWrapper } from "@/components/card-wrapper";
import { routes } from "@/constants";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { SignupSchema } from "@/schema";
import { useRouter } from "next/navigation";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import { selectCurrentFirm } from "@/redux/features/firm";
import { apiCall, formatError } from "@/utils/helper";
import toast from "react-hot-toast";
import { v4 as uuidv4 } from "uuid";

import {
  EnvelopeIcon,
  LockClosedIcon,
  PhoneIcon,
  UserIcon,
} from "@heroicons/react/24/outline";
import { BsEyeSlash, BsEye } from "react-icons/bs";
import { FcGoogle } from "react-icons/fc";
import { ClipLoader } from "react-spinners";
import { Button } from "../ui/button";

type FormType = z.infer<typeof SignupSchema>;

export const SignupForm = () => {
  const [isHidden, setIsHidden] = useState(true);
  const [loading, setIsLoading] = useState(false);

  const firm = useAppSelector(selectCurrentFirm);

  const router = useRouter();

    const handleGoogleLogin = () => {
    setIsLoading(true);
    const GOOGLE_CLIENT_ID = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID!;
    const REDIRECT_URI = process.env.NEXT_PUBLIC_CALLBACK_SIGNUP!;
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

  const form = useForm<FormType>({
    resolver: zodResolver(SignupSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
    },
  });

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = form;

  const InputField = ({
    label,
    name,
    placeholder,
    Icon,
    type = "text",
    iconColor = "text-gray-400",
  }: {
    label: string;
    name: keyof FormType;
    placeholder: string;
    Icon: React.ElementType;
    type?: string;
    iconColor?: string;
  }) => (
    <div className="space-y-1">
      <label className="text-sm text-gray-700 font-medium">
        {label}
        <span className="text-red-500 ml-1">*</span>
      </label>
      <div
        className={`flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ${
          errors[name]
            ? "border-red-500 focus-within:ring-red-500"
            : "border-gray-300 focus-within:ring-black"
        }`}
      >
        <Icon className={`h-5 w-5 mr-2 ${iconColor}`} />
        <input
          type={type}
          placeholder={placeholder}
          {...register(name)}
          className="w-full border-none outline-none text-sm text-gray-800 placeholder-gray-400"
        />
      </div>
      {errors[name] && (
        <p className="text-xs text-red-600">{errors[name]?.message}</p>
      )}
    </div>
  );

  const PasswordField = () => (
    <div className="space-y-1">
      <label className="text-sm text-gray-700 font-medium">
        Password<span className="text-red-500 ml-1">*</span>
      </label>
      <div
        className={`flex items-center border rounded-md px-3 py-2 focus-within:ring-2 ${
          errors.password
            ? "border-red-500 focus-within:ring-red-500"
            : "border-gray-300 focus-within:ring-black"
        }`}
      >
        <LockClosedIcon className="h-5 w-5 mr-2 text-gray-500" />
        <input
          {...register("password")}
          type={isHidden ? "password" : "text"}
          placeholder="Enter your password"
          className="w-full border-none outline-none text-sm text-gray-800 placeholder-gray-400"
        />
        <div
          className="cursor-pointer ml-2 text-gray-600"
          onClick={() => setIsHidden(!isHidden)}
        >
          {isHidden ? <BsEyeSlash /> : <BsEye />}
        </div>
      </div>
      {errors.password && (
        <p className="text-xs text-red-600">{errors.password?.message}</p>
      )}
    </div>
  );

  const onSubmit = async (values: FormType) => {
    setIsLoading(true);
    const result = await apiCall("/api/signup", "POST", {...values, firmName: firm?.name, firmID: firm?._id});
    if (result.name === "AxiosError") {
      toast.error(formatError(result));
      setIsLoading(false);
      return;
    }

    toast.success(result.message, { duration: 5000 });
    router.push(`/${firm?.adminId}${routes.DASHBOARD}`);
    setIsLoading(false);
  };

  return (
    <CardWrapper
      headerLabel={`Welcome to ${firm?.name}`}
      backButtonLabel={`Already a client with ${firm?.name}? Log in`}
      backButtonHref={`${routes.LOGIN}`}
      subTitle="Register with us today for your professional services."
      topSlot={
        <h1 className="text-3xl text-start font-bold text-blue-600 px-7 italic">
          Powered by Rafiki
        </h1>
      }
    >
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-4">
          <InputField
            label="Full Name"
            name="fullName"
            placeholder="Jane Doe"
            Icon={UserIcon}
            iconColor="text-orange-600"
          />
          <InputField
            label="Phone Number"
            name="phone"
            placeholder="+254..."
            Icon={PhoneIcon}
            iconColor="text-green-600"
          />
          <InputField
            label="Email"
            name="email"
            placeholder="jane@example.com"
            Icon={EnvelopeIcon}
            iconColor="text-blue-600"
          />
          <PasswordField />
        </div>

        <div className="space-y-2">
          <Button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-800 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Creating..." : "Register"}
            <ClipLoader
              color="#ffffff"
              loading={loading}
              size={20}
              className="ml-4"
            />
          </Button>

          <Button
            type="button"
            className="w-full bg-white hover:bg-white text-black border border-gray-900 cursor-pointer"
            disabled={loading}
            onClick={handleGoogleLogin}
          >
            <FcGoogle className="mr-2" />
            Sign up with Google
          </Button>
        </div>
      </form>
    </CardWrapper>
  );
};
