<script lang="ts">
    import Stack from './Stack.svelte';

	const { form } = $props();
</script>

<Stack>
	<section class="flex flex-col gap-4 max-w-128">
		<h2 class="text-3xl font-bold">{form.word}</h2>
		<p>{form.language}</p>
		<p>
			{#each form.types as type}
				<span class="text-sm font-semibold text-gray-500">{type}</span>
				&nbsp;
			{/each}
		</p>
		<p>{form.description}</p>

		<h3 class="text-2xl font-bold">Examples</h3>
		{#each form.examples as example}
			<p>{example}</p>
		{/each}
	</section>
</Stack>