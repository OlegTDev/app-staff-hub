import { RichTextEditor, Link } from "@mantine/tiptap";
import { useEditor } from '@tiptap/react';
import StarterKit from '@tiptap/starter-kit';
import TextAlign from '@tiptap/extension-text-align';
import Superscript from '@tiptap/extension-superscript';
import SubScript from '@tiptap/extension-subscript';
import { Details, DetailsSummary, DetailsContent } from '@tiptap/extension-details';
import { useState } from "react";


type ElementProps = {
  content: string;
  onUpdate: (html: string) => void;
}

export default function RichTextarea({ content, onUpdate }: ElementProps) {
  const editor = useEditor({
    shouldRerenderOnTransaction: true,
    extensions: [
      StarterKit,
      Link,
      Superscript,
      SubScript,
      TextAlign.configure({ types: ['heading', 'paragraph'] }),
      Details,
      DetailsSummary,
      DetailsContent,
    ],
    content,
    onUpdate: ({ editor }) => onUpdate(editor.getHTML()),
  });

  const [isSourceCodeModeActive, onSourceCodeTextSwitch] = useState(false);

  return (
    <RichTextEditor
      editor={editor}
      onSourceCodeTextSwitch={onSourceCodeTextSwitch}
      labels={{
        boldControlLabel: 'Жирный',
        italicControlLabel: 'Курсив',
        underlineControlLabel: 'Подчеркнутый',
        strikeControlLabel: 'Зачеркнутый',
        clearFormattingControlLabel: 'Очистить форматирование',
        h1ControlLabel: 'Заголовок 1',
        h2ControlLabel: 'Заголовок 2',
        h3ControlLabel: 'Заголовок 3',
        h4ControlLabel: 'Заголовок 4',
        blockquoteControlLabel: 'Цитата',
        hrControlLabel: 'Горизонтальная линия',
        bulletListControlLabel:'Маркированный список',
        orderedListControlLabel: 'Нумерованный список',
        linkControlLabel: 'Ссылка',
        unlinkControlLabel: 'Удалить ссылку',
        alignLeftControlLabel: 'Выравнивание по левому краю',
        alignCenterControlLabel: 'Выравнивание по центру',
        alignRightControlLabel: 'Выравнивание по правому краю',
        alignJustifyControlLabel: 'Выравнивание по ширине страницы',
        undoControlLabel: 'Отменить',
        redoControlLabel: 'Вернуть',
        sourceCodeControlLabel: 'Исходный код',
        detailsControlLabel: 'Развернуть/свернуть блок',
      }}
    >
      <RichTextEditor.Toolbar sticky stickyOffset="var(--docs-header-height)">
        <RichTextEditor.ControlsGroup>
          <RichTextEditor.SourceCode />
        </RichTextEditor.ControlsGroup>
        {!isSourceCodeModeActive && (
          <>
            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Bold />
              <RichTextEditor.Italic />
              <RichTextEditor.Underline />
              <RichTextEditor.Strikethrough />
              <RichTextEditor.ClearFormatting />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.H1 />
              <RichTextEditor.H2 />
              <RichTextEditor.H3 />
              <RichTextEditor.H4 />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Blockquote />
              <RichTextEditor.Hr />
              <RichTextEditor.BulletList />
              <RichTextEditor.OrderedList />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Link />
              <RichTextEditor.Unlink />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.AlignLeft />
              <RichTextEditor.AlignCenter />
              <RichTextEditor.AlignJustify />
              <RichTextEditor.AlignRight />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Undo />
              <RichTextEditor.Redo />
            </RichTextEditor.ControlsGroup>

            <RichTextEditor.ControlsGroup>
              <RichTextEditor.Details />
            </RichTextEditor.ControlsGroup>
          </>
        )}
      </RichTextEditor.Toolbar>

      <RichTextEditor.Content />
    </RichTextEditor>
  );
}
