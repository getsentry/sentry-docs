import {MouseEventHandler} from 'react';

type CategoryTagProps = {
  text: string;
  active?: boolean;
  pointer?: boolean;
  onClick?: MouseEventHandler<HTMLDivElement>;
};

export function CategoryTag({text, active, pointer, onClick}: CategoryTagProps) {
  return (
    <div
      className={`py-1 px-3 uppercase shadow-sm no-underline rounded-full text-red text-xs mr-2 ${pointer ? 'cursor-pointer' : ''} ${active ? 'bg-gray-300' : 'bg-gray-100'}`}
      onClick={onClick}
    >
      {text.split(' ').join('-')}
    </div>
  );
}
