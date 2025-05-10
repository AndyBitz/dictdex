<script lang="ts">
	import type { PageProps } from './$types';

	const { data, form }: PageProps = $props();
</script>

<main class="flex flex-col items-center justify-center m-4 gap-8">
	<form method="POST" class="border-3 border-amber-700">
		<input type="text" name="word" placeholder="renitent" value="{form?.word}" class="p-2" />
		<button type="submit" class="p-2">Search</button>
	</form>

	{#if form?.word}
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
