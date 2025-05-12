import type { PageServerData } from './$types';
import { getCurrentUser } from '$lib/auth';
import * as flags from '$lib/flags';
import { encryptFlagValues } from 'flags';
import { env } from '$env/dynamic/private';

export const load: PageServerData = async (event) => {
	const user = await getCurrentUser(event.cookies);

	// Evaluate all flags, encrypt them, and forward them to the client
	const flagValues: Record<string, unknown> = {};
	await Promise.all(Object.entries(flags).map(async ([_, flag]) => {
		flagValues[flag.key] = await flag();
	}));
	
	const encryptedFlagValues = await encryptFlagValues(flagValues, env.FLAGS_SECRET);

	return {
		user,
		encryptedFlagValues,
	};
}
