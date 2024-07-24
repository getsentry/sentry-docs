'use client';

import {forwardRef} from 'react';
import dynamic from 'next/dynamic';

import {EditorProps} from './editor';

const Editor = dynamic(() => import('./editor'), {
  // Make sure we turn SSR off
  ssr: false,
});

export const ForwardRefEditor = forwardRef<null, EditorProps>((props, ref) => (
  <Editor {...props} editorRef={ref} />
));

// TS complains without the following line
ForwardRefEditor.displayName = 'ForwardRefEditor';
