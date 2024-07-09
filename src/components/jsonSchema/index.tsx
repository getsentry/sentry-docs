import {readFileSync} from 'fs';
import path from 'path';

import {
  InputData,
  JSONSchemaInput,
  JSONSchemaStore,
  quicktype,
} from '@untitaker/quicktype-core-with-markdown';
import {micromark} from 'micromark';

const readSchemaFile = () => {
  const filePath = path.join(process.cwd(), 'data-schemas/relay/event.schema.json');
  try {
    return readFileSync(filePath, 'utf8');
  } catch (e) {
    // eslint-disable-next-line no-console
    console.warn(`Failed to read Relay event schema: ${e}`);
    throw e;
  }
};

const quicktypeJSONSchema = async (
  targetLanguage: string,
  typeName: string,
  jsonSchemaString: string
) => {
  // @ts-ignore
  const schemaInput = new JSONSchemaInput(new JSONSchemaStore());
  await schemaInput.addSource({name: typeName, schema: jsonSchemaString});
  const inputData = new InputData();
  inputData.addInput(schemaInput);
  return quicktype({
    inputData,
    lang: targetLanguage,
  });
};

async function getMarkdownContent() {
  const content = readSchemaFile();
  if (!content) {
    return null;
  }

  const {lines} = await quicktypeJSONSchema('markdown', 'Event', content);
  return lines.join('\n');
}

export async function JsonSchema() {
  const markdown = await getMarkdownContent();
  const html = micromark(markdown!, {
    allowDangerousHtml: true,
  });

  return <div dangerouslySetInnerHTML={{__html: html}} />;
}
