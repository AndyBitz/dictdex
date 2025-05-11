import type { PageServerData } from './$types';
import { getWord } from '$lib/word';
import { getCurrentUser } from '$lib/auth';
import { showDeleteButton } from '$lib/flags';

export const load: PageServerData = async (event) => {
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
