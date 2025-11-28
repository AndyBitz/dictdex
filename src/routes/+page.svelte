<script lang="ts">
	import type { PageProps } from './$types';
	import Word from '$lib/components/Word.svelte';
	import WordList from '$lib/components/WordList.svelte';
    import Stack from '$lib/components/Stack.svelte';
    import Container from '$lib/components/Container.svelte';

	const { data, form }: PageProps = $props();
	console.log(data);
</script>

<Container>
	<Stack class="flex flex-col gap-2">
		<form method="POST" class="flex gap-2">
			<input
				type="text"
				name="word"
				placeholder="renitent"
				value="{form?.word}" 
				class="focus:outline-none border-1 border-slate-600 p-2 focus:bg-slate-800 focus:text-stone-200"
			/>
			<button
				type="submit"
				class="cursor-pointer p-2 border-1 border-slate-600 hover:bg-slate-800 hover:text-stone-200"
			>
				Define
			</button>
		</form>

		{#if form?.error}
			<section class="text-red-700">
				<p>Error: {form.error.message}</p>
			</section>
		{/if}
	</Stack>

	{#if form?.word}
		<Word form={form} />
	{/if}
	
	<WordList initialData={data.words} />
</Container>
