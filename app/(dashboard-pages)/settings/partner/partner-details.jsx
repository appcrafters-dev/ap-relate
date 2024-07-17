"use client";

import {
  TfmAvatarUploader,
  TfmFormColumns,
  TfmFormHeading,
  TfmFormSelect,
  TfmInput,
} from "@/components/ui/forms";
import { useState } from "react";
import { ErrorBox } from "@/components/ui/errors";
import { states } from "lib/constants";
import { Button } from "@/components/ui/buttons";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";

export default function PartnerDetails({ partner }) {
  const [partnerDetails, setPartnerDetails] = useState({
    company_legal_name: partner.company_legal_name,
    website: partner.website,
    segment: partner.segment,
    total_clients: partner.total_clients,
    assets_under_management: partner.assets_under_management,
    company_logo_url: partner.company_logo_url,
  });

  const [handlerState, setHandlerState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const [adForm, setAdForm] = useState({
    address_line1: partner.billing_address?.address_line1 || null,
    address_line2: partner.billing_address?.address_line2 || null,
    city: partner.billing_address?.city || null,
    state: partner.billing_address?.state || null,
    pincode: partner.billing_address?.pincode || null,
  });

  const supabase = getSupabaseClientComponentClient();

  const upsertAddress = async () => {
    if (
      !adForm.address_line1 ||
      !adForm.city ||
      !adForm.state ||
      !adForm.pincode
    )
      throw new Error("Please complete the required fields.");

    if (/(^\d{5}$)|(^\d{5}-\d{4}$)/.test(adForm.pincode) === false)
      throw new Error("Please enter a valid Zip Code.");

    const args = {
      ...(partner.billing_address && { id: partner.billing_address.id }),
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

  const updatePartner = async (addressId) => {
    const { data, error } = await supabase.client
      .from("partners")
      .update({ ...partnerDetails, billing_address_id: addressId })
      .eq("id", partner.id);
    if (error) throw error;
    return data;
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setHandlerState({ loading: true, error: null, success: false });

    try {
      const addressId = await upsertAddress();
      await updatePartner(addressId);

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
      <TfmFormHeading>Partner Information</TfmFormHeading>
      <TfmInput
        label="Company Name"
        id="company_legal_name"
        value={partnerDetails.company_legal_name}
        onChange={(e) =>
          setPartnerDetails({
            ...partnerDetails,
            company_legal_name: e.target.value,
          })
        }
        required
      />
      <TfmFormSelect
        label="Segment"
        id="segment"
        value={partnerDetails.segment}
        onChange={(e) =>
          setPartnerDetails({ ...partnerDetails, segment: e.target.value })
        }
        required
      >
        <option value="" />
        <option value="Wealth Firm">Wealth Firm</option>
        <option value="Employer">Employer</option>
      </TfmFormSelect>
      <TfmFormColumns>
        <TfmFormSelect
          label={
            partnerDetails.segment === "Employer"
              ? "Number of Employees"
              : "Total Clients"
          }
          id="total_clients"
          value={partnerDetails.total_clients}
          onChange={(e) =>
            setPartnerDetails({
              ...partnerDetails,
              total_clients: e.target.value,
            })
          }
        >
          <option value="" />
          <option value="1-50">1-50</option>
          <option value="50-250">50-250</option>
          <option value="250-1000">250-1,000</option>
          <option value="1000">1,000+</option>
        </TfmFormSelect>
        {partnerDetails.segment === "Wealth Firm" && (
          <TfmFormSelect
            label="Total AUM"
            id="assets_under_management"
            value={partnerDetails.assets_under_management}
            onChange={(e) =>
              setPartnerDetails({
                ...partnerDetails,
                assets_under_management: e.target.value,
              })
            }
          >
            <option value="" />
            <option value="100-500">$100M-$500M</option>
            <option value="500-2500">$500M-$2.5B</option>
            <option value="2500-5000">$2.5B-$5B</option>
            <option value="5000+">$5B+</option>
          </TfmFormSelect>
        )}
      </TfmFormColumns>
      <TfmInput
        label="Website"
        id="website"
        value={partnerDetails.website}
        onChange={(e) =>
          setPartnerDetails({ ...partnerDetails, website: e.target.value })
        }
      />
      <TfmAvatarUploader
        src={partnerDetails.company_logo_url}
        setSrc={(src) => {
          setPartnerDetails({ ...partnerDetails, company_logo_url: src });
        }}
        label="Upload a Company Logo"
        fileName={`partner-logo-${partnerDetails.company_legal_name}-${partner.id}`}
      />
      <TfmFormHeading>Billing Address</TfmFormHeading>
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
        helpText="PO Box, Suite #, etc."
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
