"use client";
import { useUser, useSessionContext } from "@supabase/auth-helpers-react";
import { useState } from "react";
import Spinner from "@/components/ui/spinner";
import { ErrorBox } from "@/components/ui/errors";
import { TfmInput } from "@/components/ui/forms";
import { Transition } from "@headlessui/react";
import { Button, LinkButton } from "@/components/ui/buttons";
import { HomeIcon, LockClosedIcon } from "@heroicons/react/20/solid";

export default function ResetPassword() {
  const { isLoading, error, supabaseClient } = useSessionContext();
  const user = useUser();

  const [authHandler, setAuthHandler] = useState({
    loading: false,
    msg: null,
    success: false,
  });

  const handleReset = async (e) => {
    e.preventDefault();
    setAuthHandler({ loading: true, msg: null, success: false });
    const { password } = e.target.elements;

    const { data, error } = await supabaseClient.auth.updateUser({
      password: password.value,
    });

    if (data) {
      setAuthHandler({
        loading: false,
        msg: "Password updated successfully.",
        success: true,
      });
      return;
    }

    if (error) {
      return setAuthHandler({
        loading: false,
        msg: error.message,
        success: false,
      });
    }
    return setAuthHandler({ loading: false, msg: null, success: true });
  };

  if (!isLoading && user)
    return (
      <div className="space-y-4">
        <h1 className="font-brand text-4xl font-bold italic text-tfm-primary">
          Reset Password
        </h1>
        <form className="space-y-4" onSubmit={handleReset}>
          {authHandler.success ? null : (
            <TfmInput
              id="password"
              label="New Password"
              type="password"
              placeholder="&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;&bull;"
              required
            />
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
          {authHandler.success ? (
            <LinkButton href="/dashboard" fullWidth primary Icon={HomeIcon}>
              Return to Dashboard
            </LinkButton>
          ) : (
            <Button
              type="submit"
              fullWidth
              loading={authHandler.loading}
              Icon={LockClosedIcon}
              primary
            >
              Reset Password
            </Button>
          )}
        </form>
      </div>
    );

  return (
    <div className="flex justify-center px-4 pb-12 pt-48 text-gray-400">
      {error ? (
        <ErrorBox msg={error.message || "Sorry, there was a problem."} />
      ) : (
        <Spinner />
      )}
    </div>
  );
}
