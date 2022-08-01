import { writable } from 'svelte/store';

export let num_items = writable(0)
export let cart_items = writable([])