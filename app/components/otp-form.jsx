"use client";

import { useUser, useSessionContext } from "@supabase/auth-helpers-react";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Spinner from "@/components/ui/spinner";
import { ErrorBox } from "@/components/ui/errors";
import { OTPInput, TfmCheckbox, TfmInput } from "@/components/ui/forms";
import { Transition } from "@headlessui/react";
import Link from "next/link";
import { Button } from "@/components/ui/buttons";
import {
  CheckCircleIcon,
  InboxIcon,
  UserPlusIcon,
} from "@heroicons/react/20/solid";
import AuthPageLink from "./auth-page-link";

const defaultAuthHandler = {
  loading: false,
  msg: null,
  success: false,
  confirmPage: false,
};

export default function OtpForm({
  heading = "Forgot Password",
  redirectTo = "/reset",
  initialInstructions = "Enter your email and we'll send you a secure passcode to verify your identity.",
  hideLink = false,
  link = {
    text: "Return to sign in",
    url: "/login",
    arrow: "left",
  },
  method = "signInWithOtp", // signInWithOtp or signUp
}) {
  const [authHandler, setAuthHandler] = useState(defaultAuthHandler);
  const router = useRouter();
  const { isLoading, supabaseClient } = useSessionContext();
  const user = useUser();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");

  useEffect(() => {
    if (user) router.push(redirectTo);
  }, [user]);

  const sendOtp = async (e) => {
    if (e) e.preventDefault();

    setAuthHandler({ ...defaultAuthHandler, loading: true });

    const args = {
      email,

      options: {
        emailRedirectTo: window.location.origin + redirectTo,
      },
    };

    if (method === "signUp") args.password = password;

    try {
      const { error } = await supabaseClient.auth[method](args);
      if (error) throw new Error(error.message);
      return setAuthHandler({
        ...defaultAuthHandler,
        confirmPage: true,
      });
    } catch (error) {
      return setAuthHandler({
        ...defaultAuthHandler,
        msg: error.message,
      });
    }
  };

  const verifyOtp = async (otpValue) => {
    setAuthHandler({
      ...defaultAuthHandler,
      loading: true,
      confirmPage: true,
    });

    try {
      const { error } = await supabaseClient.auth.verifyOtp({
        email,
        token: otpValue,
        type: "email",
      });
      if (error) throw new Error(error.message);
      router.push(redirectTo);
      return setAuthHandler({ ...defaultAuthHandler, confirmPage: true });
    } catch (error) {
      return setAuthHandler({
        ...defaultAuthHandler,
        confirmPage: true,
        msg: error.message || "Sorry, there was a problem.",
      });
    }
  };

  if (!user && !isLoading)
    return (
      <div className="space-y-4">
        <h1 className="font-brand text-4xl font-bold italic text-tfm-primary">
          {heading}
        </h1>
        <p className="text-gray-500">
          {authHandler.confirmPage
            ? `We've sent you a code via email to ${email}, please enter it below:`
            : initialInstructions}
        </p>
        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault();
            if (authHandler.confirmPage) {
              verifyOtp(code);
            } else {
              sendOtp(e);
            }
          }}
        >
          {authHandler.confirmPage ? (
            <OTPInput
              onVerify={verifyOtp}
              disabled={authHandler.loading}
              onChange={setCode}
            />
          ) : (
            <>
              <TfmInput
                id="email"
                label="Enter your Email Address"
                type="email"
                placeholder="name@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              {method === "signUp" && (
                <>
                  <TfmInput
                    id="password"
                    label="Choose a Password"
                    type="password"
                    autoComplete="new-password"
                    value={password}
                    placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <TfmCheckbox
                    id="terms"
                    label="I agree to the terms of service and privacy policy"
                    required
                  >
                    {"By creating a free account, I accept TFM's "}
                    <Link
                      href="/client-waiver"
                      className="text-tfm-primary"
                      target="_blank"
                    >
                      Terms of Service
                    </Link>
                    {" and acknowledge the "}
                    <Link
                      href="/privacy-policy"
                      className="text-tfm-primary"
                      target="_blank"
                    >
                      Privacy Policy
                    </Link>
                    .
                  </TfmCheckbox>
                </>
              )}
            </>
          )}
          <Transition
            show={authHandler.msg ? true : false}
            enter="transition-opacity duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="transition-opacity duration-300"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <ErrorBox msg={authHandler.msg} success={authHandler.success} />
          </Transition>
          <Button
            type="submit"
            fullWidth
            loading={authHandler.loading}
            Icon={
              authHandler.confirmPage
                ? CheckCircleIcon
                : method === "signUp"
                ? UserPlusIcon
                : InboxIcon
            }
            primary
          >
            {authHandler.confirmPage
              ? "Verify"
              : method === "signUp"
              ? "Continue"
              : "Email me a passcode"}
          </Button>
        </form>
        {!authHandler.confirmPage && !hideLink && (
          <AuthPageLink text={link.text} url={link.url} arrow={link.arrow} />
        )}
      </div>
    );

  return (
    <div className="flex justify-center px-4 pb-12 pt-48 text-gray-400">
      <Spinner />
    </div>
  );
}
