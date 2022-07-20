import { writable } from 'svelte/store';

export let countries = writable(['Ireland', 'Scotland', 'South Africa', 'United Kingdom', 'United States of America'])