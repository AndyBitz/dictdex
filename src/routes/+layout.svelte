<script lang="ts">
	import '../app.css';
	import { mountVercelToolbar } from '@vercel/toolbar/vite';
	import { onMount } from 'svelte';

	let { data, children } = $props();

	// You should inject the toolbar conditionally
	// to avoid showing it to all visitors
	onMount(() => data?.user ? mountVercelToolbar() : null);
</script>

<main class="m-4">
	{@render children()}
</main>
