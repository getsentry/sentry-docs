import fs from 'fs';
import path from 'path';
import { PiiFieldsClient } from './piiFieldsClient';

export function PiiFields() {
  const filename = path.join(process.cwd(), 'src', 'data', 'relay_event_pii.json');
  const fields = JSON.parse(fs.readFileSync(filename, 'utf8'));
  return <PiiFieldsClient fields={fields} />;
}
