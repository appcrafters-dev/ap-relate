"use client";

import Modal from "@/app/(dashboard-pages)/components/modal";
import { Button } from "@/components/ui/buttons";
import { TfmFormHeading, TfmFormSelect, TfmInput } from "@/components/ui/forms";
import { PlusIcon } from "@heroicons/react/20/solid";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { moneyFormat } from "lib/utils";
import { useState } from "react";

export default function AddManualTransaction({
  coaches,
  preselectedCoach = null,
}) {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    amount: 0,
    coach_id: preselectedCoach ? preselectedCoach.id : "",
    description: "",
  });
  const getCoach = (id) => coaches.find((coach) => coach.id === id) || {};
  const [handlerState, setHandlerState] = useState({
    loading: false,
    error: null,
  });
  const supabase = getSupabaseClientComponentClient();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHandlerState({ loading: true, error: null });
    const { data, error } = await supabase.client
      .from("coach_payments")
      .insert(form);
    console.log("coach_payments insert", { data, error });
    if (error) {
      setHandlerState({
        loading: false,
        error: error.message,
      });
    } else {
      setOpen(false);
      window.location.reload();
    }
  };
  return (
    <>
      <Button extraSmall primary Icon={PlusIcon} onClick={() => setOpen(true)}>
        Add Manual Transaction
      </Button>
      <Modal open={open} setOpen={setOpen}>
        <form className="space-y-4 p-4" onSubmit={handleSubmit}>
          <TfmFormHeading>Add Manual Transaction</TfmFormHeading>
          <p className="text-base text-gray-600">
            This form will add a transaction to pay{" "}
            <b>
              {getCoach(form.coach_id).first_name}{" "}
              {getCoach(form.coach_id).last_name}
            </b>{" "}
            an additional <b>{moneyFormat(form.amount)}</b> for something which
            is not currently automated.
          </p>
          <TfmFormSelect
            id="coach_id"
            label="Coach"
            value={form.coach_id}
            onChange={(e) => setForm({ ...form, coach_id: e.target.value })}
            required
          >
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.first_name} {coach.last_name}
              </option>
            ))}
          </TfmFormSelect>
          <TfmInput
            id="amount"
            label="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
            required
          />
          <TfmInput
            id="description"
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            required
          />
          <div className="flex justify-end space-x-4">
            <Button small onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button
              small
              type="submit"
              primary
              Icon={PlusIcon}
              loading={handlerState.loading}
            >
              Add Transaction
            </Button>
          </div>
        </form>
      </Modal>
    </>
  );
}
