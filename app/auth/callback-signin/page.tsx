"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall, formatError } from "@/utils/helper";
import { routes } from "@/constants";
import { ClipLoader } from "react-spinners";

const CallbackSignin = () => {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState(
    "Signing you in with Google..."
  );

  useEffect(() => {
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("id_token");

    if (!token) {
      setStatusMessage("Invalid or missing token. Please try again.");
      return;
    }

    apiCall("/api/login-google", "POST", { token })
      .then((result) => {
        if (result?.name === "AxiosError") {
          setStatusMessage(formatError(result));
          return;
        }
        window.location.href = routes.DASHBOARD;
      })
      .catch((error) => {
        setStatusMessage(formatError(error));
      });
  }, [router]);

  return (
    <div className="h-screen bg-gradient-to-b from-white to-gray-900 px-4">
      <div className="flex space-x-2 items-center">
        <p className="text-md text-gray-900 max-w-md">{statusMessage}</p>
        <ClipLoader loading color="black" size={20} />
      </div>
    </div>
  );
};

export default CallbackSignin;
