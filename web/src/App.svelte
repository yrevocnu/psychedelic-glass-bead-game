<script>
	import { onMount } from 'svelte';

	export let showReset;
	export let card;
	export let decks = [];

	onMount(async () => {
		const res = await fetch('http://localhost:8000/decks');
		decks = await res.json();

		console.log('hi', showReset);
	});

	async function draw(deck) {
		const res = await fetch(`http://localhost:8000/game/draw?deck=${deck}`, { method: 'POST'});
		card = await res.json();
		card.deck = deck;
	}

	async function reset() {
		await fetch(`http://localhost:8000/game`, { method: 'POST'});
		showReset = true;
		card = undefined;
		setTimeout(() => {
			showReset = false;
		}, 3000);
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

	<div class="decks">
	{#each decks as deck}
		<div>
			<button on:click={() => draw(deck.name)}>{deck.name}</button>
			<p>{deck.description}</p>
		</div>
	{/each}
	</div>

	<div class="admin">
		{#if showReset}
			<p>Game has been reset!</p>
		{/if}
		<button on:click={reset}>reset</button>
	</div>
</main>

<style>
	main {
		text-align: center;
		padding: 1em;
		max-width: 50%;
		margin: 0 auto;
	}
	.decks {
		display: flex;
		flex-flow: row wrap;
		justify-content: space-around;
	}
	.decks p {
		font-size: 11px;
		text-transform: uppercase;
		color: red;
	}
	.card {
		margin: 2vh;
		height: 600px;
	}
	.card img {
		height: 100%;
	}
	button {
		background-color:black;
		border: 1px solid white;
		color: white;
	}
	button:hover {
		background-color: white;
		color: black;
		cursor: pointer;
	}

	.admin {
		position: absolute;
		bottom: 10px;
		left: 10px;
	}
</style>