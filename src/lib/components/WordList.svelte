<script lang="ts">
    import { untrack } from 'svelte';
    import Stack from './Stack.svelte';

	const { initialData } = $props();

	let wordPages = $state(initialData ? [initialData] : []);
	let loading = $state(false);

	let search = $state('');
	let debouncedSearch = $state('');
	
	const fetchWords = async ({
		signal,
		after,
		containing,
	}: {
		signal?: AbortSignal,
		after?: string | null,
		containing?: string | null,
	} = {}) => {
		const qs = new URLSearchParams();
		if (after) qs.set('after', after);
		if (containing) qs.set('containing', containing);
		return fetch(`/api/words?${qs.toString()}`, {
			signal,
		}).then(res => res.json());
	};

	const hasMore = () => Boolean(wordPages[wordPages.length - 1].moreAfter);

	const loadMore = async () => {
		loading = true;

		const after = wordPages[wordPages.length - 1]?.moreAfter;
		const containing = debouncedSearch || null;

		const next = await fetchWords({ after, containing })
			.finally(() => {
				loading = false;
			});
	
		wordPages.push(next);
	};

	let timeout: NodeJS.Timeout;
	$effect(() => {
		if (search === untrack(() => debouncedSearch)) return;
		
		const nextSearch = search;
		const ac = new AbortController();
		
		timeout = setTimeout(async () => {
			untrack(() => {
				debouncedSearch = nextSearch;
				loading = true;
			});

			await fetchWords({ containing: nextSearch, signal: ac.signal })
				.then((page) => {
					untrack(() => {
						wordPages = [page];
					});
				})
				.catch((error) => {
					console.log('catch', error);
					if (error === 'stale') return;
					throw error;
				})
				.finally(() => {
					untrack(() => {
						loading = false;
					});
				});
		}, 400);

		return () => {
			ac.abort('stale');
			clearInterval(timeout);
		};
	});
</script>

<Stack class="flex flex-col gap-4">
	<input
		type="text"
		name="search"
		placeholder="search"
		class="focus:outline-none border-1 border-slate-600 p-2 focus:bg-slate-800 focus:text-stone-200"
		bind:value={search}
	/>

	{#if wordPages.length > 0}
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
	{/if}
</Stack>
