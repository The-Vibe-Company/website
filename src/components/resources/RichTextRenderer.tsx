import { RichText } from '@payloadcms/richtext-lexical/react';
import type { SerializedEditorState } from 'lexical';

interface RichTextRendererProps {
  data: SerializedEditorState;
  className?: string;
}

export function RichTextRenderer({ data, className }: RichTextRendererProps) {
  return (
    <RichText
      data={data}
      className={className}
    />
  );
}
