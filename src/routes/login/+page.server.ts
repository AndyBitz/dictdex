import { AUTH_COOKIE_NAME, createToken } from '$lib/auth';
import type { Actions } from './$types';

export const actions = {
	default: async (event) => {
		const data = await event.request.formData();
		const username = data.get('username')?.toString() ?? '';
		const password = data.get('password')?.toString() ?? '';
		
		const jwt = await createToken(username, password);

		event.cookies.set(AUTH_COOKIE_NAME, jwt, {
			path: '/',
			secure: true,
			httpOnly: true,
			sameSite: 'lax',
			maxAge: 31556952,
		});

		return { username };
	},
} satisfies Actions;
