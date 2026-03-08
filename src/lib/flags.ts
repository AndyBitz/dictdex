import { flag } from 'flags/sveltekit';
import { env } from '$env/dynamic/private';
import { createVercelAdapter } from '@flags-sdk/vercel';

const vercelAdapter = createVercelAdapter(env.FLAGS ?? '');

export const showDeleteButton = flag<boolean>({
	key: 'show_delete_button',
	description: 'Show the delete button on word pages',
	defaultValue: false,
	adapter: vercelAdapter(),
});

export const llm = flag<string>({
	key: 'llm',
	description: 'The AI model used for word definitions',
	defaultValue: 'google/gemini-3-flash',
	adapter: vercelAdapter(),
});

