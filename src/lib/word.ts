import z from 'zod';
import { env } from '$env/dynamic/private';
import { definition } from './define-word';
import roninFactory from 'ronin';

const ronin = roninFactory({
	token: env.RONIN_TOKEN
});

export async function getWord(word: string) {
	return await ronin.get.word({
		with: { word },
	});
}

export async function saveWord(def: z.infer<typeof definition>) {
	return await ronin.add.word.with({
		word: def.word,
		description: def.description,
		types: def.types,
		examples: def.examples,
		language: def.language,
		informal: def.informal,
	});
}

export async function getWords() {
	return await ronin.get.words();
}
