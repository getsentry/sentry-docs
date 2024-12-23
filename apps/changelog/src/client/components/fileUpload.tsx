'use client';
import {Fragment, useState} from 'react';

import {Input} from './ui/Input';
import {uploadImage} from '../uploadImage';

export function FileUpload({defaultFile = ''}) {
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState(defaultFile);

  return (
    <Fragment>
      <Input
        name="temp"
        label="Hero Image"
        type="file"
        onChange={async e => {
          if (e.target.files === null) {
            return;
          }

          setLoading(true);
          const result = await uploadImage(e.target.files[0]);
          setLoading(false);
          setFile(result.url);
        }}
      />
      {loading && <p>Loading...</p>}
      {file && (
        <Fragment>
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={file} alt="Uploaded file" />
          <input type="hidden" name="image" value={file} />
        </Fragment>
      )}
      <span className="text-xs text-gray-500 italic">Image is not required</span>
    </Fragment>
  );
}
