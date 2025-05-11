import { AUTH_COOKIE_NAME } from '$lib/auth';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		event.cookies.delete(AUTH_COOKIE_NAME, {
			path: '/',
			secure: true,
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 0,
		});

		return { done: true };
	},
} satisfies Actions;
