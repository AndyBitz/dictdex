import { get } from 'ronin';

async function main() {
	// const result = await get.word({ with: { normalizedWord: 'intron' }});
	// console.log(result);
	const words = await get.words();
	const count = new Map<string, number>();
	words.forEach((word) => {
		let cur = count.get(word.normalizedWord) ?? 0;
		count.set(word.normalizedWord, cur + 1);
	});
	
	count.forEach((val, key) => {
		if (val < 2) return;
		console.log(key, val);
	});
}

main().catch((error) => {
	console.error(error);
	process.exit(1);
});
