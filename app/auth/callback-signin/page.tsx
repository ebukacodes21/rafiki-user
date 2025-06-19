"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { apiCall, formatError } from "@/utils/helper";
import { routes } from "@/constants";
import { ClipLoader } from "react-spinners";
import { useAppSelector } from "@/redux/hooks/typedHooks";
import { selectCurrentFirm } from "@/redux/features/firm";

const CallbackSignup = () => {
  const router = useRouter();
  const [statusMessage, setStatusMessage] = useState("Signing you in with Google...");
  const [loading, setLoading] = useState<boolean>(false)
  const firm = useAppSelector(selectCurrentFirm)

  useEffect(() => {
    setLoading(true)
    const hash = window.location.hash;
    const params = new URLSearchParams(hash.substring(1));
    const token = params.get("id_token");

    if (!token) {
      setStatusMessage("Invalid or missing token. Please try again.");
        setLoading(false)
      return;
    }

    apiCall("/api/login-google", "POST", { token })
      .then((result) => {
        if (result?.name === "AxiosError") {
          setStatusMessage(formatError(result));
            setLoading(false)
          return;
        }
        window.location.href = `/${firm?.adminId}${routes.DASHBOARD}`;
      })
      .catch((error) => {
        setStatusMessage(formatError(error));
             setLoading(false)
      });
  }, [router, firm?.adminId]);

  return (
    <div className="h-screen bg-gradient-to-b from-white to-gray-900 px-4">
     <div className="flex space-x-2">
       <p className="text-md text-gray-900 max-w-md">{statusMessage}</p>
       <ClipLoader loading={loading} color="black" size={20}/>
     </div>
    </div>
  );
};

export default CallbackSignup;
