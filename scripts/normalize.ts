import { get, set } from 'ronin';

async function main() {
	const words = await get.words();

	for await (const word of words) {
		if (word.normalizedWord) continue;

		const update = await set.word({
			with: { id: word.id },
			to: {
				normalizedWord: word.word.toLocaleLowerCase(),
			}
		});

		console.log('Updated', update);
	}
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
