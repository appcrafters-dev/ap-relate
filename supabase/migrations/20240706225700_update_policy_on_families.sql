drop policy "Coach Admin and Head of Household  can update own families" on "public"."families";

create policy "Coach Admin and Head of Household  can update own families"
on "public"."families"
as permissive
for update
to authenticated
using ((has_access_to_family(auth.uid(), id) AND has_roles(ARRAY['Head of Household'::"Role", 'Coach Admin'::"Role", 'Coach'::"Role"])));