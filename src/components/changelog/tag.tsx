type TagProps = {
  text: string;
  active?: boolean;
  pointer?: boolean;
};

export default function Tag({text, active, pointer}: TagProps) {
  return (
    <div
      className={`py-1 px-3 uppercase shadow-sm no-underline rounded-full text-red text-xs mr-2 ${pointer ? 'cursor-pointer' : ''} ${active ? 'bg-gray-300' : 'bg-gray-100'}`}
    >
      {text.split(' ').join('-')}
    </div>
  );
}
