import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { Heading } from "@tiptap/extension-heading";
import { BulletList } from "@tiptap/extension-bullet-list";
import Toolbar from "./Toolbar";
import { useEffect } from "react";

interface TipTapProps {
  description: string;
  onChange: (value: string) => void;
}

const TipTap = ({ description, onChange }: TipTapProps) => {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({}),
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-semibold",
          levels: [1],
        },
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-5",
        },
      }),
    ],
    content: description,
    editorProps: {
      attributes: {
        class: "p-2 rounded-md border min-h-[150px] outline-none disabled:cursor-not-allowed disabled:opacity-50",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && description !== editor.getHTML()) {
      editor.commands.clearContent(false);
    }
  }, [description, editor]);

  return (
    <div className="flex min-h-55 flex-col gap-1">
      <Toolbar editor={editor} />
      <EditorContent editor={editor} />
    </div>
  );
};

export default TipTap;
