import type { Actions, PageLoad } from './$types';
import { defineWord } from '$lib/define-word';
import { getWord, getWords, saveWord } from '$lib/word';
import { getCurrentUser } from '$lib/auth';
import { fail } from '@sveltejs/kit';

export const load: PageLoad = async (event) => {
	const user = await getCurrentUser(event.cookies);
	if (!user) return null;

	const words = await getWords();

	return {
		words,
	};
}

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const word = data.get('word')?.toString().trim();
		
		if (!word) return fail(400, { error: { message: 'Word is required.' }});
		if (typeof word !== 'string') return fail(400, { error: { message: 'Invalid word' } });
		if (word.includes(' ')) return fail(400, { error: { message: 'Word cannot contain spaces' } });
		if (encodeURIComponent(word) !== word) return fail(400, { error: { message: 'Word cannot contain special characters' } });
		
		const user = await getCurrentUser(event.cookies);
		if (!user) return fail(401, { error: { message: 'Not authorized.'} });

		const entry = await getWord(word);
		if (entry) {
			console.log({ entry });
			return entry;
		}

		const definition = await defineWord(word);
		console.log({ definition });

		if ('invalid' in definition) {
			throw new Error('Word is not valid');
		}

		if ('misspelling' in definition) {
			throw new Error('Word is a misspelling');
		}

		const savedEntry = await saveWord(definition);
		return savedEntry;
	},
} satisfies Actions;
