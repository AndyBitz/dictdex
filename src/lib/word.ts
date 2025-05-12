import z from 'zod';
import { env } from '$env/dynamic/private';
import { definition } from './define-word';
import roninFactory from 'ronin';

const ronin = roninFactory({
	token: env.RONIN_TOKEN
});

export async function getWord(word: string) {
	return await ronin.get.word({
		with: { normalizedWord: word.toLocaleLowerCase() },
	});
}

export async function saveWord(def: z.infer<typeof definition>) {
	return await ronin.add.word.with({
		word: def.word,
		normalizedWord: def.word.toLocaleLowerCase(),
		description: def.description,
		types: def.types,
		examples: def.examples,
		language: def.language,
		informal: def.informal,
	});
}

export async function getWords({
	after,
	containing
}: {
	after?: string | null,
	containing?: string | null,
} = {}) {
	const words = await ronin.get.words({
		limitedTo: 50,
		...(after ? { after } : undefined),
		...(containing ? { with: { normalizedWord: { containing } } } : undefined),
	});
	
	return {
		list: words,
		moreBefore: words.moreBefore,
		moreAfter: words.moreAfter,
	};
}

export async function deleteWord(id: string) {
	return await ronin.remove.word.with({ id });
}
