"use client";

import { PaperAirplaneIcon } from "@heroicons/react/20/solid";
import { Button } from "./ui/buttons";
import { TfmFormSelect, TfmInput, TfmTextArea } from "./ui/forms";
import { useForm, ValidationError } from "@formspree/react";
import { ErrorBox } from "./ui/errors";

export default function ContactForm({
  title = "Let's talk",
  subTitle = "Tell us about your company and someone from our team will get back to you shortly.",
}) {
  const [state, handleSubmit] = useForm("mnqepleb");

  return (
    <div className="bg-transparent" id="contact">
      <div className="mx-auto max-w-4xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <div className="relative rounded bg-white shadow">
          <h2 className="sr-only">Contact us</h2>
          <div className="px-6 py-10 sm:px-10 lg:col-span-2 xl:p-12">
            <h3 className="font-brand text-4xl text-tfm-primary sm:text-5xl">
              {title}
            </h3>
            <p className="mt-2 text-base text-gray-500">{subTitle}</p>
            <form
              className="mt-6 grid grid-cols-1 gap-y-6 sm:grid-cols-2 sm:gap-x-8"
              onSubmit={handleSubmit}
            >
              <TfmInput
                label="First name"
                id="first-name"
                autoComplete="given-name"
                required
              />
              <TfmInput
                label="Last name"
                id="last-name"
                autoComplete="family-name"
                required
              />
              <TfmInput
                id="email"
                type="email"
                autoComplete="email"
                label="Email"
                required
              />
              <TfmFormSelect
                id="inquiry-type"
                label="How can we help?"
                required
              >
                <option></option>
                <option value="General Inquiry">General Inquiry</option>
                <option value="Sales">Sales</option>
                <option value="Client Support">Client Support</option>
                <option value="PR/Marketing/Events">PR/Marketing/Events</option>
              </TfmFormSelect>
              <div className="sm:col-span-2">
                <TfmTextArea id="message" label="Message" required />
              </div>
              <div className="sm:col-span-2">
                <Button
                  type="submit"
                  primary
                  Icon={PaperAirplaneIcon}
                  loading={state.submitting}
                >
                  Submit
                </Button>
              </div>
              {state.succeeded && (
                <div className="sm:col-span-2">
                  <ErrorBox
                    success={true}
                    msg="Success! Thanks for contacting us, we'll reach out as soon as possible."
                  />
                </div>
              )}
              <ValidationError errors={state.errors} />
            </form>
          </div>
        </div>
      </div>
    </div>
  );
}
