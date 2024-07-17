"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Link from "@tiptap/extension-link";
import Typography from "@tiptap/extension-typography";

import { classNames } from "lib/utils";
import { useCallback, useRef } from "react";
import { Button } from "./buttons";
import {
  BoldIcon,
  ClearFormattingIcon,
  DoubleQuotesLIcon,
  ItalicIcon,
  LinkIcon,
  OrderedListIcon,
  ParagraphIcon,
  StrikeThroughIcon,
  UnorderedListIcon,
} from "./icons/remix-icons";
import { InfoBox } from "lib/tip-tap";
import { ExclamationCircleIcon } from "@heroicons/react/20/solid";

export default function TipTapEditor({
  id,
  label,
  helpText,
  value,
  defaultValue,
  onChange,
  disabled,
  extraSmall,
  small,
}) {
  const hiddenInputRef = useRef();

  const editor = useEditor({
    extensions: [
      StarterKit,
      Typography,
      InfoBox,
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: value || defaultValue || "<p></p>",
    onUpdate: ({ editor }) => {
      const content = editor.getHTML();
      if (onChange) onChange(content);
      if (hiddenInputRef.current) {
        hiddenInputRef.current.value = content;
      }
    },
    editorProps: {
      attributes: {
        id,
        name: id,
        disabled,
        class: classNames(
          "block prose max-w-none min-h-24 w-full appearance-none rounded border border-gray-200 placeholder-gray-400 shadow-sm focus:border-tfm-secondary focus:outline-none focus:ring-tfm-secondary focus:ring-1",
          disabled ? "bg-gray-100" : "bg-white",
          extraSmall
            ? "p-2 pr-5 text-xs"
            : small
            ? "p-2 pr-4 text-sm"
            : "p-3 pr-4"
        ),
      },
    },
  });

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  }, [editor]);

  const bubbleOptions = [
    {
      option: "heading",
      level: 1,
      label: "H1",
      onClick: () => editor.chain().focus().setHeading({ level: 1 }).run(),
    },
    {
      option: "heading",
      level: 2,
      label: "H2",
      onClick: () => editor.chain().focus().setHeading({ level: 2 }).run(),
    },
    {
      option: "heading",
      level: 3,
      label: "H3",
      onClick: () => editor.chain().focus().setHeading({ level: 3 }).run(),
    },
    {
      option: "heading",
      level: 4,
      label: "H4",
      onClick: () => editor.chain().focus().setHeading({ level: 4 }).run(),
    },
    {
      option: "paragraph",
      label: "P",
      onClick: () => editor.chain().focus().setParagraph().run(),
      Icon: ParagraphIcon,
    },
    {
      option: "bold",
      label: "Bold",
      onClick: () => editor.chain().focus().toggleBold().run(),
      Icon: BoldIcon,
    },
    {
      option: "italic",
      label: "Italic",
      onClick: () => editor.chain().focus().toggleItalic().run(),
      Icon: ItalicIcon,
    },
    {
      option: "strike",
      label: "Strike",
      onClick: () => editor.chain().focus().toggleStrike().run(),
      Icon: StrikeThroughIcon,
    },
    {
      onClick: () => editor.chain().focus().toggleBulletList().run(),
      option: "bulletList",
      label: "Bullet",
      Icon: UnorderedListIcon,
    },
    {
      onClick: () => editor.chain().focus().toggleOrderedList().run(),
      option: "orderedList",
      label: "List",
      Icon: OrderedListIcon,
    },
    {
      option: "blockquote",
      label: "Quote",
      onClick: () => editor.chain().focus().toggleBlockquote().run(),
      Icon: DoubleQuotesLIcon,
    },
    {
      option: "link",
      label: "Link",
      onClick: setLink,
      Icon: LinkIcon,
    },
    {
      option: "infoBox",
      label: "Infobox",
      onClick: () =>
        editor.chain().focus().toggleNode("infoBox", "paragraph").run(),
      Icon: ExclamationCircleIcon,
    },
    {
      option: "clearFormatting",
      label: "Clear",
      onClick: () => editor.chain().focus().clearNodes().unsetAllMarks().run(),
      Icon: ClearFormattingIcon,
    },
  ];

  if (!editor) return null;

  return (
    <div className="tfm-text-editor">
      <label
        htmlFor={id}
        className="mb-2 block font-subheading text-sm font-semibold uppercase tracking-wider text-tfm-primary-900"
      >
        {label}
      </label>
      <input type="hidden" id={id} name={id} ref={hiddenInputRef} />
      {editor && (
        <BubbleMenu
          editor={editor}
          tippyOptions={{ duration: 100 }}
          className="flex w-auto flex-wrap items-center justify-center gap-2 rounded bg-tfm-primary-900 p-2 shadow-lg"
        >
          {bubbleOptions.map((option, index) => (
            <Button
              key={index}
              extraSmall
              small
              onClick={option.onClick}
              title={option.label}
              aria-label={option.label}
              primary={
                option.level
                  ? editor.isActive(option.option, { level: option.level })
                  : editor.isActive(option.option)
              }
              Icon={option.Icon}
            >
              {option.label}
            </Button>
          ))}
        </BubbleMenu>
      )}
      <EditorContent editor={editor} />
      {helpText && (
        <p className="mt-2 text-xs tracking-tight text-gray-500">{helpText}</p>
      )}
    </div>
  );
}
