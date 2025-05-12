import crypto from 'crypto';
import { send } from '$lib/utils';
import { env } from '$env/dynamic/private';
import { dev } from '$app/environment';
import { put } from '@vercel/blob';
import type { RequestHandler } from '@sveltejs/kit';
import { getWords } from '$lib/word';

type AsyncReturnType<T extends (...args: any) => Promise<any>> =
    T extends (...args: any) => Promise<infer R> ? R : any

export const GET: RequestHandler = async (event) => {
	const auth = event.request.headers.get('Authorization');
	if (!dev && auth !== `Bearer ${env.CRON_SECRET}`) {
		return send(401, { error: { message: 'Unauthorized' } });
	}
	
	const pages: AsyncReturnType<typeof getWords>[] = [];
	
	do {
		const after = pages[pages.length - 1]?.moreAfter;
		pages.push(await getWords({ after }));
	} while (pages[pages.length - 1].moreAfter);
	
	const list = pages.flatMap((page) => page.list);
	const data = list.map(word => JSON.stringify(word)).join('\n');

	const hash = crypto.createHash('sha256').update(data).end().digest('hex');
	const { url } = await put(`backups/words/${hash}.ndjson`, data, {
		token: env.BLOB_READ_WRITE_TOKEN,
		access: 'public',
		contentType: 'application/x-ndjson',
		allowOverwrite: true,
	});

	console.log({
		msg: 'Created backup',
		url,
	});

	return send(200, {});
};
