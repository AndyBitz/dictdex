import type { PageServerLoad } from './$types';
import { getCurrentUser } from '$lib/auth';
import { showDeleteButton } from '$lib/flags';
import { getWord } from '$lib/ddb';

export const load: PageServerLoad = async (event) => {
	const user = await getCurrentUser(event.cookies);
	if (!user) return null;

	const word = await getWord(event.params.word);
	if (!word) return null;

	return {
		word,
		flags: {
			showDeleteButton: await showDeleteButton(),
		},
	};
}
