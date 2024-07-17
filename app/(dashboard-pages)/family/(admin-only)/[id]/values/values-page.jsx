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

function upsertValues(body) {
  const supabase = getSupabaseClientComponentClient();
  return supabase.client.from("family_values").upsert(body);
}

export default function FamilyValues({
  family,
  familyValues: currentFamilyValues,
  allValues,
}) {
  const [formState, setFormState] = useState({
    loading: false,
    msg: null,
    success: false,
  });

  const [actions, setActions] = useState(currentFamilyValues?.actions || []);

  const [familyForm, setFamilyForm] = useState({
    completed_on: currentFamilyValues?.completed_on || "",
  });

  const value_types = allValues.sort();

  const allValuesById = groupBy(allValues, "id");

  const moveValue = (idx, direction) => {
    if (idx < 0 || idx >= actions.length) return;
    setActions((prevValues) => {
      const newFamilyValues = [...prevValues];
      const newIdx = direction === "up" ? idx - 1 : idx + 1;
      [newFamilyValues[idx], newFamilyValues[newIdx]] = [
        newFamilyValues[newIdx],
        newFamilyValues[idx],
      ];
      return newFamilyValues;
    });
  };

  const isDateCompletedInFuture = () => {
    const dateCompleted = new Date(familyForm.completed_on);
    const today = new Date();
    return dateCompleted >= today;
  };

  const handleChange = (event, idx) => {
    const { name, value } = event.target;
    const newFamilyValues = [...actions];
    newFamilyValues[idx][name] = value;
    setActions(newFamilyValues);
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
      family_id: family.id,
      completed_on: familyForm.completed_on,
      actions: actions.map(({ value_id, action }) => ({
        value_id,
        value_name: allValuesById[value_id].name,
        action,
        definition: "",
      })),
    };

    const { error } = await upsertValues(body);

    if (error) {
      console.error(" - Error upserting family value:", error);
      return setFormState({
        loading: false,
        msg: error.message,
        success: false,
      });
    }

    setFormState({
      loading: false,
      msg: "Family values saved successfully!",
      success: true,
    });
  };

  return (
    <form className="mx-auto max-w-2xl space-y-4 pt-4" onSubmit={handleSubmit}>
      <TfmFormHeading>{family.family_name + " "}Family Values</TfmFormHeading>

      <TfmInput
        id="completed_on"
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
        {actions.map((value, idx) => (
          <ValueItem
            key={idx}
            value={value}
            idx={idx}
            value_types={value_types}
            handleChange={handleChange}
            moveValue={moveValue}
            familyValues={actions}
            setFamilyValues={setActions}
          />
        ))}
      </ol>

      {(!actions.length || actions[actions.length - 1].value_id) && (
        <Button
          type="button"
          fullWidth
          onClick={() =>
            setActions([
              ...actions,
              {
                value_id: null,
                action: null,
              },
            ])
          }
        >
          <PlusIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          Add {!actions.length ? "first" : "another"} Value
        </Button>
      )}
      {actions.length > 0 && actions[actions.length - 1].value_id && (
        <Button type="submit" fullWidth primary disabled={formState.loading}>
          {!formState.loading && (
            <LockClosedIcon className="-ml-1 mr-2 h-4 w-4" aria-hidden="true" />
          )}
          {formState.loading ? <Spinner /> : "Save Family Values"}
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

function ValueItem({
  value,
  idx,
  value_types,
  handleChange,
  moveValue,
  familyValues,
  setFamilyValues,
}) {
  return (
    <li key={idx} className="grid gap-3 pt-10 md:flex md:gap-6">
      <TfmFormSelect
        id="value_id"
        label={"Value #" + (idx + 1)}
        value={value.value_id}
        onChange={(e) => handleChange(e, idx)}
      >
        <option></option>
        {value_types
          .sort((a, b) => a.name.localeCompare(b.name))
          .map(({ id, name }) => (
            <option key={id} value={id}>
              {name}
            </option>
          ))}
      </TfmFormSelect>

      <div className="flex-grow">
        <TfmTextArea
          id="action"
          label="Actions"
          rows={4}
          value={value.action}
          onChange={(e) => handleChange(e, idx)}
        />
      </div>

      <div className="flex flex-col items-center justify-center space-y-3 text-center">
        <UpDownButtons
          upDisabled={idx === 0}
          downDisabled={idx === familyValues.length - 1}
          upOnChange={() => moveValue(idx, "up")}
          downOnChange={() => moveValue(idx, "down")}
        />
        <button
          type="button"
          className="-mr-px font-accent text-xs uppercase tracking-wider text-tfm-primary hover:underline"
          onClick={() => {
            const newFamilyValues = [...familyValues];
            newFamilyValues.splice(idx, 1);
            setFamilyValues(newFamilyValues);
          }}
          tabIndex={-1}
        >
          Remove
        </button>
      </div>
    </li>
  );
}
