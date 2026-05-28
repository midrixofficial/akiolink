// Re-exporting from dynamic brand store for backward compatibility
import { get } from 'svelte/store';
import { products as productsStore, categories as categoriesStore } from './brand.js';

export const products = get(productsStore);
export const categories = get(categoriesStore);
