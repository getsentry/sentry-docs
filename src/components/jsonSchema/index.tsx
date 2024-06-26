import {readFileSync} from 'fs';
import {
  quicktype,
  InputData,
  JSONSchemaInput,
  JSONSchemaStore,
} from '@untitaker/quicktype-core-with-markdown';
import path from 'path';
import {bundleMDXHelper} from 'sentry-docs/mdx';
import {micromark} from 'micromark';

const readSchemaFile = () => {
  const filePath = path.join(process.cwd(), 'data-schemas/relay/event.schema.json');
  console.log({filePath});
  try {
    return readFileSync(filePath, 'utf8');
  } catch (e) {
    console.warn(`Failed to read Relay event schema: ${e}`);
    throw e;
    return null;
  }
};

const quicktypeJSONSchema = async (
  targetLanguage: string,
  typeName: string,
  jsonSchemaString: string
) => {
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
  console.log({content});
  if (!content) {
    return null;
  }

  const {lines} = await quicktypeJSONSchema('markdown', 'Event', content);
  return lines.join('\n');
}

export const JsonSchema = async () => {
  // delete all html comments
  const markdown = (await getMarkdownContent())?.replaceAll(/<!--.*?-->/g, '');
  // const {code} = await bundleMDXHelper(markdown);

  return <pre>{markdown}</pre>;
};
