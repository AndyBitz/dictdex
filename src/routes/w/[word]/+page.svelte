<script lang="ts">
	import type { PageProps } from './$types'
	import { goto } from '$app/navigation';
	import Word from '../../../lib/components/Word.svelte';
    import Stack from '../../../lib/components/Stack.svelte';
    import Container from '../../../lib/components/Container.svelte';
	
	const { data }: PageProps = $props();
	
	const deleteWord = async () => {
		await fetch(`/api/words/${data.word.id}`, {
			method: 'DELETE',
		}).then(res => res.json());
		
		goto('/');
	};
</script>

<Container>
	<Stack>
		<a href="/">Home</a>
	</Stack>

	{#if data?.word}
		<Word form={data.word} />
	{/if}
	
	<Stack>
		<button
			onclick={deleteWord}
			class="cursor-pointer p-2 border-1 border-slate-600 hover:bg-slate-800 hover:text-stone-200"
		>
			Delete
		</button>
	</Stack>
</Container>
