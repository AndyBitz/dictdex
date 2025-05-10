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
			language: z.string(),
		}),
		z.object({
			invalid: z.boolean(),
		}),
	]),
});

export async function defineWord(word: string) {
	const openai = createOpenAI({
		apiKey: env.OPENAI_API_KEY,
	});

	const { object } = await generateObject({
		model: openai('gpt-4.1-mini'),
		schema,
		schemaDescription: `Describe the given word like a dictionary entry. Provide the word in a normalized form, meaning, a german noun would be in title case, a german verb in lower case, english lower case as well, unless it's a name. Also provide its description, what type of word it is (noun, verb, etc.), some example sentences, and the language it is in. The word is most likely english, german, or japanese. Also consider informal words or words found on urban dictionary. If that's the case, set informal to true. If the word is the same in multiple languages, prefere the english one. If the word is not valid, set the invalid field to true.  If the word is a misspelling, provide the correct spelling in the misspelling field. Keep the language in title case.`,
		prompt: `Define "${word}".`,
	});

	return object.result;
}
