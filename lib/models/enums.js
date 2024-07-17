// Supabase enums

export const UserRoles = Object.freeze({
  Admin: "Admin",
  PartnerAdvisor: "Partner Advisor",
  PartnerAdmin: "Partner Admin",
  Coach: "Coach",
  CoachAdmin: "Coach Admin",
  HeadOfHousehold: "Head of Household",
  Child: "Child",
  CoachesAndAdmins: ["Admin", "Coach", "Coach Admin"],
  Admins: ["Admin", "Coach Admin"],
  FamilyMembers: ["Head of Household", "Child", "Family Member"],
  Partners: ["Partner Advisor", "Partner Admin", "Partner Member"],
});

export const FamilyPartnerStatus = Object.freeze({
  Prospect: "Prospect",
  Invited: "Invited",
  Onboarding: "Onboarding",
  Active: "Active",
  Delinquent: "Delinquent",
  Inactive: "Inactive",
});

export const FamilyMemberType = Object.freeze({
  HeadOfHouseHold: "head-of-household",
  Child: "child",
  Pet: "pet",
});

export const FamilyBillingMethod = Object.freeze({
  Self: "Self",
  Partner: "Partner",
  Scholarship: "Scholarship",
  TfmTeam: "TFM Team",
});

export const SessionStatus = Object.freeze({
  Planned: "Planned",
  Scheduled: "Scheduled",
  Completed: "Completed",
  Canceled: "Canceled",
});
