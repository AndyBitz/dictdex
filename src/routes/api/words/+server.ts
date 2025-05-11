import { getCurrentUser } from '$lib/auth';
import { getWords } from '$lib/word';
import type { RequestHandler } from './$types';

function send(status: number, data: object, response?: ResponseInit) {
	return new Response(
		JSON.stringify(data),
		{
			...response,
			status,
			headers: {
				'content-type': 'application/json',
				...response?.headers,
			},
		}
	);
}

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
