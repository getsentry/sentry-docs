import React from 'react';
import { Note } from './note';

type Props = {
  name: string;
  platform?: string;
};

export function PlatformIdentifier({name, platform}: Props) {
  return <Note>`PlatformIdentifier` is under construction.</Note>;
}
