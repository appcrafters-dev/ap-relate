"use client";
import {
  TfmFormHeading,
  TfmFormSelect,
  TfmInput,
  TfmTextArea,
} from "components/ui/forms";
import { Button, LinkButton } from "@/components/ui/buttons";
import { ErrorBox } from "@/components/ui/errors";
import { useState } from "react";
import Spinner from "@/components/ui/spinner";
import MultiSelect from "@/components/ui/multi-select";
import { getFullName } from "lib/utils";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";

export default function NewQuote({
  family,
  familyMembers,
  themes,
  searchParams,
}) {
  const [formState, setFormState] = useState({
    loading: false,
    error: null,
    success: false,
  });

  const [selectedThemes, setSelectedThemes] = useState([]);

  const handleNewQuote = async (e) => {
    e.preventDefault();
    setFormState({ ...formState, loading: true });

    const date = new Date(e.target.quote_date.value);

    //   if date is in the future, show an error
    if (date > new Date()) {
      return setFormState({
        success: false,
        loading: false,
        error: "Please pick a date in the past.",
      });
    }

    const family_member = JSON.parse(e.target.family_member.value);

    const { error } = await insertQuote({
      family_member_id: family_member.id,
      family_id: family.id,
      date: e.target.quote_date.value,
      quote: e.target.quote.value,
      themes: selectedThemes,
    });

    if (error)
      return setFormState({
        ...formState,
        loading: false,
        error: error.message || "Something went wrong, please try again later.",
      });

    setFormState({ ...formState, loading: false, success: true });
  };

  return formState.success ? (
    <div className="mx-auto max-w-md space-y-4">
      <ErrorBox msg="Quote successfully added" success />
      <div>
        <LinkButton fullWidth href={`/family/${family.id}/quotes`} primary>
          Back to Quotes
        </LinkButton>
      </div>
      <div>
        <LinkButton fullWidth href={`/family/${family.id}/quotes/new`}>
          Add another Quote
        </LinkButton>
      </div>
    </div>
  ) : (
    <form className="mx-auto my-4 max-w-md space-y-4" onSubmit={handleNewQuote}>
      <TfmFormHeading>New Quote</TfmFormHeading>
      <TfmFormSelect id="family_member" label="Family Member" required>
        <option></option>
        {familyMembers.map((member) => (
          <option key={member.id} value={JSON.stringify(member)}>
            {getFullName(member)}
          </option>
        ))}
      </TfmFormSelect>
      <TfmInput
        id="quote_date"
        label="Date"
        type="date"
        defaultValue={
          searchParams.date
            ? searchParams.date
            : new Date().toISOString().split("T")[0]
        }
        required
      />
      <TfmTextArea
        id="quote"
        label="Quote"
        rows={5}
        required
        defaultValue={searchParams.quote ? searchParams.quote : ""}
        // helpText='Please do not use any "quotes" in your quote.'
      />
      <MultiSelect
        options={themes}
        label="Themes"
        id="themes"
        selectedValues={selectedThemes}
        setSelectedValues={setSelectedThemes}
      />
      <Button type="submit" primary disabled={formState.loading}>
        {formState.loading ? <Spinner /> : "Add Quote"}
      </Button>
      {formState.error && <ErrorBox msg={formState.error} />}
    </form>
  );
}

function reStructureQuoteThemeByTitle(quoteThemes) {
  return quoteThemes.reduce((result, theme) => {
    result[theme.title] = theme.id;
    return result;
  }, {});
}

async function insertQuote(body) {
  const quote = {
    quote: body.quote,
    date: body.date,
    family_member_id: body.family_member_id,
    family_id: body.family_id,
  };

  const supabase = getSupabaseClientComponentClient();
  // Get existing quote_themes

  const { data: existingQuoteThemes, error: getExistingQuoteThemesError } =
    await supabase.client
      .from("quote_themes")
      .select()
      .in("title", body.themes);

  if (getExistingQuoteThemesError) {
    return { error: getExistingQuoteThemesError };
  }

  let existingThemeIdsByTitle =
    reStructureQuoteThemeByTitle(existingQuoteThemes);

  // Insert non existing quote_themes
  const nonExistingQuoteThemes = body.themes.filter((theme) => {
    return !(theme in existingThemeIdsByTitle);
  });

  if (nonExistingQuoteThemes.length) {
    const { data: insertedQuoteThemes, error: insertQuoteThemesError } =
      await supabase.client
        .from("quote_themes")
        .upsert(
          nonExistingQuoteThemes.map((theme) => ({
            title: theme,
          }))
        )
        .select();

    if (insertQuoteThemesError) {
      return { error: insertQuoteThemesError };
    }

    existingThemeIdsByTitle = {
      ...existingThemeIdsByTitle,
      ...reStructureQuoteThemeByTitle(insertedQuoteThemes),
    };
  }

  // Add quote to quotes
  const { data: insertedQuote, error: insertQuoteError } = await supabase.client
    .from("quotes")
    .insert(quote)
    .select()
    .single();

  if (insertQuoteError) {
    return { error: insertQuoteError };
  }

  // Add entry for each quote_theme in quote_quote_themes
  const quoteQuoteThemes = body.themes.map((theme) => {
    return {
      quote_id: insertedQuote.id,
      quote_theme_id: existingThemeIdsByTitle[theme],
    };
  });

  const { error: insertQuoteQuoteThemesError } = await supabase.client
    .from("quote_quote_themes")
    .insert(quoteQuoteThemes);

  if (insertQuoteQuoteThemesError) {
    return { error: insertQuoteQuoteThemesError };
  }

  return { data: insertedQuote, error: null };
}
