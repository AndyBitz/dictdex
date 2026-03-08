import z from 'zod';
import { generateObject, createGateway } from "ai";
import { llm } from './flags';

export const definition = z.object({
	word: z.string().min(1),
	description: z.string().min(1),
	types: z.array(z.string()).min(1),
	examples: z.array(z.string()).min(1),
	informal: z.boolean(),
	language: z.string().min(1),
});

const schema = z.object({
	status: z.enum(['valid', 'misspelling', 'invalid']),
	word: z.string().nullable(),
	description: z.string().nullable(),
	types: z.array(z.string()).nullable(),
	examples: z.array(z.string()).nullable(),
	informal: z.boolean().nullable(),
	language: z.string().nullable(),
	misspelling: z.string().nullable(),
});

const system = `
Describe the given word like a dictionary entry.

Set "status" to one of: "valid", "misspelling", or "invalid".

Be generous with what counts as valid. Words from any language are valid, including loanwords, proper nouns, scientific terms, food names, plant names, brand names that have become common words, slang, and informal language. If the word exists in any dictionary, encyclopedia, or is in common use anywhere in the world, it is valid.

Only set status to "misspelling" if the word is clearly a typo or misspelling of another word. Set the "misspelling" field to the corrected word. Set all other fields to null.
Only set status to "invalid" if the input is truly random characters or complete nonsense (e.g. "asdfghjkl"). Set all other fields to null.

If the word is valid, set status to "valid" and fill in all of the following fields:
- "word": the word in normalized form (english words lower case unless names, german nouns title case, german verbs lower case, etc.)
- "description": a dictionary-style description
- "types": what type of word it is (noun, verb, adjective, etc.)
- "examples": at least two example sentences using the word
- "informal": true if the word is slang or found on urban dictionary, false otherwise
- "language": the language the word is in, in title case. For loanwords widely used in English, set language to "English".

If it's japanese, include romanji in the description.

Also consider informal words or words found on urban dictionary.

If the word is the same in multiple languages, prefer the english definition.
`.trim();

export async function defineWord(word: string) {
	const gateway = createGateway();
	const model = await llm();

  console.log({ msg: 'Defining word', word, model });

	const { object } = await generateObject({
		model: gateway(model),
		schema,
		system,
		prompt: `Define "${word}".`,
	});

	if (object.status === 'invalid') {
		return { invalid: true } as const;
	}

	if (object.status === 'misspelling' && object.misspelling) {
		return { misspelling: object.misspelling } as const;
	}

	// Validate that a valid response has all required fields
	const parsed = definition.safeParse({
		word: object.word,
		description: object.description,
		types: object.types,
		examples: object.examples,
		informal: object.informal,
		language: object.language,
	});

	if (!parsed.success) {
		return { invalid: true } as const;
	}

	return parsed.data;
}

