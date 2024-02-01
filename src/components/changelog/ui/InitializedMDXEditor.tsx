'use client';

import {type ForwardedRef, Fragment} from 'react';
import {
  BoldItalicUnderlineToggles,
  ChangeCodeMirrorLanguage,
  CodeBlockEditorDescriptor,
  codeBlockPlugin,
  CodeToggle,
  ConditionalContents,
  diffSourcePlugin,
  DiffSourceToggleWrapper,
  imagePlugin,
  InsertCodeBlock,
  InsertImage,
  linkPlugin,
  markdownShortcutPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  toolbarPlugin,
  useCodeBlockEditorContext,
} from '@mdxeditor/editor';

const PlainTextCodeEditorDescriptor: CodeBlockEditorDescriptor = {
  // always use the editor, no matter the language or the meta of the code block
  match: () => true,
  // You can have multiple editors with different priorities, so that there's a "catch-all" editor (with the lowest priority)
  priority: 0,
  // The Editor is a React component
  Editor: props => {
    const cb = useCodeBlockEditorContext();

    // stops the proppagation so that the parent lexical editor does not handle certain events.
    return (
      <div onKeyDown={e => e.nativeEvent.stopImmediatePropagation()}>
        <textarea
          rows={3}
          cols={20}
          defaultValue={props.code}
          onChange={e => cb.setCode(e.target.value)}
        />
      </div>
    );
  },
};

export default function InitializedMDXEditor({
  editorRef,
  ...props
}: {editorRef: ForwardedRef<MDXEditorMethods> | null} & MDXEditorProps) {
  return (
    <MDXEditor
      plugins={[
        toolbarPlugin({
          toolbarContents: () => {
            return (
              <Fragment>
                <DiffSourceToggleWrapper>
                  <BoldItalicUnderlineToggles />
                  <CodeToggle />
                  <ConditionalContents
                    options={[
                      {
                        when: editor => editor?.editorType === 'codeblock',
                        contents: () => <ChangeCodeMirrorLanguage />,
                      },
                      {
                        fallback: () => (
                          <Fragment>
                            <InsertCodeBlock />
                          </Fragment>
                        ),
                      },
                    ]}
                  />
                  <InsertImage />
                </DiffSourceToggleWrapper>
              </Fragment>
            );
          },
        }),
        codeBlockPlugin({codeBlockEditorDescriptors: [PlainTextCodeEditorDescriptor]}),

        imagePlugin(),
        markdownShortcutPlugin(),
        linkPlugin(),
        diffSourcePlugin({diffMarkdown: 'An older version', viewMode: 'rich-text'}),
      ]}
      {...props}
      ref={editorRef}
    />
  );
}
