"use client";

import { Button } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import {
  TfmAvatarUploader,
  TfmFormColumns,
  TfmFormHeading,
  TfmFormSelect,
  TfmInput,
} from "@/components/ui/forms";
import { HomeIcon } from "@heroicons/react/20/solid";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { phoneFormat } from "lib/utils";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function PartnerGetStartedPage({ profile, user }) {
  const supabase = getSupabaseClientComponentClient();
  const router = useRouter();

  const [companyLogo, setCompanyLogo] = useState(null);
  const [form, setForm] = useState({
    first_name: profile.first_name || null,
    last_name: profile.last_name || null,
    phone: profile.phone || null,
    occupation: profile.occupation || null,
    company_legal_name: null,
    website: null,
    total_clients: null,
    assets_under_management: null,
    company_logo_url: companyLogo,
    segment: null,
    industry: null,
  });

  const [formHandlerState, setFormHandlerState] = useState({
    loading: false,
    error: null,
  });

  const upsertUserProfile = async (args) => {
    const { data, error } = await supabase.client
      .from("user_profiles")
      .upsert(args)
      .select()
      .single();

    if (error) {
      console.error("Error upserting user profile", error);
      throw error;
    }

    return data;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormHandlerState({ loading: true, error: null });

    const profileArgs = {
      ...(profile.user_profile_id && { id: profile.user_profile_id }),
      user_id: user.id,
      email: user.email,
      phone: form.phone,
      occupation: form.occupation,
      first_name: form.first_name,
      last_name: form.last_name,
    };

    const partnerArgs = {
      company_legal_name: form.company_legal_name,
      website: form.website,
      segment: form.segment,
      total_clients: form.total_clients,
      assets_under_management: form.assets_under_management,
      company_logo_url: companyLogo,
    };

    try {
      const userProfile = await upsertUserProfile(profileArgs);
      const { error: newPartnerError } = await supabase.client.rpc(
        "onboard_new_partner",
        { ...partnerArgs, user_profile_id: userProfile.id }
      );

      if (newPartnerError) throw newPartnerError;

      router.push("/dashboard");
      setFormHandlerState({
        error: null,
        loading: false,
      });
    } catch (error) {
      setFormHandlerState({
        loading: false,
        error: error.message || "Sorry, something went wrong.",
      });
    }
  };

  return (
    <div className="space-y-4">
      <h1 className="font-brand text-4xl font-bold italic text-tfm-primary">
        Complete your profile
      </h1>
      <p className="text-gray-500">
        Let us get to know you and your company. Please provide your
        professional information below.
      </p>
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TfmFormHeading>Personal Profile</TfmFormHeading>
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
          label="Phone"
          id="phone"
          type="tel"
          value={form.phone}
          onChange={(e) =>
            setForm({ ...form, phone: phoneFormat(e.target.value) })
          }
        />
        <TfmInput
          label="Title"
          id="occupation"
          value={form.occupation}
          onChange={(e) => setForm({ ...form, occupation: e.target.value })}
          required
        />
        <TfmFormHeading>Partner Information</TfmFormHeading>
        <TfmInput
          label="Company Name"
          id="company_legal_name"
          value={form.company_legal_name}
          onChange={(e) =>
            setForm({ ...form, company_legal_name: e.target.value })
          }
          required
        />
        <TfmFormSelect
          label="Segment"
          id="segment"
          value={form.segment}
          onChange={(e) => setForm({ ...form, segment: e.target.value })}
          required
        >
          <option value="" />
          <option value="Wealth Firm">Wealth Firm</option>
          <option value="Employer">Employer</option>
        </TfmFormSelect>
        <TfmFormColumns>
          <TfmFormSelect
            label={
              form.segment === "Employer"
                ? "Number of Employees"
                : "Total Clients"
            }
            id="total_clients"
            value={form.total_clients}
            onChange={(e) =>
              setForm({ ...form, total_clients: e.target.value })
            }
          >
            <option value="" />
            <option value="1-50">1-50</option>
            <option value="50-250">50-250</option>
            <option value="250-1000">250-1,000</option>
            <option value="1000">1,000+</option>
          </TfmFormSelect>
          {form.segment === "Wealth Firm" && (
            <TfmFormSelect
              label="Total AUM"
              id="assets_under_management"
              value={form.assets_under_management}
              onChange={(e) =>
                setForm({ ...form, assets_under_management: e.target.value })
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
          value={form.website}
          onChange={(e) => setForm({ ...form, website: e.target.value })}
        />
        <TfmAvatarUploader
          src={companyLogo}
          setSrc={setCompanyLogo}
          label="Upload a Company Logo"
          fileName={`partner-logo-${form.company_legal_name}`}
        />
        {formHandlerState.error && <ErrorBox msg={formHandlerState.error} />}
        <Button
          type="submit"
          primary
          fullWidth
          loading={formHandlerState.loading}
          Icon={HomeIcon}
        >
          Continue to Dashboard
        </Button>
      </form>
    </div>
  );
}
