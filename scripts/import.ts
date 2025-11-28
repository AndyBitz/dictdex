import { saveWord } from '$lib/ddb';
import fs from 'node:fs/promises';
import path from 'node:path';

interface PrevWordBackup {
  word: string;
  description: string;
  types: string[];
  examples: string[];
  language: string;
  informal: null;
  normalizedWord: string;
  ronin: {
    createdAt: string;
    updatedAt: string;
  };
}

async function main() {
  const list: PrevWordBackup[] = (await fs.readFile(path.join(
    __dirname,
    '19ce892d90713b2d3fdda426cdb51e3111acb9cc317cd8982b0113d093b9cca9.ndjson'
  ), 'utf-8')).split('\n').map(x => JSON.parse(x));

  for (const word of list) {
    console.log(word);

    await saveWord({
      word: word.word,
      description: word.description,
      types: word.types,
      examples: word.examples,
      language: word.language,
      informal: Boolean(word.informal),
      createdAt: new Date(word.ronin.createdAt).getTime(),
      updatedAt: new Date(word.ronin.updatedAt).getTime(),
    });
  }
}

main().catch(error => {
  console.error(error);
  process.exit(1);
});

