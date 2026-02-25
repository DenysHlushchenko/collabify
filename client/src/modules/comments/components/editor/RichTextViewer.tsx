import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Underline from "@tiptap/extension-underline";
import { Heading } from "@tiptap/extension-heading";
import { BulletList } from "@tiptap/extension-bullet-list";

interface RichTextViewerProps {
  content: string;
  className?: string;
}

export default function RichTextViewer({ content, className = "" }: RichTextViewerProps) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        bulletList: false,
      }),
      Underline,
      Heading.configure({
        HTMLAttributes: {
          class: "text-xl font-semibold",
        },
        levels: [1],
      }),
      BulletList.configure({
        HTMLAttributes: {
          class: "list-disc pl-5 space-y-1",
        },
      }),
    ],
    content: content,
    editable: false,
    injectCSS: false,
    editorProps: {
      attributes: {
        class: "prose prose-sm sm:prose text-gray-800 leading-relaxed outline-none",
      },
    },
  });

  return <div className={`min-h-8 ${className}`}>{editor && <EditorContent editor={editor} />}</div>;
}
