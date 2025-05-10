<script lang="ts">
	import type { PageProps } from './$types';

	const { form }: PageProps = $props();
</script>

{#if form}
	<a href="/">Back to startpage</a>
{:else}
	<form method="POST">
		<input type="text" name="username" placeholder="username" />
		<input type="password" name="password" placeholder="password" />
		<button type="submit">Login</button>
	</form>
{/if}
