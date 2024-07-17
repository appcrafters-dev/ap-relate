"use client";

import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { ErrorBox } from "@/components/ui/errors";
import { TfmInput } from "@/components/ui/forms";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import Image from "next/legacy/image";
import Copyright from "@/components/copyright";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { Button } from "@/components/ui/buttons";
import { LockClosedIcon } from "@heroicons/react/20/solid";
import { useUser } from "@supabase/auth-helpers-react";
import OrDivider from "@/app/components/divider";

export const dynamic = "force-dynamic";

export default function LoginPage() {
  const supabaseClient = getSupabaseClientComponentClient();
  const router = useRouter();
  const supabaseUser = useUser();
  const searchParams = useSearchParams();
  const redirectedFrom = searchParams.get("redirectedFrom") || null;
  const error = searchParams.get("error_description");

  const [authHandler, setAuthHandler] = useState({
    loading: false,
    googleLoading: false,
    azureLoading: false,
    error: error || null,
  });

  useEffect(() => {
    if (error) {
      setAuthHandler({
        loading: false,
        googleLoading: false,
        azureLoading: false,
        error: error.includes("Signups not allowed")
          ? "Sorry, only verified clients of TFM can access this app. Ensure you are using the correct email address then try again."
          : error || "Sorry, there was a problem.",
      });
    }
  }, [router]);

  useEffect(() => {
    if (supabaseUser) {
      router.replace(redirectedFrom ? redirectedFrom : "/dashboard");
    }
  }, [supabaseUser, redirectedFrom, router]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setAuthHandler({
      loading: true,
      googleLoading: false,
      azureLoading: false,
      error: null,
    });
    const { email, password } = e.target.elements;

    const { data: user, error } =
      await supabaseClient.client.auth.signInWithPassword({
        email: email.value,
        password: password.value,
      });

    if (error) {
      return setAuthHandler({
        loading: false,
        googleLoading: false,
        azureLoading: false,
        error: error.message,
      });
    }

    if (user) {
      return router.replace(redirectedFrom ? redirectedFrom : "/dashboard");
    } else {
      return setAuthHandler({
        loading: false,
        googleLoading: false,
        azureLoading: false,
        error: error ? error.message : "Sorry, there was a problem.",
      });
    }
  };

  const handleSocialLogin = async (provider) => {
    setAuthHandler((prevState) => ({
      ...prevState,
      [`${provider}Loading`]: true,
      error: null,
    }));
    const redirectTo =
      window.location.origin + (redirectedFrom ? redirectedFrom : "/dashboard");

    const { error } = await supabaseClient.client.auth.signInWithOAuth({
      provider,
      options: { redirectTo },
    });

    if (error) {
      return setAuthHandler((prevState) => ({
        ...prevState,
        [`${provider}Loading`]: false,
        error: error.message,
      }));
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-brand text-4xl font-bold italic text-tfm-primary">
        Welcome back
      </h1>
      <p className="text-gray-500">Sign in to your account</p>
      {redirectedFrom && (
        <ErrorBox msg="The page you are trying to access requires signing in." />
      )}
      <div className="flex flex-col justify-center space-y-4">
        <Button
          type="button"
          Icon={() => (
            <Image
              src="/img/Google__G__Logo.svg"
              alt="Google Logo"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          )}
          onClick={() => handleSocialLogin("google")}
          disabled={authHandler.googleLoading}
        >
          {authHandler.googleLoading ? (
            <span className="animate-pulse pl-2">Redirecting...</span>
          ) : (
            <span className="pl-2">Continue with Google</span>
          )}
        </Button>
        <Button
          type="button"
          Icon={() => (
            <Image
              src="/img/Microsoft_Logo.svg"
              alt="Microsoft Logo"
              width={20}
              height={20}
              className="h-5 w-5"
            />
          )}
          onClick={() => handleSocialLogin("azure")}
          disabled={authHandler.azureLoading}
        >
          {authHandler.azureLoading ? (
            <span className="animate-pulse pl-2">Redirecting...</span>
          ) : (
            <span className="pl-2">Continue with Microsoft</span>
          )}
        </Button>

        <OrDivider />
      </div>
      <form className="space-y-4" onSubmit={handleLogin}>
        <TfmInput
          id="email"
          label="Email Address"
          type="email"
          placeholder="name@email.com"
          required
        />
        <TfmInput
          id="password"
          label="Password"
          type="password"
          placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
          required
          topHelpText={
            <Link
              href="/forgot"
              className="block text-center text-sm font-medium text-gray-500 hover:text-gray-700"
              tabIndex={-1}
            >
              Forgot your password?
            </Link>
          }
        />
        <Transition
          show={authHandler.error ? true : false}
          enter="transition-opacity duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="transition-opacity duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <ErrorBox msg={authHandler.error} />
        </Transition>
        <Button
          type="submit"
          fullWidth
          loading={authHandler.loading}
          disabled={authHandler.loading}
          Icon={LockClosedIcon}
          primary
        >
          Sign in with email
        </Button>
      </form>
      <Link
        href="/join"
        className="block text-center text-sm font-medium text-gray-500 hover:text-gray-700"
      >
        Not a member? Join today &rarr;
      </Link>
      <Copyright />
    </div>
  );
}
