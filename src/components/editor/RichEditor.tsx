"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import Underline from "@tiptap/extension-underline";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import Strike from "@tiptap/extension-strike";
import Highlight from "@tiptap/extension-highlight";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import { cn } from "@/lib/utils";

import {
  Bold,
  Italic,
  Underline as UnderlineIcon,
  List,
  ListOrdered,
  Quote,
  Undo,
  Redo,
  Code,
  Link as LinkIcon,
  Eraser,
  Type,
  ChevronDown,
  AlignLeft,
  AlignCenter,
  AlignRight,
  AlignJustify,
  Strikethrough,
  Highlighter,
  Minus,
  Subscript as SubscriptIcon,
  Superscript as SuperscriptIcon,
} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";

interface Props {
  value: string;
  onChange: (value: string) => void;
}

const ToolbarButton = ({
  onClick,
  isActive = false,
  children,
  tooltip,
}: {
  onClick: () => void;
  isActive?: boolean;
  children: React.ReactNode;
  tooltip?: string;
}) => (
  <Button
    variant="ghost"
    size="icon"
    onClick={onClick}
    className={cn(
      "h-8 w-8 transition-colors",
      isActive
        ? "bg-primary/10 text-primary hover:bg-primary/20"
        : "hover:bg-muted text-muted-foreground hover:text-foreground",
    )}
    title={tooltip}
  >
    {children}
  </Button>
);

export default function RichEditor({ value, onChange }: Props) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: {
          HTMLAttributes: {
            class: "rounded-md bg-muted p-4 font-mono text-sm",
          },
        },
      }),
      TextStyle,
      Color,
      Underline,
      Strike,
      Subscript,
      Superscript,
      Highlight.configure({ multicolor: true }),
      TextAlign.configure({
        types: ["heading", "paragraph"],
      }),
      HorizontalRule.configure({
        HTMLAttributes: {
          class: "my-4 border-t-2 border-muted",
        },
      }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: {
          class: "text-primary underline cursor-pointer",
        },
      }),
      Placeholder.configure({
        placeholder: "Write your blog content...",
      }),
    ],
    content: value,
    immediatelyRender: false,
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  if (!editor) return null;

  const setLink = () => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    if (url === null) return;
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();
      return;
    }

    editor.chain().focus().extendMarkRange("link").setLink({ href: url }).run();
  };

  return (
    <div className="border rounded-lg overflow-hidden bg-card text-card-foreground shadow-sm focus-within:ring-1 focus-within:ring-ring transition-all rich-editor-container">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-0.5 border-b p-1.5 bg-muted/30 sticky top-0 z-10 backdrop-blur-sm">
        <div className="flex items-center gap-0.5 mr-1">
          <ToolbarButton
            onClick={() => editor.chain().focus().undo().run()}
            tooltip="Undo"
          >
            <Undo size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().redo().run()}
            tooltip="Redo"
          >
            <Redo size={16} />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-0.5">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 gap-1 px-2 text-muted-foreground hover:text-foreground"
              >
                <Type size={16} />
                <ChevronDown size={12} />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              <DropdownMenuItem
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={cn(editor.isActive("paragraph") && "bg-muted")}
              >
                Paragraph
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 1 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 1 }) && "bg-muted",
                )}
              >
                Heading 1
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 2 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 2 }) && "bg-muted",
                )}
              >
                Heading 2
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() =>
                  editor.chain().focus().toggleHeading({ level: 3 }).run()
                }
                className={cn(
                  editor.isActive("heading", { level: 3 }) && "bg-muted",
                )}
              >
                Heading 3
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBold().run()}
            isActive={editor.isActive("bold")}
            tooltip="Bold"
          >
            <Bold size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleItalic().run()}
            isActive={editor.isActive("italic")}
            tooltip="Italic"
          >
            <Italic size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleUnderline().run()}
            isActive={editor.isActive("underline")}
            tooltip="Underline"
          >
            <UnderlineIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleStrike().run()}
            isActive={editor.isActive("strike")}
            tooltip="Strikethrough"
          >
            <Strikethrough size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleCode().run()}
            isActive={editor.isActive("code")}
            tooltip="Inline Code"
          >
            <Code size={16} />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSubscript().run()}
            isActive={editor.isActive("subscript")}
            tooltip="Subscript"
          >
            <SubscriptIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleSuperscript().run()}
            isActive={editor.isActive("superscript")}
            tooltip="Superscript"
          >
            <SuperscriptIcon size={16} />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("left").run()}
            isActive={editor.isActive({ textAlign: "left" })}
            tooltip="Align Left"
          >
            <AlignLeft size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("center").run()}
            isActive={editor.isActive({ textAlign: "center" })}
            tooltip="Align Center"
          >
            <AlignCenter size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("right").run()}
            isActive={editor.isActive({ textAlign: "right" })}
            tooltip="Align Right"
          >
            <AlignRight size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setTextAlign("justify").run()}
            isActive={editor.isActive({ textAlign: "justify" })}
            tooltip="Align Justify"
          >
            <AlignJustify size={16} />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBulletList().run()}
            isActive={editor.isActive("bulletList")}
            tooltip="Bullet List"
          >
            <List size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleOrderedList().run()}
            isActive={editor.isActive("orderedList")}
            tooltip="Ordered List"
          >
            <ListOrdered size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().toggleBlockquote().run()}
            isActive={editor.isActive("blockquote")}
            tooltip="Blockquote"
          >
            <Quote size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().setHorizontalRule().run()}
            tooltip="Horizontal Rule"
          >
            <Minus size={16} />
          </ToolbarButton>
        </div>

        <Separator orientation="vertical" className="h-6 mx-1" />

        <div className="flex items-center gap-0.5">
          <ToolbarButton
            onClick={setLink}
            isActive={editor.isActive("link")}
            tooltip="Add Link"
          >
            <LinkIcon size={16} />
          </ToolbarButton>
          <ToolbarButton
            onClick={() => editor.chain().focus().unsetAllMarks().run()}
            tooltip="Clear Formatting"
          >
            <Eraser size={16} />
          </ToolbarButton>
        </div>

        <div className="ml-auto flex items-center gap-1.5 px-2">
          {/* Highlight Color Picker */}
          <div className="relative h-6 w-6 rounded-full overflow-hidden border border-input hover:ring-1 hover:ring-ring transition-all cursor-pointer">
            <input
              type="color"
              className="absolute inset-0 h-full w-full p-0 border-0 cursor-pointer opacity-0"
              onChange={(e: any) =>
                editor
                  .chain()
                  .focus()
                  .setHighlight({ color: e.target.value })
                  .run()
              }
              title="Highlight Color"
            />
            <Highlighter
              size={14}
              className="absolute inset-0 m-auto text-muted-foreground pointer-events-none"
            />
          </div>

          {/* Text Color Picker */}
          <div className="relative h-6 w-6 rounded-full overflow-hidden border border-input hover:ring-1 hover:ring-ring transition-all cursor-pointer">
            <input
              type="color"
              className="absolute inset-0 h-full w-full p-0 border-0 cursor-pointer opacity-0"
              onChange={(e: any) =>
                editor.chain().focus().setColor(e.target.value).run()
              }
              title="Text Color"
            />
            <Type
              size={14}
              className="absolute inset-0 m-auto text-muted-foreground pointer-events-none"
            />
            <div
              className="h-1 absolute bottom-0 left-0 right-0 pointer-events-none"
              style={{
                backgroundColor:
                  editor.getAttributes("textStyle").color || "currentColor",
              }}
            />
          </div>
        </div>
      </div>

      {/* Editor Content */}
      <div
        className="prose prose-sm dark:prose-invert max-w-none p-4 min-h-[350px] cursor-text"
        onClick={() => editor.chain().focus().run()}
      >
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}
