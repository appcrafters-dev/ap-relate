"use client";

import {
  TfmAvatarUploader,
  TfmFormColumns,
  TfmFormHeading,
  TfmFormSelect,
  TfmInput,
  TfmTextArea,
} from "@/components/ui/forms";
import { useState } from "react";
import { ErrorBox } from "@/components/ui/errors";
import { states } from "lib/constants";
import { Button } from "@/components/ui/buttons";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { FamilyBillingMethod, FamilyPartnerStatus } from "lib/models/enums";

export default function FamilyDetails({
  family,
  lifePhases,
  partners = [],
  coaches = [],
  viewAdmin = false,
  editAdmin = false,
}) {
  const [famDetails, setFamDetails] = useState({
    family_name: family.family_name,
    family_photo_url: family.family_photo_url || null,
    life_phase_id: family.life_phase_id || null,
    family_mantra: family.family_mantra || null,
  });

  const [adminDetails, setAdminDetails] = useState({
    status: family.status || null,
    partner_id: family.partner_id || null,
    billing_method: family.billing_method || null,
    assigned_coach_id: family.assigned_coach_id || null,
    client_context: family.client_context || null,
  });

  const [handlerState, setHandlerState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const [adForm, setAdForm] = useState({
    address_line1: family.primary_address?.address_line1 || null,
    address_line2: family.primary_address?.address_line2 || null,
    city: family.primary_address?.city || null,
    state: family.primary_address?.state || null,
    pincode: family.primary_address?.pincode || null,
  });

  const supabase = getSupabaseClientComponentClient();

  const upsertAddress = async () => {
    if (!viewAdmin) {
      if (
        !adForm.address_line1 ||
        !adForm.city ||
        !adForm.state ||
        !adForm.pincode
      )
        throw new Error("Please complete the required fields.");

      if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(adForm.pincode) === false)
        throw new Error("Please enter a valid Zip Code.");
    }

    const args = {
      ...(family.primary_address && { id: family.primary_address.id }),
      country: "United States",
      ...adForm,
    };
    console.log("upsertAddress -> args", args);

    const { data, error } = await supabase.client
      .from("addresses")
      .upsert(args)
      .select("id")
      .single();
    console.log(data, error);
    if (error) throw error;
    return data.id;
  };

  const updateFamily = async (addressId) => {
    const { data, error } = await supabase.client
      .from("families")
      .update({
        ...famDetails,
        primary_address_id: addressId,

        ...(editAdmin && adminDetails),
      })
      .eq("id", family.id);
    if (error) throw error;
    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setHandlerState({ loading: true, error: null, success: false });

    try {
      let addressId = family.primary_address?.id || null;

      // Check if any address field is filled out and if addressId is not just an empty string
      if (
        (adForm.address_line1 ||
          adForm.city ||
          adForm.state ||
          adForm.pincode) &&
        addressId !== ""
      ) {
        addressId = await upsertAddress(); // Call upsertAddress regardless of viewAdmin
      }

      // Ensure addressId is valid or null before calling updateFamily
      if (addressId === "") {
        addressId = null;
      }

      await updateFamily(addressId);

      return setHandlerState({
        loading: false,
        error: null,
        success: true,
      });
    } catch (error) {
      console.log(error);
      return setHandlerState({
        loading: false,
        error: error.message || "Something went wrong. Please try again.",
        success: false,
      });
    }
  };

  return (
    <form className="max-w-lg space-y-4" onSubmit={handleSubmit}>
      <TfmFormHeading>Profile</TfmFormHeading>
      <TfmInput
        id="family_name"
        label="Family Name"
        value={famDetails.family_name}
        onChange={(e) => {
          setFamDetails({
            ...famDetails,
            family_name: e.target.value,
          });
        }}
        helpText={
          viewAdmin ? null : "How you would like us to refer to your household"
        }
      />
      <TfmAvatarUploader
        label="Choose a Family Photo"
        helpText={viewAdmin ? null : "Upload a photo of your family (optional)"}
        src={family.family_photo_url}
        setSrc={(src) => {
          setFamDetails({ ...famDetails, family_photo_url: src });
        }}
        fileName={`family-photo-${family.id}`}
      />
      <TfmFormSelect
        id="life_phase_id"
        label="Life Phase"
        value={famDetails.life_phase_id}
        helpText={
          !famDetails.life_phase_id
            ? "How would you describe your family's current life phase?"
            : lifePhases.find((phase) => phase.id === famDetails.life_phase_id)
                ?.description
        }
        onChange={(e) => {
          setFamDetails({
            ...famDetails,
            life_phase_id: e.target.value,
          });
        }}
      >
        <option></option>
        {lifePhases.map((phase) => (
          <option key={phase.id} value={phase.id}>
            {phase.title}
          </option>
        ))}
      </TfmFormSelect>
      {viewAdmin && (
        <>
          <TfmTextArea
            label="Purpose Statement"
            id="family_mantra"
            value={famDetails.family_mantra}
            onChange={(e) =>
              setFamDetails({
                ...famDetails,
                family_mantra: e.target.value,
              })
            }
          />
          <TfmFormHeading>Admin Settings</TfmFormHeading>
          {!editAdmin && (
            <p className="text-sm text-gray-500">
              To edit these settings, please contact an admin.
            </p>
          )}
          <TfmFormColumns>
            <TfmFormSelect
              label="Status"
              id="status"
              value={adminDetails.status}
              onChange={(e) =>
                setAdminDetails({ ...adminDetails, status: e.target.value })
              }
              disabled={!editAdmin}
            >
              <option value={null} />
              {Object.values(FamilyPartnerStatus).map((status) => (
                <option key={status} value={status}>
                  {status}
                </option>
              ))}
            </TfmFormSelect>
            <TfmFormSelect
              label="Billing Method"
              id="billing_method"
              value={adminDetails.billing_method}
              onChange={(e) =>
                setAdminDetails({
                  ...adminDetails,
                  billing_method: e.target.value,
                })
              }
              disabled={!editAdmin}
            >
              <option value={null} />
              {Object.values(FamilyBillingMethod).map((method) => (
                <option key={method} value={method}>
                  {method}
                </option>
              ))}
            </TfmFormSelect>
          </TfmFormColumns>
          {adminDetails.billing_method === FamilyBillingMethod.Partner && (
            <TfmFormSelect
              label="Partner"
              id="partner_id"
              value={adminDetails.partner_id}
              onChange={(e) =>
                setAdminDetails({ ...adminDetails, partner_id: e.target.value })
              }
              disabled={!editAdmin}
            >
              <option value={null} />
              {partners.map((partner) => (
                <option key={partner.id} value={partner.id}>
                  {partner.company_legal_name}
                </option>
              ))}
            </TfmFormSelect>
          )}
          <TfmFormSelect
            label="Assigned to Coach"
            id="coach_id"
            value={adminDetails.assigned_coach_id}
            onChange={(e) =>
              setAdminDetails({
                ...adminDetails,
                assigned_coach_id: e.target.value,
              })
            }
            disabled={!editAdmin}
          >
            <option></option>
            {coaches.map((coach) => (
              <option key={coach.id} value={coach.id}>
                {coach.first_name} {coach.last_name}
              </option>
            ))}
          </TfmFormSelect>
        </>
      )}
      <TfmFormHeading>Primary Address</TfmFormHeading>
      <TfmInput
        label="Address Line 1"
        id="address_line1"
        value={adForm.address_line1}
        onChange={(e) =>
          setAdForm({ ...adForm, address_line1: e.target.value })
        }
        helpText={
          handlerState.error &&
          !adForm.address_line1 && (
            <span className="text-red-500">Address Line 1 is required</span>
          )
        }
      />
      <TfmInput
        label="Address Line 2"
        id="address_line2"
        value={adForm.address_line2}
        onChange={(e) =>
          setAdForm({ ...adForm, address_line2: e.target.value })
        }
        helpText="PO Box, Apartment #, etc."
      />
      <TfmInput
        label="City"
        id="city"
        value={adForm.city}
        onChange={(e) => setAdForm({ ...adForm, city: e.target.value })}
        helpText={
          handlerState.error &&
          !adForm.city && <span className="text-red-500">City is required</span>
        }
      />
      <TfmFormColumns>
        <TfmFormSelect
          label="State"
          id="state"
          value={adForm.state}
          onChange={(e) => setAdForm({ ...adForm, state: e.target.value })}
          helpText={
            handlerState.error &&
            !adForm.state && (
              <span className="text-red-500">State is required</span>
            )
          }
        >
          {states.map((state) => (
            <option key={state} value={state}>
              {state}
            </option>
          ))}
        </TfmFormSelect>
        <TfmInput
          label="Zip Code"
          id="pincode"
          value={adForm.pincode}
          onChange={(e) => setAdForm({ ...adForm, pincode: e.target.value })}
          helpText={
            (handlerState.error && !adForm.pincode && (
              <span className="text-red-500">Zip Code is required</span>
            )) ||
            (adForm.pincode &&
              /(^\d{5}$)|(^\d{5}-\d{4}$)/.test(adForm.pincode) === false && (
                <span className="text-red-500">
                  Please enter a valid Zip Code
                </span>
              ))
          }
        />
      </TfmFormColumns>
      <Button type="submit" loading={handlerState.loading} primary>
        Save
      </Button>
      {(handlerState.error || handlerState.success) && (
        <ErrorBox
          msg={
            handlerState.error
              ? handlerState.error
              : "Profile updated successfully"
          }
          success={handlerState.success}
        />
      )}
    </form>
  );
}
