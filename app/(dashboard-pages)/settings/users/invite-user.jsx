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
import Modal from "../../components/modal";

export default function InviteUserModal({ partnerId }) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    email: "",
    occupation: "",
    role: "Partner Advisor",
    partner_id: partnerId,
  });
  const [handlerState, setHandlerState] = useState({
    loading: false,
    error: null,
  });
  const supabase = getSupabaseClientComponentClient();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setHandlerState({ loading: true, error: null });
    if (Object.values(form).some((v) => !v)) {
      return setHandlerState({
        loading: false,
        error: "Please fill out all fields.",
      });
    }

    const { data, error } = await supabase.client.rpc("insert_partner_member", {
      ...form,
      phone: "",
    });
    console.log({ data, error });
    if (error) {
      setHandlerState({
        loading: false,
        error: error.message.includes("duplicate key")
          ? "Sorry, it looks like this user already exists. Please contact support if you need help."
          : error.message,
      });
    }
    if (data) {
      setHandlerState({ loading: false, error: null });
      setOpen(false);
      router.refresh();
    }
  };

  return (
    <>
      <div className="my-6 text-center">
        <Button onClick={() => setOpen(true)} Icon={UserPlusIcon} primary>
          Invite User
        </Button>
      </div>
      <Modal open={open} setOpen={setOpen}>
        <form className="space-y-4 p-4 sm:p-6" onSubmit={handleSubmit}>
          <TfmFormHeading>Invite a new user</TfmFormHeading>
          <TfmFormColumns>
            <TfmInput
              label="First Name"
              id="first_name"
              value={form.first_name}
              onChange={(e) => setForm({ ...form, first_name: e.target.value })}
              required
            />
            <TfmInput
              label="Last Name"
              id="last_name"
              value={form.last_name}
              onChange={(e) => setForm({ ...form, last_name: e.target.value })}
              required
            />
          </TfmFormColumns>
          <TfmInput
            label="Email"
            id="email"
            type="email"
            value={form.email}
            required
            onChange={(e) =>
              setForm({
                ...form,
                email: e.target.value,
              })
            }
          />
          <TfmInput
            label="Title"
            id="occupation"
            value={form.occupation}
            onChange={(e) => setForm({ ...form, occupation: e.target.value })}
            required
          />
          <TfmFormSelect
            label="Role"
            id="role"
            value={form.role}
            onChange={(e) =>
              setForm({
                ...form,
                role: e.target.value,
              })
            }
            helpText={
              form.role === "Partner Admin" ? (
                <p className="text-xs text-red-600">
                  Partner Admins have full read-and-write access to the partner
                  account, including editing all settings, managing users, and
                  billing. You may designate multiple Admin users, however, we
                  do not recommend it.
                </p>
              ) : (
                <p className="text-xs text-gray-500">
                  Partner Advisors have view-only access to the partner account,
                  and cannot make changes to settings or billing.
                </p>
              )
            }
            required
          >
            <option value={"Partner Advisor"}>Advisor</option>
            <option value={"Partner Admin"}>Admin</option>
          </TfmFormSelect>
          {handlerState.error && <ErrorBox msg={handlerState.error} />}
          <Button
            type="submit"
            loading={handlerState.loading}
            Icon={UserPlusIcon}
            primary
            fullWidth
          >
            Invite User
          </Button>
          <Button onClick={() => setOpen(false)} fullWidth>
            Cancel
          </Button>
        </form>
      </Modal>
    </>
  );
}
