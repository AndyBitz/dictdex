import { getCurrentUser } from '$lib/auth';
import { send } from '$lib/utils';
import { deleteWord } from '$lib/ddb';
import type { RequestHandler } from './$types';

export const DELETE: RequestHandler = async (event) => {
	const user = await getCurrentUser(event.cookies);
	if (!user) return send(401, {});
	
	const wordId = event.params.id;
	const result = await deleteWord(wordId);
	console.log('Deleted', wordId, result);
	
	return send(200, {});
};
