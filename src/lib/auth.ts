import z from 'zod';
import { env } from '$env/dynamic/private';
import roninFactory from 'ronin';
import bcrypt from 'bcrypt';
import { base64url, jwtDecrypt, EncryptJWT} from 'jose'
import type { Cookies } from '@sveltejs/kit';

const ronin = roninFactory({
	token: env.RONIN_TOKEN,
});

export const AUTH_COOKIE_NAME = 'dictdex_auth';

const userSchema = z.object({
	username: z.string().min(1),
});

export async function createToken(username: string, password: string) {
	const user = await ronin.get.user.with({ username });
	if (!user) throw new Error('Invalid user.');

	if (!(await bcrypt.compare(password, user.password))) {
		throw new Error('Invalid password.');
	}

	return await new EncryptJWT({ d: { username } })
		  .setProtectedHeader({ alg: 'dir', enc: 'A256GCM' })
		  .setExpirationTime('1y')
		  .encrypt(base64url.decode(env.JWT_SECRET));
}

export async function getCurrentUser(cookies: Cookies) {
	const jwt = cookies.get(AUTH_COOKIE_NAME);
	if (!jwt) return null;
	
	const { payload } = await jwtDecrypt(jwt, base64url.decode(env.JWT_SECRET));
	
	return userSchema.parse(payload.d);
}
