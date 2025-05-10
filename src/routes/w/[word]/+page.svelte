<script lang="ts">
	import type { PageProps } from './$types'
	import Word from '$lib/components/Word.svelte';
	
	const { data }: PageProps = $props();
	console.log({ data });
</script>

<section>
	<a href="/">Back</a>

	{#if data?.word}
		<Word form={data.word} />
	{/if}
</section>
