import { writable } from "svelte/store";

export let show_notification = writable(false)
export let message = writable("Test")