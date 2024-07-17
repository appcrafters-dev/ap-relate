"use client";

import { useRouter } from "next/navigation";
import { useSessionContext } from "@supabase/auth-helpers-react";
import { TfmInput } from "@/components/ui/forms";
import Spinner from "@/components/ui/spinner";
import { useState } from "react";
import { ErrorBox } from "@/components/ui/errors";
import { Transition } from "@headlessui/react";

export default function Invitation({ family, code }) {
  const router = useRouter();

  const { supabaseClient } = useSessionContext();

  const [authHandler, setAuthHandler] = useState({
    loading: false,
    error: null,
  });

  const handleSignup = async (e) => {
    e.preventDefault();
    setAuthHandler({ loading: true, error: null });
    const { email, password } = e.target.elements;

    // const { data: user, error } = await supabaseClient.auth.signUp({
    //   email: email.value,
    //   password: password.value,
    // });

    const createUser = await fetch("/api/create-supa-user/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: email.value,
        password: password.value,
        invite_code: code,
      }),
    });

    if (createUser.status === 200) {
      // sign in the user
      const { data: user, error } =
        await supabaseClient.client.auth.signInWithPassword({
          email: email.value,
          password: password.value,
        });
      if (error) {
        return setAuthHandler({
          loading: false,
          error: error.message,
        });
      } else if (user) {
        setAuthHandler({ loading: false, error: null });
        router.push("/dashboard");
      } else {
        setAuthHandler({
          loading: false,
          error: "Something went wrong. Please try again.",
        });
      }
    } else {
      const res = await createUser.json();
      setAuthHandler({
        loading: false,
        error: res?.error?.message,
      });
    }

    // if (error) {
    //   setAuthHandler({
    //     loading: false,
    //     error: error.message,
    //   });
    //   console.log(error);
    //   return;
    // }
  };

  return (
    <>
      <div className="space-y-2 text-center font-brand font-semibold text-tfm-primary-900">
        <h1 className="text-4xl">
          Welcome to TFM, <br />
          {family.family_name} Family!
        </h1>
        <h2 className="uppercase tracking-wider text-gray-500">
          Here&lsquo;s what to expect
        </h2>
      </div>
      <article className="prose mx-auto font-brand text-gray-500">
        <ol>
          <li>
            <h3 className="uppercase tracking-wide text-tfm-primary">
              Who is TFM?
            </h3>
            <p>
              Our company{"'"}s &quot;why&quot; is to show up and help families.
              Because every great team needs a coach. Our coaches are
              intelligent, empathetic, subject matter experts with diverse
              backgrounds, many in mental health.
            </p>
          </li>
          <li>
            <h3 className="uppercase tracking-wide text-tfm-primary">
              What is the time commitment?
            </h3>
            <ul>
              <li>(8) virtual sessions</li>
              <li>90 minutes each</li>
            </ul>
          </li>
          <li>
            <h3 className="uppercase tracking-wide text-tfm-primary">
              What are sessions like?
            </h3>
            <ul>
              <li>Family Welcome</li>
              <li>Vision</li>
              <li>Values</li>
              <li>Social Fitness</li>
              <li>Communication</li>
              <li>Rituals</li>
              <li>Favorite Things</li>
              <li>Meant to Live</li>
            </ul>
          </li>
          <li>
            <h3 className="uppercase tracking-wide text-tfm-primary">
              What is the goal?
            </h3>
            <p>
              To apply an intentional strategy to the most valuable asset in
              your life. Your family.
            </p>
          </li>
        </ol>
      </article>
      <div className="space-y-2 text-center font-brand font-semibold text-tfm-primary-900">
        <h3 className="text-2xl">Ready? Let&lsquo;s go!</h3>
        <p className="mx-auto max-w-xs text-gray-500">
          Create an account to access our client experience platform.
        </p>

        <div className="mx-auto max-w-md space-y-4 pb-12 pt-4 text-left">
          <form className="space-y-4" onSubmit={handleSignup}>
            <TfmInput
              id="email"
              label="Enter your email address"
              type="email"
              placeholder="name@email.com"
              required
            />
            <TfmInput
              id="password"
              label="Choose a strong password"
              type="password"
              placeholder="password"
              required
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
            <button
              type="submit"
              className="w-full rounded bg-tfm-primary px-4 py-2 font-sans font-semibold text-white hover:bg-tfm-primary-900"
            >
              {authHandler.loading && <Spinner />}
              {authHandler.loading ? (
                <span className="pl-1">Creating your account...</span>
              ) : (
                <span>Get started &rarr;</span>
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
}
