import { derived, writable } from 'svelte/store';

const STORAGE_KEY = 'appetite_cart';

function createCartStore() {
  const initial = typeof localStorage === 'undefined' ? [] : JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
  const { subscribe, update } = writable(initial);

  const persist = (items) => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    return items;
  };

  return {
    subscribe,
    add: (product) =>
      update((items) => {
        const idx = items.findIndex((item) => item.id === product.id);
        if (idx > -1) {
          const next = [...items];
          next[idx] = { ...next[idx], quantity: next[idx].quantity + 1 };
          return persist(next);
        }
        return persist([...items, { ...product, quantity: 1 }]);
      }),
    updateQty: (id, delta) =>
      update((items) => {
        const next = items
          .map((item) => (item.id === id ? { ...item, quantity: item.quantity + delta } : item))
          .filter((item) => item.quantity > 0);
        return persist(next);
      }),
    clear: () => update(() => persist([]))
  };
}

export const cart = createCartStore();

export const cartCount = derived(cart, ($cart) => $cart.reduce((sum, item) => sum + item.quantity, 0));
export const cartSubtotal = derived(cart, ($cart) => $cart.reduce((sum, item) => sum + item.price * item.quantity, 0));
export const cartTax = derived(cartSubtotal, ($subtotal) => $subtotal * 0.05);
export const cartTotal = derived([cartSubtotal, cartTax], ([$subtotal, $tax]) => $subtotal + $tax);
