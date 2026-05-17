import React from "react";
import Image from "next/image";
import Link from "next/link";

import AuthForm from "@/components/AuthForm";

const page = () => {
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
      <div className="flex flex-col justify-center items-center bg-purple-400/15 dark:bg-slate-800/20 w-1/2 py-16 px-8 rounded-2xl gap-2">
        <h2 className="text-2xl font-bold">Create your account</h2>
        <h3 className="text-white/20 text-md font-medium">
          Start receiving daily job alerts today.
        </h3>
        <AuthForm authType="register" />
        <div className="flex flex-row justify-center items-center gap-2">
          <h3>Already have an account?</h3>
          <Link
            className="text-purple-500 font-semibold"
            href={"/auth/register"}
          >
            Sign in
          </Link>
        </div>
      </div>
    </div>
  );
};

export default page;
