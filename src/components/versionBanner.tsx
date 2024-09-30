import {useState} from 'react';
import {Button} from '@radix-ui/themes';

export function VersionBanner({
  version,
  onClickLatest,
}: {
  onClickLatest: () => void;
  version: string;
}) {
  const [show, setShow] = useState(true);

  return (
    <div
      className={`fixed bg-opacity-70	backdrop-blur-sm flex items-center content-center top-24 left-[50%] translate-x-[-50%] p-3 shadow-xl rounded bg-yellow-400 ${show ? '' : 'hidden'}`}
    >
      You're on version {version} of our SDK docs. Want to go to the latest version?{' '}
      <Button className="ml-2" onClick={onClickLatest}>
        Latest
      </Button>
      <Button variant="ghost" className="mx-2" onClick={() => setShow(false)}>
        Hide
      </Button>
    </div>
  );
}
