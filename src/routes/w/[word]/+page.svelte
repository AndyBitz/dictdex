<script lang="ts">
	import type { PageProps } from './$types'
	import Word from '../../../lib/components/Word.svelte';
    import Stack from '../../../lib/components/Stack.svelte';
    import Container from '../../../lib/components/Container.svelte';
	
	const { data }: PageProps = $props();
</script>

<Container>
	<Stack>
		<a href="/">Home</a>
	</Stack>

	{#if data?.word}
		<Word form={data.word} />
	{/if}
</Container>
