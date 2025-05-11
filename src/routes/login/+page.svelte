<script lang="ts">
    import Stack from '../../lib/components/Stack.svelte';
	import type { PageProps } from './$types';

	const { form }: PageProps = $props();
</script>

<Stack>
	{#if form}
		<a href="/">Back to startpage</a>
	{:else}
		<form method="POST" class="flex gap-2">
			<input
				type="text"
				name="username"
				placeholder="username"
				class="focus:outline-none border-1 border-slate-600 p-2 focus:bg-slate-800 focus:text-stone-200"
			/>
			<input
				type="password"
				name="password"
				placeholder="password"
				class="focus:outline-none border-1 border-slate-600 p-2 focus:bg-slate-800 focus:text-stone-200"
			/>
			<button
				type="submit"
				class="cursor-pointer p-2 border-1 border-slate-600 hover:bg-slate-800 hover:text-stone-200"
			>
				Login
			</button>
		</form>
	{/if}
</Stack>
