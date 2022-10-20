import { writable } from "svelte/store";

export let waiting_for_payment = writable(false)