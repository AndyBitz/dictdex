import { get } from 'ronin';

async function main() {
	// const result = await get.word({ with: { normalizedWord: 'intron' }});
	// console.log(result);

	const words = await get.words({
		limitedTo: 50,
		with: {
			normalizedWord: {
				containing: 'renitent',
			}
		},
	});
	words.forEach(word => console.log(word));
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
