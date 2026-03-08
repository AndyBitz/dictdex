import { createHandle } from 'flags/sveltekit';
import { env } from '$env/dynamic/private';
import * as flags from '$lib/flags';
 
export const handle = createHandle({ secret: env.FLAGS_SECRET, flags });
