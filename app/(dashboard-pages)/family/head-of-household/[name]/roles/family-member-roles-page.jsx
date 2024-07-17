"use client";
import {
  TfmFormHeading,
  TfmFormSelect,
  TfmInput,
  TfmTextArea,
} from "@/components/ui/forms";
import UpDownButtons, { Button } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import { useState } from "react";
import Spinner from "@/components/ui/spinner";
import { LockClosedIcon, PlusIcon } from "@heroicons/react/20/solid";
import { groupBy } from "lib/utils";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";

function upsertRoles(body) {
  const supabase = getSupabaseClientComponentClient();
  return supabase.client.from("family_member_roles").upsert(body);
}

export default function FamilyVision({ familyMember, allRoles }) {
  const [formState, setFormState] = useState({
    loading: false,
    msg: null,
    success: false,
  });

  const [memberRoles, setMemberRoles] = useState(
    familyMember.vision?.roles || []
  );

  const [familyForm, setFamilyForm] = useState({
    completed_on: familyMember.vision?.completed_on || "",
    family_member: familyMember.id,
  });

  const role_types = allRoles?.sort();

  const rolesById = groupBy(allRoles, "id");

  const moveRole = (idx, direction) => {
    if (idx < 0 || idx >= memberRoles.length) return;
    setMemberRoles((prevValues) => {
      const newFamilyVision = [...prevValues];
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      [newFamilyVision[idx], newFamilyVision[newIdx]] = [
        newFamilyVision[newIdx],
        newFamilyVision[idx],
      ];
      return newFamilyVision;
    });
  };

  const isDateCompletedInFuture = () => {
    const dateCompleted = new Date(familyForm.completed_on);
    const today = new Date();
    return dateCompleted >= today;
  };

  const handleChange = (event, idx) => {
    const { name, value } = event.target;
    const newFamilyVision = [...memberRoles];
    newFamilyVision[idx][name] = value;
    setMemberRoles(newFamilyVision);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ loading: true, msg: null, success: false });

    if (isDateCompletedInFuture()) {
      setFormState({
        loading: false,
        msg: "Date Completed cannot be in the future. Select a date in the past, or today's date.",
        success: false,
      });
      return;
    }

    const body = {
      family_member_id: familyMember.id,
      completed_on: familyForm.completed_on,
      roles: memberRoles.map(({ role_id, success_definition }) => ({
        role_id: role_id,
        role_title: rolesById[role_id].title,
        success_definition,
      })),
    };

    const { error } = await upsertRoles(body);

    if (error) {
      return setFormState({
        loading: false,
        msg: error,
        success: false,
      });
    }

    setFormState({
      loading: false,
      msg: "Roles saved successfully",
      success: true,
    });
  };

  return (
    <form className="mx-auto max-w-3xl space-y-4" onSubmit={handleSubmit}>
      <TfmFormHeading>
        {familyMember.first_name + "'s " || ""}Family Vision
      </TfmFormHeading>
      <TfmInput
        id="date_completed"
        label="Date Completed"
        value={familyForm.completed_on}
        onChange={(e) =>
          setFamilyForm({ ...familyForm, completed_on: e.target.value })
        }
        helpText={
          familyForm.completed_on &&
          isDateCompletedInFuture() && (
            <span className="text-red-500">
              Date completed must be in the past. Please update the date.
            </span>
          )
        }
        type="date"
        required
      />
      <ol className="space-y-6 divide-y">
        {memberRoles.map((value, idx) => (
          <VisionItem
            key={idx}
            value={value}
            idx={idx}
            role_types={role_types}
            handleChange={handleChange}
            moveRole={moveRole}
            familyVision={memberRoles}
            setFamilyVision={setMemberRoles}
          />
        ))}
      </ol>

      {(!memberRoles.length || memberRoles[memberRoles.length - 1].role_id) && (
        <Button
          type="button"
          onClick={() =>
            setMemberRoles([
              ...memberRoles,
              {
                role_id: null,
                role_title: null,
                success_definition: null,
              },
            ])
          }
        >
          <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          Add {!memberRoles.length ? "first" : "another"} Value
        </Button>
      )}
      {memberRoles.length > 0 &&
        memberRoles[memberRoles.length - 1].role_id && (
          <Button type="submit" primary disabled={formState.loading}>
            {!formState.loading && (
              <LockClosedIcon
                className="-ml-1 mr-2 h-4 w-4"
                aria-hidden="true"
              />
            )}
            {formState.loading ? <Spinner /> : "Save Family Vision"}
          </Button>
        )}
      {formState.msg && (
        <ErrorBox
          msg={formState.msg}
          success={formState.success ? true : false}
        />
      )}
    </form>
  );
}

const VisionItem = ({
  value,
  idx,
  role_types,
  handleChange,
  moveRole,
  familyVision,
  setFamilyVision,
}) => {
  return (
    <li key={idx} className="grid gap-3 pt-6 lg:flex lg:gap-6">
      <div className="lg:max-w-[12.5rem]">
        <TfmFormSelect
          id="role_id"
          label={"Role #" + (idx + 1)}
          value={value.role_id}
          onChange={(e) => handleChange(e, idx)}
        >
          <option></option>
          {role_types.map(({ id, title }) => (
            <option key={id} value={id}>
              {title}
            </option>
          ))}
        </TfmFormSelect>
      </div>

      <div className="flex-grow">
        <TfmTextArea
          id="success_definition"
          label="Success Definition"
          rows={4}
          value={value.success_definition}
          onChange={(e) => handleChange(e, idx)}
        />
      </div>

      <div className="flex flex-col items-center justify-center space-y-3 text-center">
        <UpDownButtons
          upDisabled={idx === 0}
          downDisabled={idx === familyVision.length - 1}
          upOnChange={() => moveRole(idx, "up")}
          downOnChange={() => moveRole(idx, "down")}
        />
        <button
          type="button"
          className="-mr-px font-accent text-xs uppercase tracking-wider text-tfm-primary hover:underline"
          onClick={() => {
            const newFamilyVision = [...familyVision];
            newFamilyVision.splice(idx, 1);
            setFamilyVision(newFamilyVision);
          }}
          tabIndex={-1}
        >
          Remove
        </button>
      </div>
    </li>
  );
};
