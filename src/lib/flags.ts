import { flag } from 'flags/sveltekit';

export const showDeleteButton = flag({
	key: 'show_delete_button',
	// options: [{ value: true }, { value: false }],
	decide: () => false,
});
