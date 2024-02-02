'use client';
import {Fragment, useState} from 'react';

import {Input} from './ui/Input';

export function TitleSlug() {
  const [slug, setSlug] = useState('');
  const [edited, setEdited] = useState(false);

  return (
    <Fragment>
      <div>
        <Input
          type="text"
          label="Title"
          name="title"
          className="w-full mb-2"
          required
          onChange={e => {
            if (!edited) {
              setSlug(
                `${e.target.value}`
                  .toLowerCase()
                  .replace(/ /g, '-')
                  .replace(/[^a-z0-9-]/g, '')
              );
            }
          }}
        />
      </div>
      <div>
        <Input
          type="text"
          label="Slug"
          name="slug"
          className="w-full mb-2"
          required
          value={slug}
          onChange={e => {
            setSlug(e.target.value);
            // edited will only be set if the user changes the slug in the input
            setEdited(true);
          }}
        />
      </div>
    </Fragment>
  );
}
