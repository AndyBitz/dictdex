import { getCurrentUser } from '$lib/auth';
import { send } from '$lib/utils';
import { getWords } from '$lib/word';
import type { RequestHandler } from './$types';

export const GET: RequestHandler = async (event) => {
	const user = await getCurrentUser(event.cookies);
	if (!user) return send(401, {});
	
	const after = event.url.searchParams.get('after');
	const data = await getWords({ after });

	return new Response(
		JSON.stringify(data),
		{
			headers: {
				'content-type': 'application/json'
			}
		}
	);
};
