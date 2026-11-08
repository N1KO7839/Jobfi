import Link from "next/link";
import Image from "next/image";
import { cookies } from "next/headers";

import AuthForm from "@/components/AuthForm";

const RegisterPage = async () => {
  const cookieStore = await cookies();
  const isLoggedIn =
    cookieStore.has("access_token") || cookieStore.has("refresh_token");

  return (
    <div className="min-h-[calc(100vh-200px)] flex flex-col justify-center items-center py-12 px-4">
      <div className="w-full max-w-sm flex flex-col items-center">
        <Link className="flex items-center gap-2.5 mb-6 group" href="/">
          <div className="w-10 h-10 rounded-2xl bg-content2 border border-default-200/80 flex items-center justify-center p-2 shadow-xs">
            <Image
              alt="Jobfi Logo"
              className="dark:hidden object-contain"
              height={24}
              src="/logo_black.svg"
              width={24}
            />
            <Image
              alt="Jobfi Logo"
              className="hidden dark:block object-contain"
              height={24}
              src="/logo.svg"
              width={24}
            />
          </div>
          <span className="font-bold text-2xl tracking-tight text-foreground">
            Jobfi
          </span>
        </Link>

        <div className="w-full bg-content1 border border-default-200 shadow-sm rounded-2xl p-6 sm:p-8 flex flex-col">
          <div className="mb-6 text-center">
            <h1 className="text-xl font-bold tracking-tight text-foreground">
              Create an account
            </h1>
            <p className="text-default-500 text-xs mt-1">
              Start receiving daily job alerts across all 6 platforms
            </p>
          </div>

          <AuthForm authType="register" isLoggedIn={isLoggedIn} />

          <div className="mt-5 pt-5 border-t border-default-100 text-center text-xs text-default-500">
            <span>Already have an account? </span>
            <Link
              className="text-foreground font-semibold hover:underline"
              href="/auth/login"
            >
              Sign in
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
