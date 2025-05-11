import { model, json, string, boolean } from 'ronin/schema';

export const User = model({
	slug: 'user',

	fields: {
		username: string(),
		password: string(),
	},
});

export const Word = model({
	slug: 'word',

	fields: {
		word: string(),
		normalizedWord: string(),
		description: string(),
		types: json(),
		examples: json(),
		language: string(),
		informal: boolean(),
	},
});
