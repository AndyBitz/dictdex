import { flag } from 'flags/sveltekit';
import { FLAGS } from '$env/static/private';
import { createVercelAdapter } from '@flags-sdk/vercel';

const vercelAdapter = createVercelAdapter(FLAGS);

export const showDeleteButton = flag<boolean>({
	key: 'show_delete_button',
	description: 'Show the delete button on word pages',
	defaultValue: false,
	adapter: vercelAdapter(),
});

export const aiModel = flag<string>({
	key: 'ai_model',
	description: 'The AI model used for word definitions',
	defaultValue: 'openai/gpt-5.4',
	adapter: vercelAdapter(),
});

