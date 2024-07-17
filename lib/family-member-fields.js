const familyMemberFields = [
  {
    label: "First Name",
    name: "first_name",
    type: "text",
    required: true,
  },
  {
    label: "Last Name",
    name: "last_name",
    type: "text",
    required: true,
  },
  {
    label: "Email",
    name: "email",
    type: "email",
    required: true,
  },
  {
    label: "Phone",
    name: "phone",
    type: "phone",
    required: true,
  },
  {
    label: "Occupation",
    name: "occupation",
    type: "text",
  },
  {
    label: "Date of Birth",
    name: "birth_date",
    type: "date",
    required: true,
  },
  {
    label: "Relationship Status",
    name: "relationship_status",
    type: "select",
    required: true,
    dependsOn: (member) => !member.is_child,
    options: [
      { label: "Single", value: "Single" },
      {
        label: "Committed Relationship - Not Living Together",
        value: "Committed Relationship - Not Living Together",
      },
      {
        label: "Committed Relationship - Living Together",
        value: "Committed Relationship - Living Together",
      },
      { label: "Married", value: "Married" },
      { label: "Divorced", value: "Divorced" },
      { label: "Widowed", value: "Widowed" },
      { label: "Separated", value: "Separated" },
    ],
  },
  {
    label: "Spouse",
    name: "partner_spouse_id",
    type: "select",
    required: (member) =>
      !member.is_child &&
      !member.id &&
      member.relationship_status === "Married",
    dependsOn: (member) =>
      !member.is_child &&
      !member.id &&
      member.relationship_status === "Married",
    options: [],
  },
  {
    label: "Wedding Date",
    name: "relationship_anniversary",
    type: "date",
    required: (member) =>
      !member.is_child &&
      !member.id &&
      member.relationship_status === "Married",
    dependsOn: (member) =>
      !member.is_child &&
      !member.id &&
      member.relationship_status === "Married",
  },
  {
    label: "Living at Home?",
    name: "child_living_at_home",
    type: "select",
    required: (member) => member.is_child,
    dependsOn: (member) => member.is_child,
    options: [
      { label: "Yes", value: true },
      { label: "No", value: false },
    ],
  },
  {
    label: "Upload a Photo",
    name: "avatar_url",
    type: "avatar",
  },
];

export const fields = {
  pet: [
    {
      label: "Pet Name",
      name: "name",
      type: "text",
      required: true,
    },
    {
      label: "Date of Birth",
      name: "birth_date",
      type: "date",
      required: true,
    },
    {
      label: "Pet Type",
      name: "type",
      type: "select",
      required: true,
      options: [
        { value: "Dog", label: "Dog" },
        { value: "Cat", label: "Cat" },
        { value: "Bird", label: "Bird" },
        { value: "Reptile", label: "Reptile" },
        { value: "Fish", label: "Fish" },
        { value: "Other", label: "Other" },
      ],
    },
    {
      label: "Breed",
      name: "breed",
      type: "text",
      required: false,
    },
    {
      label: "Upload a Photo",
      name: "avatar_url",
      type: "avatar",
    },
  ],
  child: familyMemberFields,
  "head-of-household": familyMemberFields,
};
