import z from 'zod';
import { generateObject } from "ai"
import { createOpenAI } from '@ai-sdk/openai';
import { env } from '$env/dynamic/private';

export const definition = z.object({
	word: z.string().min(1),
	description: z.string().min(1),
	types: z.array(z.string()).min(1),
	examples: z.array(z.string()).min(1),
	informal: z.boolean(),
	language: z.string().min(1),
});

const schema = z.object({
	result: z.union([
		definition,
		z.object({
			misspelling: z.string(),
		}),
		z.object({
			invalid: z.boolean(),
		}),
	]),
});

const description = `
Describe the given word like a dictionary entry.

If the word is a misspelling, set the misspelling field to the potential word and set nothing else.
If the word is invalid, only set the invalid field to true and set nothing else.

For all valid words, set the word field to the word in a normalized form.
This means that english words would be lower case unless they are names,
german nouns would be title case, a german verb in lower case and so on.
	
Also provide a description, what type of word it is (noun, verb, etc.),
some example sentences, and the language it is in.
Keep the language in title case.

The word is most likely english, german, or japanese.

Also consider informal words or words found on urban dictionary.
If that's the case, set informal to true.

If the word is the same in multiple languages, prefer the english one.
`.trim();

export async function defineWord(word: string) {
	const openai = createOpenAI({
		apiKey: env.OPENAI_API_KEY,
	});

	const { object } = await generateObject({
		model: openai('gpt-4.1-mini'),
		schema,
		schemaDescription: description,
		prompt: `Define "${word}".`,
	});

	return object.result;
}

