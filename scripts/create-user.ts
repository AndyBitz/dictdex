import bcrypt from 'bcrypt';
import { add } from 'ronin';

async function main() {
	const username = process.argv[2];
	const password = process.argv[3];
	const hashedPassword = await bcrypt.hash(password, 10);

	console.log({ username, password, hashedPassword });
	
	const user = await add.user.with({
		username,
		password: hashedPassword,
	});
	
	console.log('Created user:', user);
}

main().catch((error) => {
	console.error(error);
	process.exit(error);
});
