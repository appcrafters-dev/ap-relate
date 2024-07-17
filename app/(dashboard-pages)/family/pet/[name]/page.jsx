import { getSupabaseServerComponentClient } from "lib/supabase/supbase.server";
import FamilyMemberLayout from "@/components/family-member-layout";
import { prettyDate, getAge } from "lib/date";
import { FamilyMemberType } from "lib/models/enums";
import { notFound } from "next/navigation";

export async function generateMetadata({ params }) {
  const { data: pet } = await getPet(params.name);
  return {
    title: `Pets - ${pet?.name} - Total Family Management`,
  };
}

async function getPet(petId) {
  const supabase = getSupabaseServerComponentClient();

  return supabase.client.from("pets").select().eq("id", petId).single();
}

export default async function PetPage({ params }) {
  const { data: pet, error } = await getPet(params.name);

  if (error) {
    console.error("ERROR - getPet:", error);
    return <p>Something went wrong, please try again later.</p>;
  }

  if (!pet) return notFound();

  const profileFields = {
    "Pet Name": pet.name,
    Type: pet.type,
    Breed: pet.breed,
    Birthday: prettyDate(pet.birth_date),
    Age: getAge(pet.birth_date),
  };

  return (
    <FamilyMemberLayout
      person={pet}
      profile_fields={profileFields}
      memberType={FamilyMemberType.Pet}
    />
  );
}
