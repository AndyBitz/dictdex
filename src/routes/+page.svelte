<script lang="ts">
	import type { PageProps } from './$types';
	import Word from '$lib/components/Word.svelte';

	const { data, form }: PageProps = $props();
</script>

<main class="flex flex-col items-center justify-center m-4 gap-8">
	<form method="POST" class="border-3 border-amber-700">
		<input type="text" name="word" placeholder="renitent" value="{form?.word}" class="p-2" />
		<button type="submit" class="p-2">Search</button>
	</form>
	
	{#if form?.error}
		<section class="text-red-700">
			<p>Error: {form.error.message}</p>
		</section>
	{/if}

	{#if form?.word}
		<Word form={form} />
	{/if}
	
	{#if data.words}
		<section class="mt-8 min-w-full max-w-128">
			<ul class="flex flex-col justify-start gap-2">
				{#each data.words as word}
					<li>
						<a href="/w/{word.word}">{word.word}</a>
					</li>
				{/each}
			</ul>
		</section>
	{/if}
</main>
