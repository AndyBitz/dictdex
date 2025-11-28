import type { Actions, PageServerData } from './$types';
import { defineWord } from '$lib/define-word';
import { getCurrentUser } from '$lib/auth';
import { fail } from '@sveltejs/kit';
import { getWord, getWords, saveWord } from '$lib/ddb';

export const load: PageServerData = async (event) => {
	const user = await getCurrentUser(event.cookies);
	if (!user) return null;

	const words = await getWords();
	return { words };
}

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const word = data.get('word')
			?.toString()
			?.replaceAll(/[-"_,.;:$!]/g, '') // Remove some special chars
			?.replaceAll(/ +/g, ' ')
			.trim();

		if (!word) return fail(400, { error: { message: 'Word is required.' }});

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
			return fail(400, { error: { message: 'Invalid word.' } })
		}

		if ('misspelling' in definition) {
			return fail(400, { error: { message: `Did you mean: ${definition.misspelling}` } })
		}

		const savedEntry = await saveWord(definition);
		return savedEntry;
	},
} satisfies Actions;
