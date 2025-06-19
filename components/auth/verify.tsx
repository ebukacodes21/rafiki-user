"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CardWrapper } from "@/components/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { apiCall, formatError } from "@/utils/helper";
import { routes } from "@/constants";
import { PaperAirplaneIcon, ArrowPathIcon } from "@heroicons/react/24/outline";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import { selectCurrentFirm } from "@/redux/features/firm";

const VerifySchema = z.object({
  code: z.string().min(4, "Verification code must be at least 4 characters."),
});

export const VerifyForm = () => {
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const router = useRouter();
  const firm = useAppSelector(selectCurrentFirm)

  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (value: z.infer<typeof VerifySchema>) => {
    setLoading(true);
    try {
      const res = await apiCall("/api/verify", "POST", value);
      if (res.name === "AxiosError") {
        toast.error(formatError(res));
        return;
      }

      toast.success(res.message);
      router.push(`/${firm?.adminId}${routes.DASHBOARD}`);
    } catch (err) {
      toast.error(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setResending(true);
    try {
      const res = await apiCall("/api/resend", "GET");
      if (res.name === "AxiosError") {
        toast.error(formatError(res));
        return;
      }

      toast.success(res.message);
    } catch (err) {
      toast.error(formatError(err));
    } finally {
      setResending(false);
    }
  };

  return (
    <CardWrapper
      headerLabel={`Verify Your ${firm?.name} Account`}
      subTitle="Paste the code sent to your email address."
      backButtonLabel="Back to Login"
      backButtonHref={routes.LOGIN}
      topSlot={
        <h1 className="text-3xl text-start font-bold text-blue-600 px-7 italic">
          Powered by Rafiki
        </h1>
      }
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="code"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Verification Code:</FormLabel>
                <FormControl>
                  <div className="relative">
                    <Input
                      {...field}
                      placeholder="Enter code"
                      className="tracking-widest text-lg pr-10"
                    />
                  
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <div className="space-y-1.5">
            <Button
              type="submit"
              className="w-full bg-gray-800 hover:bg-gray-900 text-white cursor-pointer"
              disabled={loading || resending} 
            >
              <PaperAirplaneIcon className="h-5 w-5 text-white mr-2" />
              {loading ? "Sending..." : "Send Code"}
              <ClipLoader
                color="#ffffff"
                loading={loading}
                size={20}
                className="ml-3"
              />
            </Button>

            <Button
              type="button"
              onClick={handleResend}
              className="w-full bg-white border border-gray-300 text-gray-800 hover:bg-gray-100 cursor-pointer"
            disabled={loading || resending} 
            >
              <ArrowPathIcon className="h-5 w-5 text-blue-600 mr-2" />
              {resending ? "Resending..." : "Resend Code"}
              {resending && (
                <ClipLoader
                  color="#4B5563"
                  loading={resending || loading}
                  size={18}
                  className="ml-3"
                />
              )}
            </Button>
          </div>
        </form>
      </Form>
    </CardWrapper>
  );
};
