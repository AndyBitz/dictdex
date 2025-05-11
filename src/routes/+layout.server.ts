import type { PageServerData } from './$types';
import { getCurrentUser } from '$lib/auth';

export const load: PageServerData = async (event) => {
	const user = await getCurrentUser(event.cookies);
	return { user };
}
