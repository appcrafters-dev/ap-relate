"use client";
import FamilyMemberGrid from "@/components/family-member-grid";
import { FamilyMemberType } from "lib/models/enums";
import { useState } from "react";

export default function FamilyPage({
  familyName,
  headsOfHousehold,
  familyChildren,
  pets,
  hideHeading = false,
  familyId = null,
}) {
  const [heads, setHeads] = useState(headsOfHousehold || []);
  const [kids, setKids] = useState(familyChildren || []);
  const [animals, setAnimals] = useState(pets || []);

  return (
    <>
      {!hideHeading && (
        <h1 className="mb-6 pt-4 font-brand text-4xl text-tfm-primary">
          {familyName || "My"} Family
        </h1>
      )}
      <main className="space-y-4">
        <h2 className="font-brand text-2xl font-medium">Heads of Household</h2>
        <FamilyMemberGrid
          memberList={heads}
          setMemberList={setHeads}
          memberType={FamilyMemberType.HeadOfHouseHold}
          enableNew={heads.length < 2}
          familyId={familyId}
        />
        <h2 className="pt-8 font-brand text-2xl font-medium">Children</h2>
        <FamilyMemberGrid
          memberList={kids}
          setMemberList={setKids}
          memberType={FamilyMemberType.Child}
          enableNew
          familyId={familyId}
        />
        <h2 className="pt-8 font-brand text-2xl font-medium">Pets</h2>
        <FamilyMemberGrid
          memberList={animals}
          setMemberList={setAnimals}
          memberType={FamilyMemberType.Pet}
          enableNew
          familyId={familyId}
        />
      </main>
    </>
  );
}
