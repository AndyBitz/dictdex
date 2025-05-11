<script lang="ts">
    import Container from '../../lib/components/Container.svelte';
	import Stack from '../../lib/components/Stack.svelte';
	import type { PageProps } from './$types';

	const { form }: PageProps = $props();
</script>

<Container>
	<Stack class="flex flex-row items-center gap-4">
		<a href="/">Home</a>
		<form method="POST" class="flex gap-2">
			<button
				type="submit"
				class="cursor-pointer p-2 border-1 border-slate-600 hover:bg-slate-800 hover:text-stone-200"
			>
				Logout	
			</button>
		</form>
	</Stack>
</Container>
