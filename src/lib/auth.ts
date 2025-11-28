import z from 'zod';
import { env } from '$env/dynamic/private';
import { getUser } from './ddb';
import bcrypt from 'bcrypt';
import { base64url, jwtDecrypt, EncryptJWT } from 'jose'
import type { Cookies } from '@sveltejs/kit';

export const AUTH_COOKIE_NAME = 'dictdex_auth';

const userSchema = z.object({
	username: z.string().min(1),
});

export async function createToken(username: string, password: string) {
  const user = await getUser(username);
	if (!user) throw new Error('Invalid user.');

	if (!(await bcrypt.compare(password, user.hashedPassword))) {
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
