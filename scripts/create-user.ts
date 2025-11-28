import readline from 'readline/promises';
import { createUser } from '$lib/ddb';
import bcrypt from 'bcrypt';

const rl = readline.createInterface({
  input: process.stdin,
});

async function main() {
	const username = process.argv[2];
	// const password = process.argv[3];
  const password = await rl.question('Password:');
	const hashedPassword = await bcrypt.hash(password, 10);

	console.log({ username, password, hashedPassword });
	
  const user = await createUser({
    hk: `user#${username}`,
    sk: username,
    username,
    hashedPassword,
    updatedAt: Date.now(),
    createdAt: Date.now(),
  });
	
	console.log('Created user:', user);
  process.exit(0);
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});

