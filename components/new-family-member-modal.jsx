"use client";

import { Fragment, useEffect, useRef, useState } from "react";
import { Dialog, Transition } from "@headlessui/react";
import {
  TfmAvatarUploader,
  TfmFormHeading,
  TfmFormSelect,
  TfmInput,
} from "@/components/ui/forms";
import { ErrorBox } from "@/components/ui/errors";

import { phoneFormat } from "lib/utils";
import { fields } from "lib/family-member-fields";
import { useParams, useRouter } from "next/navigation";
import { FamilyMemberType } from "lib/models/enums";
import {
  getCurrentUser,
  getSupabaseClientComponentClient,
} from "lib/supabase/supabase.client";
import { Button } from "./ui/buttons";

const FAMILY_MEMBER_TYPE_ENDPOINT_SLUGS = {
  [FamilyMemberType.HeadOfHouseHold]: "family-members",
  [FamilyMemberType.Child]: "family-members",
  [FamilyMemberType.Pet]: "pets",
};

function upsertFamilyMember(body, id = null) {
  const supabase = getSupabaseClientComponentClient();
  const requestBody = {
    avatar_url: body.avatar_url || null,
    birth_date: body.birth_date || null,
    child_living_at_home: body.child_living_at_home || null,
    email: body.email || null,
    family_id: body.family_id,
    family_member_id: id,
    first_name: body.first_name || null,
    is_child: body.is_child,
    last_name: body.last_name || null,
    occupation: body.occupation || null,
    partner_spouse_id: body.partner_spouse_id || null,
    phone: body.phone || null,
    relationship_anniversary: body.relationship_anniversary || null,
    relationship_status: body.relationship_status || null,
  };

  return supabase.client.rpc("upsert_family_member", requestBody);
}

function upsertPet(body, id = null) {
  const supabase = getSupabaseClientComponentClient();
  return supabase.client.from("pets").upsert({
    id,
    ...body,
  });
}

function upsertMember(familyId, memberType, body, memberId = null) {
  const endpointSlug = FAMILY_MEMBER_TYPE_ENDPOINT_SLUGS[memberType];

  if (!endpointSlug) {
    throw new Error(`Invalid member type: ${memberType}`);
  }

  if (memberType === FamilyMemberType.Pet) {
    body = {
      name: body.name,
      birth_date: body.birth_date,
      type: body.type,
      breed: body.breed,
      avatar_url: body.avatar_url,
      family_id: familyId,
    };

    return upsertPet(body, memberId);
  }

  return upsertFamilyMember({ ...body, family_id: familyId }, memberId);
}

export default function FamilyMemberModal({
  open,
  setOpen,
  memberType,
  member = null,
  // TODO: Remove this props after checking
  memberList = [],
  setMemberList = null,
  familyId = null,
}) {
  const router = useRouter();
  const params = useParams();

  const cancelButtonRef = useRef(null);

  const memberTypeFields = fields[memberType];

  const memberFields = member
    ? Object.keys(member).reduce((acc, key) => {
        if (memberTypeFields.find((field) => field.name === key)) {
          acc[key] = member[key];
        }
        return acc;
      }, {})
    : {};

  const [form, setForm] = useState({
    id: member?.id,
    is_child: memberType === FamilyMemberType.Child,
    ...memberFields,
  });
  const [handlerState, setHandlerState] = useState({
    loading: false,
    error: false,
    error_msg: null,
  });

  useEffect(() => {
    setForm({
      id: member?.id,
      is_child: memberType === FamilyMemberType.Child,
      ...memberFields,
    });
  }, [open]);

  const handleUpsertMember = async (event) => {
    event.preventDefault();
    setHandlerState({ loading: true, error: false, error_msg: null });

    if (
      memberTypeFields.some((field) => {
        const required =
          typeof field.required === "function"
            ? field.required(form)
            : field.required;
        required && !form[field.name];
      })
    ) {
      setHandlerState({
        loading: false,
        error: true,
        error_msg: "Please complete the required fields.",
      });
      return;
    }

    const user = await getCurrentUser();

    const { data, error } = await upsertMember(
      member ? member.family_id : familyId || user.family.id,
      memberType,
      form,
      params.name
    );

    if (error) {
      return setHandlerState({
        loading: false,
        error: true,
        error_msg: error.message,
      });
    }

    setHandlerState({ loading: false, error: false, error_msg: null });
    setForm({});
    setOpen(false);

    // TODO: handle this better
    window.location.reload();

    if (member) {
      return router.refresh();
    } else {
      return setMemberList([...memberList, data]);
    }
  };

  function renderFormField(field) {
    if (field.dependsOn && !field.dependsOn(form)) {
      return null;
    }

    const required =
      typeof field.required === "function"
        ? field.required(form)
        : field.required;

    if (field.type === "select") {
      let options = field.options || [];

      if (field.name === "partner_spouse_id") {
        options = memberList.map((m) => ({
          label: `${m.first_name} ${m.last_name}`,
          value: m.id,
        }));
      }

      return (
        <TfmFormSelect
          key={field.name}
          label={field.label}
          id={field.name}
          required={required}
          helpText={
            handlerState.error && required && !form[field.name] ? (
              <span className="text-red-500">{field.label} is required</span>
            ) : null
          }
          value={form[field.name] || ""}
          onChange={(e) => setForm({ ...form, [field.name]: e.target.value })}
        >
          <option></option>
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </TfmFormSelect>
      );
    }

    if (
      field.type === "text" ||
      field.type === "date" ||
      field.type === "phone" ||
      field.type === "email"
    ) {
      return (
        <TfmInput
          key={field.name}
          {...field}
          helpText={
            handlerState.error && required && !form[field.name] ? (
              <span className="text-red-500">{field.label} is required</span>
            ) : null
          }
          type={field.type === "email" ? "email" : "text"}
          value={form[field.name] || ""}
          onChange={(e) => {
            setForm({
              ...form,
              [field.name]:
                field.type === "phone"
                  ? phoneFormat(e.target.value)
                  : e.target.value,
            });
          }}
        />
      );
    }

    if (field.type === "avatar") {
      return (
        <TfmAvatarUploader
          src={form[field.name]}
          setSrc={(src) => setForm({ ...form, [field.name]: src })}
          fileName={`${memberType}-avatar-${member?.id}`}
        />
      );
    }

    return null;
  }

  return (
    <Transition.Root show={open} as={Fragment}>
      <Dialog
        as="div"
        className="relative z-10"
        initialFocus={cancelButtonRef}
        onClose={setOpen}
      >
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-500"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-300"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-10 overflow-y-auto">
          <div className="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-500"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-300"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative w-full transform overflow-hidden rounded bg-white text-left shadow-xl transition-all sm:my-8 sm:max-w-lg">
                <div className="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
                  <TfmFormHeading>
                    {member ? "Update " : "Add a new "} {memberType}
                  </TfmFormHeading>
                  <div className="mt-8 space-y-4">
                    {memberTypeFields.map((field) => renderFormField(field))}
                  </div>
                </div>
                {handlerState.error && (
                  <div className="p-4 sm:p-6">
                    <ErrorBox msg={handlerState.error_msg} />
                  </div>
                )}
                <div className="space-y-4 bg-gray-50 px-4 py-3 sm:px-6">
                  <Button
                    fullWidth
                    primary
                    onClick={handleUpsertMember}
                    disabled={handlerState.loading}
                    loading={handlerState.loading}
                  >
                    {member ? "Update " : "Add a new "} {memberType}
                  </Button>
                  <Button fullWidth onClick={() => setOpen(false)}>
                    Cancel
                  </Button>
                </div>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
}
