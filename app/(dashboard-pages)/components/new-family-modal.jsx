"use client";

import { useState } from "react";
import {
  TfmFormColumns,
  TfmFormHeading,
  TfmFormSelect,
  TfmInput,
} from "@/components/ui/forms";
import { ErrorBox } from "@/components/ui/errors";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/buttons";
import { UserPlusIcon } from "@heroicons/react/24/solid";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { FamilyBillingMethod } from "lib/models/enums";
import Modal from "./modal";

export default function NewFamilyModal({
  partnerId = null,
  lifePhases = [],
  partners = [],
}) {
  const [open, setOpen] = useState(false);
  const router = useRouter();
  const supabase = getSupabaseClientComponentClient();

  const [form, setForm] = useState({
    life_phase_id: "",
    family_name: "",
    billing_method: partnerId ? FamilyBillingMethod.Partner : "",
    partner_id: partnerId ? partnerId : "",
    first_name1: "",
    last_name1: "",
    email1: "",
    first_name2: "",
    last_name2: "",
    email2: "",
  });

  const [handlerState, setHandlerState] = useState({
    loading: false,
    error: null,
  });

  const updateForm = (k, v) => setForm({ ...form, [k]: v });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setHandlerState({ loading: true, error: null });

    const { data, error } = await supabase.client.rpc(
      "invite_new_family",
      Object.fromEntries(Object.entries(form).map(([k, v]) => [k, v || null]))
    );

    console.log("invite_new_family", { data, error });

    if (error) {
      setHandlerState({
        loading: false,
        error: error.message.includes("duplicate key")
          ? "Sorry, it looks like this family already exists. Please contact support if you need help."
          : error.message,
      });
    } else {
      console.log("data", data);

      await fetch("/api/notifications/first-email-invite", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          new_family_id: data[0]?.new_family_id,
        }),
      });

      setHandlerState({ loading: false, error: null });
      router.replace(
        partnerId
          ? "/partners/families"
          : data && data[0].new_family_id
          ? `/family/${data[0].new_family_id}`
          : "/family/list"
      );
      setOpen(false);
    }
  };

  return (
    <>
      <div className="my-6 text-center">
        <Button onClick={() => setOpen(true)} Icon={UserPlusIcon} primary>
          Add Family
        </Button>
      </div>
      <Modal open={open} setOpen={setOpen}>
        <form className="space-y-4 p-4 sm:p-6" onSubmit={handleSubmit}>
          <TfmFormHeading>Add a Family</TfmFormHeading>
          {partnerId && (
            <p className="text-sm text-gray-500">
              You will be billed for this family as part of your agreement with
              TFM.
            </p>
          )}
          <TfmInput
            id="family_name"
            label="Family Name"
            value={form.family_name}
            onChange={(e) => updateForm("family_name", e.target.value)}
            required
          />
          <TfmFormSelect
            id="life_phase_id"
            label="Life Phase"
            value={form.life_phase_id}
            onChange={(e) => updateForm("life_phase_id", e.target.value)}
            required
          >
            <option></option>
            {lifePhases.map((phase) => (
              <option key={phase.id} value={phase.id}>
                {phase.title}
              </option>
            ))}
          </TfmFormSelect>
          {!partnerId && (
            <TfmFormColumns>
              <TfmFormSelect
                label="Billing Method"
                id="billing_method"
                value={form.billing_method}
                onChange={(e) => updateForm("billing_method", e.target.value)}
              >
                <option value={null} />
                {Object.values(FamilyBillingMethod).map((method) => (
                  <option key={method} value={method}>
                    {method}
                  </option>
                ))}
              </TfmFormSelect>
              {form.billing_method === FamilyBillingMethod.Partner && (
                <TfmFormSelect
                  label="Partner"
                  id="partner_id"
                  value={form.partner_id}
                  onChange={(e) => updateForm("partner_id", e.target.value)}
                >
                  <option value={null} />
                  {partners.map((partner) => (
                    <option key={partner.id} value={partner.id}>
                      {partner.company_legal_name}
                    </option>
                  ))}
                </TfmFormSelect>
              )}
            </TfmFormColumns>
          )}
          <TfmFormHeading>Heads of Household</TfmFormHeading>
          <p className="text-sm text-gray-500">
            Each Head of Household will receive an invitation to onboard through
            the TFM platform. Enter at least one spouse below.
          </p>
          <TfmFormColumns>
            <TfmInput
              label="First Name"
              id="first_name1"
              value={form.first_name1}
              onChange={(e) => updateForm("first_name1", e.target.value)}
              required
            />
            <TfmInput
              label="Last Name"
              id="last_name1"
              value={form.last_name1}
              onChange={(e) => updateForm("last_name1", e.target.value)}
              required
            />
          </TfmFormColumns>
          <TfmInput
            label="Email"
            id="email1"
            type="email"
            value={form.email1}
            onChange={(e) => updateForm("email1", e.target.value)}
            required
          />
          <hr />
          <TfmFormColumns>
            <TfmInput
              label="First Name"
              id="first_name2"
              value={form.first_name2}
              onChange={(e) => updateForm("first_name2", e.target.value)}
            />
            <TfmInput
              label="Last Name"
              id="last_name2"
              value={form.last_name2}
              onChange={(e) => updateForm("last_name2", e.target.value)}
            />
          </TfmFormColumns>
          <TfmInput
            label="Email"
            id="email2"
            type="email"
            value={form.email2}
            onChange={(e) => updateForm("email2", e.target.value)}
          />
          {handlerState.error && <ErrorBox msg={handlerState.error} />}
          <Button
            type="submit"
            loading={handlerState.loading}
            Icon={UserPlusIcon}
            fullWidth
            primary
          >
            Invite Family
          </Button>
          <Button fullWidth onClick={() => setOpen(false)}>
            Cancel
          </Button>
        </form>
      </Modal>
    </>
  );
}
