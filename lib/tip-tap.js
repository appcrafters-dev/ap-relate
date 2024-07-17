import { Node, mergeAttributes } from "@tiptap/core";

export const InfoBox = Node.create({
  name: "infoBox",

  group: "block",

  content: "inline*",

  defining: true,

  parseHTML() {
    return [
      {
        tag: "div.tfm-info-box",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "div",
      mergeAttributes(HTMLAttributes, { class: "tfm-info-box" }),
      0,
    ];
  },
});
