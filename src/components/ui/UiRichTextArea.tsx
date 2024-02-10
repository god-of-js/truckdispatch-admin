import React, { lazy } from 'react';
import styled from 'styled-components';
import 'react-quill/dist/quill.snow.css';

const UiField = lazy(() => import('./UiField'));
const LazyLoadedQuill = lazy(() => import('react-quill'));

interface Props {
  label: string;
  value: string;
  name: string;
  placeholder?: string;
  error?: string;
  onChange: (event: { name: string; value: string }) => void;
}

export default function UiRichTextArea({
  label,
  name,
  value,
  placeholder,
  error,
  onChange,
}: Props) {
  const handleEditorChange = (content: string) => {
    onChange({ name, value: content });
  };

  return (
    <UiField label={label} error={error}>
      <EditorContainer>
        <LazyLoadedQuill
          theme="snow"
          value={value || ''}
          onChange={handleEditorChange}
          placeholder={placeholder}
        />
      </EditorContainer>
    </UiField>
  );
}

const EditorContainer = styled.div`
  .ql-editor {
    min-height: ${pxToRem(250)};
  }

  .ql-container,
  .ql-toolbar {
    &.ql-snow {
      border: ${pxToRem(1)} solid var(--color-gray);
    }
  }
  .ql-toolbar {
    border-top-left-radius: ${pxToRem(8)};
    border-top-right-radius: ${pxToRem(8)};
  }
  .ql-container {
    border-bottom-left-radius: ${pxToRem(8)};
    border-bottom-right-radius: ${pxToRem(8)};
  }
`;
