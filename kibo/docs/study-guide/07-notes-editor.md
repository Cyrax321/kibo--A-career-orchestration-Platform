# 07 – Notes & Rich Editor System (Deep Dive)

## Overview
Kibo includes a full-featured Notion-style note-taking system built on PlateJS, supporting 30+ plugins, slash commands, sharing, and DOCX/Markdown export.

**Key Files:**
- `src/components/notes/NoteEditor.tsx` (20,434 bytes) – PlateJS editor
- `src/components/notes/NotesSidebar.tsx` (11,970 bytes) – Note list/search
- `src/components/notes/ShareNoteDialog.tsx` (9,040 bytes) – Share with token
- `src/components/notes/SlashCommandMenu.tsx` (5,600 bytes) – "/" commands
- `src/components/notes/PremiumGate.tsx` (1,800 bytes) – Premium gating
- `src/hooks/useNotes.ts` (9,160 bytes) – Notes CRUD hook (291 lines)
- `src/pages/Notes.tsx` (5,530 bytes) – Notes page
- `src/pages/SharedNote.tsx` (6,460 bytes) – Public shared view
- `src/components/editor/` – 65 PlateJS editor component files

## PlateJS Editor (30+ Plugins)

PlateJS is a rich-text editor framework for React, built on Slate.js. Each feature is a plugin.

### Plugin List:

| Category | Plugin | What It Does |
|----------|--------|-------------|
| **Text** | `@platejs/basic-styles` | Bold, italic, underline, strikethrough, code |
| **Structure** | `@platejs/basic-nodes` | Paragraphs, headings (H1-H6), blockquotes |
| **Lists** | `@platejs/list` | Ordered, unordered, checklists (to-do) |
| **Code** | `@platejs/code-block` | Multi-line code blocks with syntax highlighting via `lowlight` |
| **Tables** | `@platejs/table` | Table creation, row/column add/delete, cell merge |
| **Media** | `@platejs/media` | Image, video, embed insertion |
| **Links** | `@platejs/link` | Auto-detect URLs, edit popover, open in new tab |
| **Math** | `@platejs/math` | LaTeX equation rendering |
| **Callouts** | `@platejs/callout` | Info, warning, error, success boxes |
| **Toggles** | `@platejs/toggle` | Collapsible/expandable sections |
| **Emoji** | `@platejs/emoji` | Emoji picker with `@emoji-mart/data` |
| **Mentions** | `@platejs/mention` | `@user` autocomplete |
| **Comments** | `@platejs/comment` | Inline commenting |
| **Suggestions** | `@platejs/suggestion` | Tracked changes (accept/reject) |
| **DnD** | `@platejs/dnd` | Drag blocks to reorder |
| **Indent** | `@platejs/indent` | Tab indentation levels |
| **AutoFormat** | `@platejs/autoformat` | Markdown shortcuts (## → H2, - → list) |
| **Slash Cmd** | `@platejs/slash-command` | Type "/" to open command menu |
| **Combobox** | `@platejs/combobox` | Autocomplete dropdown |
| **AI** | `@platejs/ai` | AI-powered writing suggestions |
| **Excalidraw** | `@platejs/excalidraw` | Embedded diagrams |
| **DOCX** | `@platejs/docx-io` | Word document import/export |
| **Markdown** | `@platejs/markdown` | Markdown import/export |
| **TOC** | `@platejs/toc` | Auto table of contents |
| **Layout** | `@platejs/layout` | Column layouts |
| **Caption** | `@platejs/caption` | Media captions |
| **Resizable** | `@platejs/resizable` | Resize embedded media |
| **Selection** | `@platejs/selection` | Block-level selection |
| **Floating** | `@platejs/floating` | Floating toolbar |
| **Juice** | `@platejs/juice` | Inline CSS for export |
| **Date** | `@platejs/date` | Date picker insertion |

## Editor Components (65 files in editor/)

These implement the UI for each PlateJS plugin: toolbars, popovers, menus, renderers.

## Slash Commands

When user types "/" in the editor, a command menu appears:
- **Text:** Paragraph, Heading 1-3, Blockquote
- **Lists:** Bullet List, Numbered List, Checklist
- **Media:** Image, Video, Embed
- **Advanced:** Code Block, Table, Callout, Toggle, Math, Excalidraw
- **AI:** AI Write, AI Improve, AI Summarize

## Note Data Model

```typescript
interface Note {
  id: string;
  user_id: string;
  application_id: string | null;  // Link to application (optional)
  title: string;
  content: string;                 // PlateJS JSON serialized
  tags: string[];
  color: string;                   // Note card color
  is_pinned: boolean;
  is_archived: boolean;
  created_at: string;
  updated_at: string;
}

interface NoteShare {
  id: string;
  note_id: string;
  user_id: string;
  share_token: string;            // Unique token for URL
  access_level: 'view' | 'edit';
  is_active: boolean;
  created_at: string;
  expires_at: string | null;
}
```

## useNotes Hook (291 lines, 10 operations)

| Operation | Method | Supabase Call |
|-----------|--------|---------------|
| Fetch all notes | `useQuery` | `from('notes').select()` |
| Create note | `useMutation` | `from('notes').insert()` |
| Update note | `useMutation` | `from('notes').update()` |
| Delete note | `useMutation` | `from('notes').delete()` |
| Pin/Unpin | `useMutation` | `from('notes').update({ is_pinned })` |
| Archive | `useMutation` | `from('notes').update({ is_archived })` |
| Add tag | `useMutation` | Update tags array |
| Remove tag | `useMutation` | Filter tags array |
| Share note | `useMutation` | `from('note_shares').insert()` |
| Revoke share | `useMutation` | `from('note_shares').update({ is_active: false })` |

### Auto-Save: Debounced save on content change (prevents excessive API calls)

## Note Sharing System

1. User clicks "Share" on a note
2. `ShareNoteDialog` opens
3. System generates unique `share_token`
4. Row inserted in `note_shares` table
5. Shareable URL: `/shared/{share_token}`
6. Anyone with the URL can view the note (no auth required)
7. `SharedNote.tsx` page fetches note by token
8. Owner can revoke access anytime

## Integration with Applications

Notes can be optionally linked to a specific job application via `application_id`:
- Job-specific notes appear in `ApplicationDetailPanel`
- Component: `ApplicationNotes.tsx` (3,010 bytes)
- Useful for tracking per-company interview prep, questions, feedback
