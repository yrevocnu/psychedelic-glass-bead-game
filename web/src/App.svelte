<script>
	import { onMount } from 'svelte';

	export let card;
	export let decks = [];

	onMount(async () => {
		const res = await fetch('http://localhost:8000/decks');
		decks = await res.json();
	});

	async function draw(deck) {
		const res = await fetch(`http://localhost:8000/game/draw?deck=${deck}`, { method: 'POST'});
		card = await res.json();
		card.deck = deck;
	}
</script>

<main>
	{#if card}
		<h1>{card.name}</h1>
		<p>{card.description}</p>
		<div class="card">
		<img src="http://localhost:8000/decks/{card.deck}/{card.image}" alt={card.description}/>
		</div>
	{/if}

	<div class="row">
	{#each decks as deck}
		<button on:click={draw(deck.name)}>{deck.name}</button>
	{/each}
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 400px;
		margin: 0 auto;
	}
	.row {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-around;
	}
	.card {
		margin: 2vh;
		height: 100%;
	}
	.card img {
		width: 100%;
	}
</style>