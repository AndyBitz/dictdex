<script lang="ts">
    import Stack from './Stack.svelte';

	const { initialData } = $props();

	let wordPages = $state(initialData ? [initialData] : []);
	let loading = $state(false);
	const hasMore = () => Boolean(wordPages[wordPages.length - 1].moreAfter);

	const loadMore = async () => {
		loading = true;
		const after = wordPages[wordPages.length - 1].moreAfter;
		const next = await fetch(`/api/words?after=${after}`)
			.then(res => res.json())
			.finally(() => {
				loading = false;
			});
	
		wordPages.push(next);
	};	
</script>

{#if wordPages.length > 0}
	<Stack class="flex flex-col gap-4">
		<ul class="flex flex-col justify-start gap-2">
			{#each wordPages as wordPage}
				{#each wordPage.list as word}
					<li>
						<a href="/w/{word.word}">{word.word}</a>
					</li>
				{/each}
			{/each}
		</ul>

		{#if hasMore()}
			<button class="bg-slate-800 p-2 text-stone-200 cursor-pointer" onclick={loadMore} disabled={loading}>
				{#if loading}
					Load more...
				{:else}
					Load more
				{/if}
			</button>
		{/if}
	</Stack>
{/if}
