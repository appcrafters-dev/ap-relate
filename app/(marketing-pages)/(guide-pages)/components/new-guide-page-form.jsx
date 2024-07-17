import { Button } from "@/components/ui/buttons";
import { TfmFormSelect, TfmInput } from "@/components/ui/forms";
import { PlusIcon } from "@heroicons/react/24/solid";
import { getSupabaseClientComponentClient } from "lib/supabase/supabase.client";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function NewGuidePageForm({ categories, articles }) {
  const [form, setForm] = useState({
    table: "guide_articles", // "guide_categories
    title: null,
    category_id: null,
    slug: null,
  });
  const [formState, setFormState] = useState({
    loading: false,
    error: null,
  });
  const supabase = getSupabaseClientComponentClient();
  const router = useRouter();

  const getNewOrder = (table, categories, category_id = null) => {
    const maxOrderCategory = categories
      .filter((category) => category.parent_id === category_id)
      .reduce(
        (max, category) => (category.order > max ? category.order : max),
        0
      );
    const maxOrderArticle = articles
      .filter((article) => article.category_id === category_id)
      .reduce((max, article) => (article.order > max ? article.order : max), 0);
    return table === "guide_categories"
      ? maxOrderCategory + 1
      : maxOrderArticle + 1;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setFormState({ loading: true, error: null });
    console.log("form", form);
    const args = Object.fromEntries(
      Object.entries(form).filter(([key, value]) => value !== null)
    );
    delete args.table;
    args.slug = form.slug;
    args.order = getNewOrder(form.table, categories, form.category_id);
    if (form.table === "guide_articles")
      args.content = "<p>Write content here.</p>";
    if (form.table === "guide_categories") {
      delete args.category_id;
      args.parent_id = form.category_id || null;
    }

    const { data, error } = await supabase.client
      .from(form.table)
      .insert(args)
      .select()
      .single();

    console.log("updateGuide", data || error);
    if (error) return setFormState({ loading: false, error: error.message });
    setFormState({ loading: false, error: null });
    return router.refresh();
  };

  return (
    <form
      className="my-4 space-y-4 rounded bg-white p-3 shadow-sm"
      onSubmit={handleSubmit}
    >
      <TfmFormSelect
        id="table"
        extraSmall
        label="New Guide Page Type"
        onChange={(e) =>
          setForm({ ...form, table: e.target.value, category_id: null })
        }
      >
        <option value="guide_articles">Article</option>
        <option value="guide_categories">Category</option>
      </TfmFormSelect>
      <TfmFormSelect
        id="category_id"
        label={form.table === "guide_articles" ? "Category" : "Parent Category"}
        extraSmall
        helpText={
          form.table === "guide_articles"
            ? null
            : "Leave blank for top-level category"
        }
        required={form.table === "guide_articles"}
        value={form.category_id}
        onChange={(e) => setForm({ ...form, category_id: e.target.value })}
      >
        <option />
        {categories.map((category) => (
          <option key={category.id} value={category.id}>
            {category.title}
          </option>
        ))}
      </TfmFormSelect>
      <TfmInput
        id="name"
        label="Title"
        value={form.title}
        onChange={(e) =>
          setForm({
            ...form,
            title: e.target.value,
            slug: e.target.value
              ? e.target.value
                  .toLowerCase()
                  .replace(/\s+/g, "-")
                  .replace(/[^a-z0-9-]/gi, "")
              : "",
          })
        }
        extraSmall
      />
      <Button
        type="submit"
        primary
        extraSmall
        fullWidth
        Icon={PlusIcon}
        loading={formState.loading}
      >
        Create {form.table === "guide_articles" ? "Article" : "Category"}
      </Button>
      {formState.error && (
        <p className="text-xs text-red-600">{formState.error}</p>
      )}
    </form>
  );
}
