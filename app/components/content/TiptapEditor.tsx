'use client';

import { useEditor, EditorContent, Editor } from '@tiptap/react';
import { BubbleMenu } from '@tiptap/react/menus'
import StarterKit from '@tiptap/starter-kit';
import Link from '@tiptap/extension-link';
import {
  Bold,
  Italic,
  Strikethrough,
  // Heading1, // No longer needed
  // Heading2, // No longer needed
  // Heading3, // No longer needed
  List,
  ListOrdered,
  Quote,
  Minus,
  Link as LinkIcon,
  Unlink,
  Check,
  X,
  // Text, // No longer needed
} from 'lucide-react';
import './Tiptap.css';
import { useEffect, useState, useCallback } from 'react';

interface TiptapProps {
  value: string;
  onChange: (richText: string) => void;
}

// --- MenuBar Component ---
const MenuBar = ({
  editor,
  openLinkModal,
}: {
  editor: Editor | null;
  openLinkModal: () => void;
}) => {
  // --- FIX 1: Use a comma to skip the unused state variable ---
  const [, setForceUpdate] = useState(0);

  useEffect(() => {
    if (!editor) return;

    // Listen for transactions (typing, selection changes)
    const updateCallback = () => setForceUpdate((val) => val + 1);
    editor.on('transaction', updateCallback);

    // --- FIX 2: Explicitly define the destructor's return type as void ---
    return (): void => {
      editor.off('transaction', updateCallback);
    };
  }, [editor]);
  // --- End fixes ---


  // --- NEW: Callback for the style dropdown ---
  const handleStyleChange = useCallback(
    (e: React.ChangeEvent<HTMLSelectElement>) => {
      if (!editor) return;
      const value = e.target.value;
      const chain = editor.chain().focus();
      if (value === 'paragraph') chain.setParagraph().run();
      if (value === 'h1') chain.toggleHeading({ level: 1 }).run();
      if (value === 'h2') chain.toggleHeading({ level: 2 }).run();
      if (value === 'h3') chain.toggleHeading({ level: 3 }).run();
    },
    [editor]
  );
  // --- End new callback ---

  if (!editor) {
    return null;
  }

  return (
    <div className="editor-menu">
      {/* --- NEW: Style Select Dropdown --- */}
      <select
        value={
          editor.isActive('heading', { level: 1 })
            ? 'h1'
            : editor.isActive('heading', { level: 2 })
            ? 'h2'
            : editor.isActive('heading', { level: 3 })
            ? 'h3'
            : 'paragraph'
        }
        onChange={handleStyleChange}
        className="style-select"
      >
        <option value="paragraph">Paragraph</option>
        <option value="h1">Heading 1</option>
        <option value="h2">Heading 2</option>
        <option value="h3">Heading 3</option>
      </select>
      {/* --- End new dropdown --- */}

      {/* --- REMOVED: Old heading/paragraph button group --- */}
      
      <div className="editor-menu-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBold().run()}
          className={editor.isActive('bold') ? 'is-active' : ''}
          title="Bold"
        >
          <Bold className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleItalic().run()}
          className={editor.isActive('italic') ? 'is-active' : ''}
          title="Italic"
        >
          <Italic className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleStrike().run()}
          className={editor.isActive('strike') ? 'is-active' : ''}
          title="Strikethrough"
        >
          <Strikethrough className="h-4 w-4" />
        </button>
      </div>

      <div className="editor-menu-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBulletList().run()}
          className={editor.isActive('bulletList') ? 'is-active' : ''}
          title="Bullet List"
        >
          <List className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleOrderedList().run()}
          className={editor.isActive('orderedList') ? 'is-active' : ''}
          title="Ordered List"
        >
          <ListOrdered className="h-4 w-4" />
        </button>
      </div>

      <div className="editor-menu-group">
        <button
          type="button"
          onClick={openLinkModal} // <-- Use prop
          className={editor.isActive('link') ? 'is-active' : ''}
          title="Set Link"
        >
          <LinkIcon className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().unsetLink().run()}
          disabled={!editor.isActive('link')}
          title="Unlink"
        >
          <Unlink className="h-4 w-4" />
        </button>
      </div>

      <div className="editor-menu-group">
        <button
          type="button"
          onClick={() => editor.chain().focus().toggleBlockquote().run()}
          className={editor.isActive('blockquote') ? 'is-active' : ''}
          title="Blockquote"
        >
          <Quote className="h-4 w-4" />
        </button>
        <button
          type="button"
          onClick={() => editor.chain().focus().setHorizontalRule().run()}
          title="Horizontal Rule"
        >
          <Minus className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// --- Main Editor Component (no changes below this line, but included for completeness) ---
export default function TiptapEditor({ value, onChange }: TiptapProps) {
  // --- Link Modal State (Lifted) ---
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [linkUrl, setLinkUrl] = useState('');

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3],
        },
      }),
      Link.configure({
        openOnClick: false,
        autolink: true,
      }),
    ],
    content: value,
    onUpdate: ({ editor }) => {
      onChange(editor.getHTML());
    },
    editorProps: {
      attributes: {
        class: 'prose dark:prose-invert prose-sm sm:prose-base max-w-none focus:outline-none',
      },
    },
    immediatelyRender: false,
  });

  // --- Link Modal Callbacks (Lifted) ---
  const openLinkModal = useCallback(() => {
    if (!editor) return;
    setLinkUrl(editor.getAttributes('link').href || '');
    setIsLinkModalOpen(true);
  }, [editor]);

  const closeLinkModal = useCallback(() => {
    setIsLinkModalOpen(false);
    setLinkUrl('');
  }, []);

  const setLink = useCallback(() => {
    if (!editor) return;
    if (linkUrl === '') {
      editor.chain().focus().extendMarkRange('link').unsetLink().run();
    } else {
      editor.chain().focus().extendMarkRange('link').setLink({ href: linkUrl }).run();
    }
    closeLinkModal();
  }, [editor, linkUrl, closeLinkModal]);

  useEffect(() => {
    if (editor && editor.getHTML() !== value) {
      editor.commands.setContent(value, { emitUpdate: false });
    }
  }, [value, editor]);

  // Close link modal if editor focus changes
  useEffect(() => {
    if (editor) {
      const handleBlur = () => {
        // We use a small timeout to allow clicking on the modal buttons
        setTimeout(() => {
          if (!editor.isFocused) {
            closeLinkModal();
          }
        }, 100);
      };
      editor.on('blur', handleBlur);
      return () => {
        editor.off('blur', handleBlur);
      };
    }
  }, [editor, closeLinkModal]);


  return (
    <div className="editor-container">
      {/* --- Link Input Modal (now part of the main component) --- */}
      {isLinkModalOpen && (
        <div className="link-input-container">
          <input
            autoFocus
            type="text"
            placeholder="https://example.com"
            value={linkUrl}
            onChange={(e) => setLinkUrl(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter') setLink();
              if (e.key === 'Escape') closeLinkModal();
            }}
          />
          <button type="button" onClick={setLink}>
            <Check className="h-4 w-4" />
          </button>
          <button type="button" onClick={closeLinkModal}>
            <X className="h-4 w-4" />
          </button>
        </div>
      )}

      {/* Pass openLinkModal to the MenuBar */}
      <MenuBar editor={editor} openLinkModal={openLinkModal} />

      {/* --- UPDATED BUBBLE MENU --- */}
      {editor && (
        <BubbleMenu editor={editor} className="bubble-menu">
          {editor.isActive('link') ? (
            // --- Context: Link is selected ---
            <>
              <button
                type="button"
                onClick={openLinkModal}
                className="bubble-menu-button"
              >
                <LinkIcon className="h-4 w-4" />
                Edit Link
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().unsetLink().run()}
                className="bubble-menu-button"
              >
                <Unlink className="h-4 w-4" />
              </button>
            </>
          ) : (
            // --- Context: Plain text is selected ---
            <>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={`bubble-menu-button ${editor.isActive('bold') ? 'is-active' : ''}`}
              >
                <Bold className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={`bubble-menu-button ${editor.isActive('italic') ? 'is-active' : ''}`}
              >
                <Italic className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={openLinkModal}
                className="bubble-menu-button"
              >
                <LinkIcon className="h-4 w-4" />
              </button>
            </>
          )}
        </BubbleMenu>
      )}

      <EditorContent editor={editor} />
    </div>
  );
}

