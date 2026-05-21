"use client";
import { useEffect, useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Button } from "@heroui/button";
import { Spinner } from "@heroui/spinner";

import { verifyEmailToken } from "@/app/auth/actions";

const VerifyEmailContent = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const [status, setStatus] = useState<"loading" | "success" | "error">(
    "loading",
  );
  const [message, setMessage] = useState("");

  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("No verification token provided.");

      return;
    }

    const verify = async () => {
      const result = await verifyEmailToken(token);

      if (result.success) {
        setStatus("success");
      } else {
        setStatus("error");
        setMessage(result.message || "Failed to verify email.");
      }
    };

    verify();
  }, [token]);

  return (
    <div className="flex flex-col items-center gap-4">
      {status === "loading" && (
        <div className="flex flex-col items-center gap-2">
          <Spinner color="secondary" />
          <p>Verifying your email...</p>
        </div>
      )}
      {status === "success" && (
        <div className="flex flex-col items-center gap-4 text-success">
          <h3 className="text-xl font-bold">Email Verified!</h3>
          <p>Your account is now verified. You can now log in.</p>
          <Button color="secondary" onPress={() => router.push("/auth/login")}>
            Go to Login
          </Button>
        </div>
      )}
      {status === "error" && (
        <div className="flex flex-col items-center gap-4 text-danger">
          <h3 className="text-xl font-bold">Verification Failed</h3>
          <p>{message}</p>
          <Button
            color="secondary"
            variant="flat"
            onPress={() => router.push("/auth/login")}
          >
            Return to Login
          </Button>
        </div>
      )}
    </div>
  );
};

const VerifyPage = () => {
  const LOGO_SIZE = 36;

  return (
    <div className="flex flex-col justify-center items-center gap-6 mt-20">
      <div className="flex flex-row justify-center items-center gap-2">
        <Image
          alt="logo"
          height={LOGO_SIZE}
          src="/logo_purple.svg"
          width={LOGO_SIZE}
        />
        <h1 className="text-2xl font-semibold">Jobfi</h1>
      </div>
      <div className="flex flex-col justify-center items-center bg-purple-400/15 dark:bg-slate-800/20 w-11/12 sm:w-[500px] py-16 px-4 sm:px-8 rounded-2xl gap-2 text-center">
        <h2 className="text-xl sm:text-2xl font-bold mb-4">
          Email Verification
        </h2>
        <Suspense fallback={<Spinner color="secondary" />}>
          <VerifyEmailContent />
        </Suspense>
      </div>
    </div>
  );
};

export default VerifyPage;
