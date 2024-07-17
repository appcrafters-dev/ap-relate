"use client";

import Modal from "@/app/(dashboard-pages)/components/modal";
import { Button } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import { BanknotesIcon } from "@heroicons/react/24/solid";
import relateAPI from "lib/relate-api-client";
import { moneyFormat } from "lib/utils";
import { useState } from "react";

export default function RunPayments({
  totalPaymentsDue = 0,
  stripeBalance = 0,
}) {
  const [open, setOpen] = useState(false);
  const [handlerState, setHandlerState] = useState({
    loading: false,
    error: null,
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHandlerState({ loading: true, error: null });
    // check if the total payment due is less than the stripe balance
    // if it is, then we can't run payments
    if (totalPaymentsDue > stripeBalance) {
      setHandlerState({
        loading: false,
        error:
          "Stripe balance is less than the total payment due. Please top up the balance first.",
      });
      return;
    }

    const { error } = await relateAPI.post("/stripe/run-payments");

    if (error) {
      setHandlerState({
        loading: false,
        error: error.message || "Something went wrong, please try again later.",
      });
    } else {
      setOpen(false);
      window.location.reload();
    }
  };

  return (
    <>
      <Button primary Icon={BanknotesIcon} onClick={() => setOpen(true)}>
        Run Payments
      </Button>
      <Modal open={open} setOpen={setOpen}>
        {handlerState.error ? (
          <div className="space-y-4 p-4 text-center">
            <ErrorBox msg={handlerState.error} />
            <Button onClick={() => setOpen(false)}>Cancel</Button>
          </div>
        ) : (
          <form className="space-y-4 p-4 text-center" onSubmit={handleSubmit}>
            <h3 className="font-subheading text-lg font-semibold uppercase text-red-600">
              Are you sure you want to proceed?
            </h3>
            <p className="mx-auto max-w-sm">
              This will create payments for all payout-enabled coaches with
              outstanding balances and transfer{" "}
              <b>{moneyFormat(totalPaymentsDue)}</b> from TFM&apos;s Stripe
              Balance to their connected accounts. It cannot be undone.
            </p>
            <Button
              type="submit"
              Icon={BanknotesIcon}
              loading={handlerState.loading}
              primary
              fullWidth
            >
              Yes, pay them now!
            </Button>
          </form>
        )}
      </Modal>
    </>
  );
}
