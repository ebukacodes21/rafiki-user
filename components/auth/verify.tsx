"use client";
import React, { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { CardWrapper } from "@/components/card-wrapper";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { ClipLoader } from "react-spinners";
import toast from "react-hot-toast";
import { apiCall, formatError } from "@/utils/helper";
import { routes } from "@/constants";

const VerifySchema = z.object({
  code: z.string().min(4, "Verification code must be at least 4 characters."),
});

export const VerifyForm = () => {
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email");

  const form = useForm<z.infer<typeof VerifySchema>>({
    resolver: zodResolver(VerifySchema),
    defaultValues: {
      code: "",
    },
  });

  const onSubmit = async (values: z.infer<typeof VerifySchema>) => {
    if (!email) {
      toast.error("Missing email parameter.");
      return;
    }

    setLoading(true);
    try {
      const res = await apiCall("/api/verify", "POST", {
        email,
        code: values.code,
      });

      if (res.name === "AxiosError") {
        toast.error(formatError(res));
        return;
      }

      toast.success("Account verified successfully!");
      router.push(routes.DASHBOARD);
    } catch (err) {
      toast.error(formatError(err));
    } finally {
      setLoading(false);
    }
  };

  return (
    <CardWrapper
      headerLabel="Verify Your Account"
      subTitle="Paste the code sent to your email"
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
                  <Input
                    {...field}
                    placeholder="Enter code"
                    maxLength={6}
                    className="tracking-widest text-lg text-center"
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button
            type="submit"
            className="w-full bg-gray-800 hover:bg-gray-800 cursor-pointer"
            disabled={loading}
          >
            {loading ? "Verifying..." : "Verify Account"}
            <ClipLoader
              color="#ffffff"
              loading={loading}
              size={20}
              className="ml-4"
            />
          </Button>
        </form>
      </Form>
    </CardWrapper>
  );
};
