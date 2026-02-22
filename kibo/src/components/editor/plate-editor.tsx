'use client';

import * as React from 'react';

import { normalizeNodeId } from 'platejs';
import { Plate, usePlateEditor } from 'platejs/react';

import { EditorKit } from '@/components/editor/editor-kit';
import { SettingsDialog } from '@/components/editor/settings-dialog';
import { Editor, EditorContainer } from '@/components/ui/editor';

interface PlateEditorProps {
  content?: string;
  onChange?: (content: string) => void;
  readOnly?: boolean;
}

export function PlateEditor({ content, onChange, readOnly }: PlateEditorProps) {
  const initialValue = React.useMemo(() => {
    if (!content) return [{ type: 'p', children: [{ text: '' }] }];
    try {
      const parsed = JSON.parse(content);
      return Array.isArray(parsed) && parsed.length > 0 ? parsed : [{ type: 'p', children: [{ text: '' }] }];
    } catch {
      // Very basic fallback if content was HTML
      return [{ type: 'p', children: [{ text: content.replace(/<[^>]*>/g, '') }] }];
    }
  }, [content]);

  const editor = usePlateEditor({
    plugins: EditorKit,
    value: initialValue,
  });

  return (
    <Plate
      editor={editor}
      onChange={({ value }) => {
        if (onChange) {
          onChange(JSON.stringify(value));
        }
      }}
      readOnly={readOnly}
    >
      <EditorContainer>
        <Editor variant="demo" />
      </EditorContainer>

      <SettingsDialog />
    </Plate>
  );
}


