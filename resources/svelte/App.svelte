<script>
  import FoodCard from './components/FoodCard.svelte';
  import { cart, cartCount, cartSubtotal, cartTax, cartTotal } from './lib/cart.js';
  import {
    brand,
    brandName,
    brandAddress,
    headerAction,
    theme,
    products,
    recommendedProducts,
    categories
  } from './lib/brand.js';
  import { onMount } from 'svelte';
  import axios from 'axios';

  let customerName = '';
  let customerPhone = '';
  let deliveryAddress = '';
  let submitError = '';
  let isPlacingOrder = false;

  let isCheckout = window.location.pathname.includes('checkout');
  let themeMode = 'light';
  let isLoading = true;

  let search = '';
  let activeCategory = 'All';

  // ── Navigation ──
  const goCheckout = () => {
    isLoading = true;
    isCheckout = true;
    window.history.pushState({ isCheckout: true }, '', '/checkout.html');
    setTimeout(() => {
      isLoading = false;
    }, 600);
  };

  const goHome = () => {
    isLoading = true;
    isCheckout = false;
    window.history.pushState({ isCheckout: false }, '', '/index.html');
    setTimeout(() => {
      isLoading = false;
    }, 600);
  };

  // ── Cart helpers ──
  const add    = (product) => cart.add(product);
  const update = (id, delta) => cart.updateQty(id, delta);

  const money = (n) =>
    `₹${n.toLocaleString('en-IN', Number.isInteger(n) ? undefined : { minimumFractionDigits: 2 })}`;

  // ── Filtered & grouped products ──
  $: filtered = $products
    .filter((p) => activeCategory === 'All' || p.category === activeCategory)
    .filter((p) => p.name.toLowerCase().includes(search.toLowerCase()));

  $: groupedByCategory = filtered.reduce((acc, p) => {
    if (!acc[p.category]) acc[p.category] = [];
    acc[p.category].push(p);
    return acc;
  }, {});

  // ── Search placeholder animation ──
  let searchInput;
  const phrases = [
    "Looking for something bussin? 🍝",
    "No cap, we have the best burgers 🍔",
    "Searching for main character energy? 🍕",
    "Satisfy your cravings, fr fr 🍟",
    "Lowkey want a dessert right now? 🍰",
    "Best pizza in town, periodt. 💅",
    "Hungry? Mood. 🍩",
    "That pizza is a whole vibe 🍕✨"
  ];

  let typingTimeout;
  
  $: if (isCheckout) {
    setTimeout(initSwipe, 50);
  }

  $: if (!isCheckout && searchInput) {
    clearTimeout(typingTimeout);
    let pi = 0, ci = 0, deleting = false;
    function type() {
      if (isCheckout || !searchInput) return;
      const phrase = phrases[pi];
      if (deleting) {
        searchInput.placeholder = phrase.substring(0, --ci);
      } else {
        searchInput.placeholder = phrase.substring(0, ++ci);
      }
      let delay = deleting ? 50 : 100;
      if (!deleting && ci === phrase.length) { deleting = true; delay = 2000; }
      else if (deleting && ci === 0) { deleting = false; pi = (pi + 1) % phrases.length; delay = 500; }
      typingTimeout = setTimeout(type, delay);
    }
    type();
  }

  onMount(() => {
    // Parse query params to dynamically customize brand
    const params = new URLSearchParams(window.location.search);
    const brandNameParam = params.get('brandName');
    const brandColorParam = params.get('brandColor');
    const brandAddressParam = params.get('brandAddress');
    const taglineParam = params.get('tagline');
    themeMode = params.get('themeMode') || 'light';

    if (brandNameParam || brandColorParam || brandAddressParam || taglineParam) {
      brand.update(b => {
        const updated = { ...b };
        if (brandNameParam) updated.brandName = brandNameParam;
        if (brandAddressParam) updated.brandAddress = brandAddressParam;
        else if (taglineParam) updated.brandAddress = taglineParam;
        
        if (brandColorParam) {
          updated.theme = {
            ...updated.theme,
            primaryColor: brandColorParam,
            primaryLightColor: brandColorParam + '15' // ~8% opacity hex tint
          };
        }
        return updated;
      });
    }

    // Initial loading simulated animation for the premium look!
    setTimeout(() => {
      isLoading = false;
    }, 700);

    // Listen to browser back/forward buttons
    const handlePopState = (event) => {
      isLoading = true;
      isCheckout = window.location.pathname.includes('checkout');
      setTimeout(() => {
        isLoading = false;
      }, 600);
    };
    window.addEventListener('popstate', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      clearTimeout(typingTimeout);
    };
  });

  const confirmOrder = async () => {
    submitError = '';
    if (!customerName || !customerPhone || !deliveryAddress) {
      submitError = 'Please fill out all fields before swiping.';
      return false;
    }

    isPlacingOrder = true;
    try {
      const itemsPayload = $cart.map(item => ({
        product_name: item.name,
        price: item.price,
        quantity: item.quantity,
        product_id: item.id.toString().startsWith('p') ? null : item.id
      }));

      const res = await axios.post('/api/open/orders', {
        merchant_slug: window.merchantSlug || 'the-vellore-kitchen',
        customer_name: customerName,
        customer_phone: customerPhone,
        delivery_address: deliveryAddress,
        total_amount: $cartTotal,
        items: itemsPayload
      });

      orderSuccess = true;
      cart.clear();
      return true;
    } catch (err) {
      console.error(err);
      submitError = 'Failed to place order. Please try again.';
      return false;
    } finally {
      isPlacingOrder = false;
    }
  };

  // ── Swipe-to-confirm ──
  function initSwipe() {
    const container = document.getElementById('swipe-confirm-container');
    const handle    = document.getElementById('swipe-handle');
    const textEl    = document.getElementById('swipe-text');
    if (!container || !handle) return;

    let dragging = false, startX = 0;
    const maxDist = () => container.offsetWidth - handle.offsetWidth - 8;

    const onStart = (e) => {
      if (container.classList.contains('confirmed') || isPlacingOrder) return;
      dragging = true;
      startX = e.type === 'touchstart' ? e.touches[0].clientX : e.clientX;
      handle.style.transition = 'none';
    };
    const onMove = (e) => {
      if (!dragging) return;
      const cx = e.type === 'touchmove' ? e.touches[0].clientX : e.clientX;
      const m = maxDist();
      let dx = Math.min(Math.max(cx - startX, 0), m);
      handle.style.transform = `translateX(${dx}px)`;
      textEl.style.opacity = String(1 - dx / m);
    };
    const onEnd = () => {
      if (!dragging) return;
      dragging = false;
      const m = maxDist();
      const mat = new WebKitCSSMatrix(getComputedStyle(handle).transform);
      if (mat.m41 >= m * 0.9) {
        if (!customerName || !customerPhone || !deliveryAddress) {
          submitError = 'Please fill out all fields before swiping.';
          handle.style.transition = 'transform .3s ease-out';
          handle.style.transform  = 'translateX(0px)';
          textEl.style.opacity = '1';
          return;
        }

        handle.style.transition = 'transform .2s ease-out';
        handle.style.transform  = `translateX(${m}px)`;
        container.classList.add('confirmed');
        textEl.textContent = 'Processing...';
        handle.innerHTML = '<span class="material-symbols-outlined animate-spin" style="color:#006d35; font-size:16px;">sync</span>';

        confirmOrder().then(success => {
          if (success) {
            textEl.textContent = 'Order Confirmed!';
            handle.innerHTML = '<span class="material-symbols-outlined" style="color:#006d35">check</span>';
          } else {
            container.classList.remove('confirmed');
            handle.style.transition = 'transform .3s ease-out';
            handle.style.transform  = 'translateX(0px)';
            textEl.style.opacity = '1';
            textEl.textContent = 'Slide to Confirm →';
            handle.innerHTML = '<span class="material-symbols-outlined" style="color:#a93100; font-size:18px;">chevron_right</span>';
          }
        });
      } else {
        handle.style.transition = 'transform .3s ease-out';
        handle.style.transform  = 'translateX(0px)';
        textEl.style.opacity = '1';
      }
    };

    handle.addEventListener('mousedown', onStart);
    window.addEventListener('mousemove', onMove);
    window.addEventListener('mouseup', onEnd);
    handle.addEventListener('touchstart', onStart, { passive: true });
    window.addEventListener('touchmove', onMove, { passive: true });
    window.addEventListener('touchend', onEnd);
  }

  let orderSuccess = false;
</script>

<svelte:head>
  <title>{isCheckout ? `Checkout - ${$brandName}` : $brandName}</title>
  <link href="https://fonts.googleapis.com/css2?family={encodeURIComponent($theme.fontDisplay)}:wght@400;600;700;800&family={encodeURIComponent($theme.fontSans)}:wght@400;500;600&display=swap" rel="stylesheet" />
</svelte:head>

<div
  style="
    --primary: {$theme.primaryColor};
    --primary-light: {$theme.primaryLightColor};
    --on-primary: {$theme.onPrimaryColor};
    --font-display: '{$theme.fontDisplay}', sans-serif;
    --font-sans: '{$theme.fontSans}', sans-serif;
    --bg-color: {themeMode === 'dark' ? '#0f172a' : themeMode === 'glass' ? 'transparent' : '#f9f9f9'};
    --topbar-bg: {themeMode === 'dark' ? 'rgba(15,23,42,.9)' : themeMode === 'glass' ? 'rgba(255,255,255,.4)' : 'rgba(249,249,249,.9)'};
    --search-wrap-bg: {themeMode === 'dark' ? '#0f172a' : themeMode === 'glass' ? 'transparent' : '#f9f9f9'};
    --card-bg: {themeMode === 'dark' ? '#1e293b' : themeMode === 'glass' ? 'rgba(255,255,255,.5)' : '#ffffff'};
    --card-border: {themeMode === 'dark' ? 'rgba(255,255,255,.05)' : themeMode === 'glass' ? 'rgba(255,255,255,.2)' : 'rgba(226,226,226,.5)'};
    --text-color: {themeMode === 'dark' ? '#f3f4f6' : '#1a1c1c'};
    --text-muted: {themeMode === 'dark' ? '#9ca3af' : '#5c4037'};
    --chip-bg: {themeMode === 'dark' ? '#334155' : themeMode === 'glass' ? 'rgba(255,255,255,.3)' : '#eeeeee'};
    --cat-header-bg: {themeMode === 'dark' ? 'rgba(51,65,85,.5)' : themeMode === 'glass' ? 'rgba(255,255,255,.2)' : 'rgba(238,238,238,.6)'};
    --restaurant-addr-color: {themeMode === 'dark' ? '#9ca3af' : 'rgba(92,64,55,.7)'};
    display: flex;
    flex-direction: column;
    min-height: max(884px, 100dvh);
    background: var(--bg-color);
    color: var(--text-color);
  "
>



<!-- ════════════════════════════════════
     HOME PAGE
     ════════════════════════════════════ -->
{#if !isCheckout}

  <!-- Header -->
  <header class="topbar">
    <div class="topbar-text">
      <h1 class="restaurant-name">{$brandName}</h1>
      <p class="restaurant-addr">{$brandAddress}</p>
    </div>
    {#if $headerAction.type === 'call'}
      <a href="tel:{$headerAction.value}" class="call-btn">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">{$headerAction.icon}</span>
      </a>
    {:else if $headerAction.type === 'link'}
      <a href={$headerAction.value} class="call-btn">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1;">{$headerAction.icon}</span>
      </a>
    {/if}
  </header>

  {#if isLoading}
    <!-- Skeleton Search -->
    <div class="search-wrap">
      <div class="skeleton-search skeleton-shimmer"></div>
    </div>

    <!-- Skeleton Category Chips -->
    <div class="chips-bar">
      <div class="skeleton-chips-scroll">
        <div class="skeleton-chip skeleton-shimmer"></div>
        <div class="skeleton-chip skeleton-shimmer"></div>
        <div class="skeleton-chip skeleton-shimmer"></div>
        <div class="skeleton-chip skeleton-shimmer"></div>
      </div>
    </div>

    <!-- Skeleton Food List -->
    <div class="skeleton-list">
      {#each Array(4) as _}
        <div class="skeleton-card">
          <div class="skeleton-img skeleton-shimmer"></div>
          <div class="skeleton-info">
            <div class="skeleton-title skeleton-shimmer"></div>
            <div class="skeleton-desc skeleton-shimmer"></div>
            <div class="skeleton-footer">
              <div class="skeleton-price skeleton-shimmer"></div>
              <div class="skeleton-btn skeleton-shimmer"></div>
            </div>
          </div>
        </div>
      {/each}
    </div>
  {:else}
    <!-- Search -->
    <div class="search-wrap">
      <div class="search-inner">
        <span class="material-symbols-outlined search-icon">search</span>
        <input
          bind:this={searchInput}
          bind:value={search}
          type="text"
          placeholder="Search delicious food..."
          class="search-input"
        />
      </div>
    </div>

    <!-- Category Chips -->
    <div class="chips-bar">
      <div class="chips-scroll hide-scrollbar">
        {#each $categories as cat}
          <button
            on:click={() => (activeCategory = cat)}
            class="chip {activeCategory === cat ? 'chip-active' : ''}"
          >{cat}</button>
        {/each}
      </div>
    </div>

    <!-- Food List -->
    <main class="food-list">
      {#each Object.entries(groupedByCategory) as [cat, items]}
        <div class="cat-header">
          <span class="cat-label">{cat}</span>
        </div>
        {#each items as product}
          <FoodCard {product} quantity={$cart.find((i) => i.id === product.id)?.quantity || 0} onAdd={add} onUpdate={update} />
        {/each}
      {/each}
    </main>

    <!-- Floating Cart -->
    {#if $cartCount > 0}
      <div class="floating-cart cart-shadow">
        <div class="floating-left">
          <div class="floating-icon-bg">
            <span class="material-symbols-outlined" style="font-size:18px; font-variation-settings:'FILL' 1;">shopping_bag</span>
          </div>
          <div>
            <p class="floating-count">{$cartCount} Item{$cartCount > 1 ? 's' : ''} Added</p>
            <p class="floating-price">{money($cartSubtotal)}</p>
          </div>
        </div>
        <button on:click={goCheckout} class="floating-action">
          View Cart
          <span class="material-symbols-outlined" style="font-size:18px;">chevron_right</span>
        </button>
      </div>
    {/if}
  {/if}

<!-- ════════════════════════════════════
     CHECKOUT PAGE
     ════════════════════════════════════ -->
{:else}

  <!-- Header -->
  <header class="topbar topbar-checkout">
    <button on:click={goHome} class="back-btn">
      <span class="material-symbols-outlined" style="font-size:22px;">arrow_back</span>
    </button>
    <h1 class="checkout-title">Checkout</h1>
    <div class="topbar-spacer"></div>
  </header>

  {#if isLoading}
    <main class="checkout-main">
      <!-- Skeleton Selection Block -->
      <div class="skeleton-selection-title skeleton-shimmer"></div>
      <div class="skeleton-bill-card">
        <div class="skeleton-bill-line skeleton-shimmer" style="width: 80%;"></div>
        <div class="skeleton-bill-line skeleton-shimmer" style="width: 65%;"></div>
      </div>

      <!-- Skeleton Bill Card -->
      <div class="skeleton-bill-card">
        <div class="skeleton-bill-line skeleton-shimmer" style="width: 100%;"></div>
        <div class="skeleton-bill-line skeleton-shimmer" style="width: 100%;"></div>
        <div class="skeleton-bill-line skeleton-shimmer" style="width: 100%;"></div>
        <div class="skeleton-bill-line skeleton-shimmer" style="width: 40%; height: 18px; margin-top: 8px;"></div>
      </div>

      <!-- Skeleton Recommended -->
      <div class="skeleton-selection-title skeleton-shimmer" style="width: 150px; margin-top: 24px;"></div>
      <div class="skeleton-rec-grid">
        {#each Array(2) as _}
          <div class="skeleton-rec-card">
            <div class="skeleton-rec-img skeleton-shimmer"></div>
            <div class="skeleton-rec-title skeleton-shimmer"></div>
            <div class="skeleton-rec-footer">
              <div class="skeleton-rec-price skeleton-shimmer"></div>
              <div class="skeleton-rec-btn skeleton-shimmer"></div>
            </div>
          </div>
        {/each}
      </div>
    </main>
  {:else}
    <main class="checkout-main">

    <!-- Section label -->
    <div class="section-label">
      <h2 class="section-title">Your Selection</h2>
      <p class="section-sub">Review items before confirming</p>
    </div>

    <!-- Cart items -->
    <div class="bill-card card-shadow">
      {#if $cart.length === 0}
        <div class="empty-cart">Your cart is empty</div>
      {:else}
        {#each $cart as item, i}
          <div class="cart-line" style="{i < $cart.length - 1 ? 'border-bottom:1px solid #eeeeee;' : ''}">
            <div class="cart-line-name">
              <div class="cart-veg-wrap">
                <div class={item.type === 'veg' ? 'veg-box' : 'nonveg-box'}>
                  <div class={item.type === 'veg' ? 'veg-dot' : 'nonveg-tri'}></div>
                </div>
                <h3 class="cart-item-name">{item.name}</h3>
              </div>
            </div>
            <div class="cart-line-right">
              <span class="cart-item-price">{money(item.price * item.quantity)}</span>
              <div class="qty-ctrl">
                <button on:click={() => update(item.id, -1)} class="qty-btn qty-btn-minus">
                  <span class="material-symbols-outlined" style="font-size:15px;">remove</span>
                </button>
                <span class="qty-num">{item.quantity}</span>
                <button on:click={() => update(item.id, 1)} class="qty-btn qty-btn-plus">
                  <span class="material-symbols-outlined" style="font-size:15px;">add</span>
                </button>
              </div>
            </div>
          </div>
        {/each}
      {/if}
    </div>

    <!-- Bill Details -->
    <div class="bill-card card-shadow">
      <div class="bill-rows">
        <div class="bill-row">
          <span class="bill-label">Subtotal</span>
          <span class="bill-value">{money($cartSubtotal)}</span>
        </div>
        <div class="bill-row">
          <span class="bill-label">Delivery Fee</span>
          <span class="bill-value" style="color:#006d35;">FREE</span>
        </div>
        <div class="bill-row">
          <span class="bill-label">Taxes &amp; Charges (5%)</span>
          <span class="bill-value">{money($cartTax)}</span>
        </div>
      </div>
      <div class="bill-divider"></div>
      <div class="bill-total-row">
        <span class="bill-total-label">To Pay</span>
        <span class="bill-total-amount">{money($cartTotal)}</span>
      </div>
    </div>

    <!-- Recommended -->
    <div class="section-label" style="margin-top:32px;">
      <h2 class="section-title">Recommended for you</h2>
      <p class="section-sub">Complete your meal with these favorites</p>
    </div>

    <div class="rec-grid">
      {#each $recommendedProducts as rec}
        <div class="rec-card card-shadow">
          <div class="rec-img-wrap">
            <img src={rec.image} alt={rec.name} class="rec-img" />
          </div>
          <div class="rec-info">
            <div class="rec-name-row">
              <div class={rec.type === 'veg' ? 'veg-box' : 'nonveg-box'} style="width:12px;height:12px;">
                <div class={rec.type === 'veg' ? 'veg-dot' : 'nonveg-tri'}></div>
              </div>
              <h3 class="rec-name">{rec.name}</h3>
            </div>
            <div class="rec-footer">
              <span class="rec-price">₹{rec.price}</span>
              {#if $cart.find(item => item.id === rec.id)}
                {@const cartItem = $cart.find(item => item.id === rec.id)}
                <div class="qty-ctrl" style="background:#f3f3f3; border-radius:999px; padding:2px; gap:8px; display:flex; align-items:center;">
                  <button on:click={() => update(rec.id, -1)} class="qty-btn qty-btn-minus" style="width:28px; height:28px; border-radius:999px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <span class="material-symbols-outlined" style="font-size:14px;">remove</span>
                  </button>
                  <span class="qty-num" style="width:12px; font-size:13px; text-align:center; font-weight:600; color:#1a1c1c;">{cartItem.quantity}</span>
                  <button on:click={() => update(rec.id, 1)} class="qty-btn qty-btn-plus" style="width:28px; height:28px; border-radius:999px; border:none; display:flex; align-items:center; justify-content:center; cursor:pointer;">
                    <span class="material-symbols-outlined" style="font-size:14px;">add</span>
                  </button>
                </div>
              {:else}
                <button on:click={() => cart.add({...rec, quantity:1})} class="rec-add-btn">Add</button>
              {/if}
            </div>
          </div>
        </div>
      {/each}
    </div>

    <!-- Customer Details Form -->
    <div class="section-label" style="margin-top:32px;">
      <h2 class="section-title">Delivery Details</h2>
      <p class="section-sub">Enter your details to confirm delivery</p>
    </div>

    <div class="bill-card card-shadow" style="padding: 16px;">
      {#if submitError}
        <div class="error-box">
          {submitError}
        </div>
      {/if}

      <div class="form-group">
        <label class="form-label" for="customer-name">Full Name</label>
        <input 
          id="customer-name"
          type="text" 
          placeholder="Enter your name" 
          class="form-input" 
          bind:value={customerName}
          disabled={isPlacingOrder}
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="customer-phone">Mobile Number</label>
        <input 
          id="customer-phone"
          type="tel" 
          placeholder="e.g. +91 98765 43210" 
          class="form-input" 
          bind:value={customerPhone}
          disabled={isPlacingOrder}
        />
      </div>

      <div class="form-group">
        <label class="form-label" for="delivery-addr">Delivery Address</label>
        <textarea 
          id="delivery-addr"
          placeholder="Enter your street address, apartment, city" 
          class="form-input form-textarea" 
          bind:value={deliveryAddress}
          disabled={isPlacingOrder}
        ></textarea>
      </div>
    </div>

    <!-- Payment Method -->
    <div class="payment-card card-shadow">
      <div class="payment-left">
        <div class="payment-icon-bg">
          <span class="material-symbols-outlined" style="font-size:18px; color:#a93100;">payments</span>
        </div>
        <div>
          <p class="payment-label">Payment Method</p>
          <p class="payment-value">Cash on Delivery</p>
        </div>
      </div>
      <span class="material-symbols-outlined" style="font-size:18px; color:#5c4037;">chevron_right</span>
    </div>

  </main>

  <!-- Floating Confirm Bar -->
  <div class="floating-cart cart-shadow">
    <div class="floating-left">
      <div class="floating-icon-bg">
        <span class="material-symbols-outlined" style="font-size:18px; font-variation-settings:'FILL' 1;">check_circle</span>
      </div>
      <div>
        <p class="floating-count">Total to Pay</p>
        <p class="floating-price">{money($cartTotal)}</p>
      </div>
    </div>
    <div id="swipe-confirm-container" class="swipe-container">
      <span id="swipe-text" class="swipe-text">Slide to Confirm →</span>
      <div id="swipe-handle" class="swipe-handle">
        <span class="material-symbols-outlined" style="color:#a93100; font-size:18px;">chevron_right</span>
      </div>
    </div>
  </div>
  {/if}

  <!-- Order Success Screen -->
  {#if orderSuccess}
    <div id="order-success-screen" class="show">
      <div class="success-icon-wrapper">
        <span class="material-symbols-outlined" style="font-variation-settings:'FILL' 1; font-size:48px; color:#006d35;">check_circle</span>
      </div>
      <div class="success-content">
        <h2 style="font-family:'Plus Jakarta Sans',sans-serif; font-size:24px; color:#1a1c1c; margin:0 0 8px;">Order Placed!</h2>
        <p style="color:#5c4037; font-size:14px; margin:0 0 24px;">Your delicious food is on its way.</p>
        <button on:click={goHome} class="success-btn">Back to Menu</button>
      </div>
    </div>
  {/if}

{/if}
</div>

<style>
  /* Support dark mode and glass mode overrides globally */
  .topbar { background: var(--topbar-bg) !important; }
  .restaurant-addr { color: var(--restaurant-addr-color) !important; }
  .search-wrap { background: var(--search-wrap-bg) !important; }
  .search-input { background: var(--card-bg) !important; border: 1px solid var(--card-border) !important; color: var(--text-color) !important; }
  .chips-bar { background: var(--topbar-bg) !important; border-bottom: 1px solid var(--card-border) !important; }
  .chip { background: var(--chip-bg) !important; color: var(--text-muted) !important; }
  .cat-header { background: var(--cat-header-bg) !important; }
  .cat-label { color: var(--text-muted) !important; }
  .bill-card { background: var(--card-bg) !important; border: 1px solid var(--card-border) !important; }
  .rec-card { background: var(--card-bg) !important; border: 1px solid var(--card-border) !important; }
  .payment-card { background: var(--card-bg) !important; border: 1px solid var(--card-border) !important; }
  .qty-ctrl { background: var(--chip-bg) !important; }
  .qty-btn-minus { background: var(--chip-bg) !important; color: var(--primary) !important; }
  .qty-num { color: var(--text-color) !important; }
  .cart-item-name { color: var(--text-color) !important; }
  .bill-label { color: var(--text-muted) !important; }
  .bill-value { color: var(--text-color) !important; }
  .bill-total-label { color: var(--text-color) !important; }
  .rec-name { color: var(--text-color) !important; }
  .payment-label { color: var(--text-muted) !important; }
  .payment-value { color: var(--text-color) !important; }
  /* ── Layout ── */
  .topbar {
    background: rgba(249,249,249,.9);
    backdrop-filter: blur(20px);
    position: sticky; top: 0; z-index: 50;
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 20px; height: 56px;
  }
  .topbar-checkout { border-bottom: 1px solid rgba(226,226,226,.6); }
  .topbar-text { display: flex; flex-direction: column; min-width: 0; margin-right: 8px; max-width: 65%; }
  .restaurant-name {
    font-family: var(--font-display); font-weight: 800;
    font-size: 20px; line-height: 1.2; color: var(--primary); letter-spacing: -.02em; margin: 0;
  }
  .restaurant-addr {
    font-size: 11px; font-weight: 500; color: rgba(92,64,55,.7);
    line-height: 1; margin: 2px 0 0; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;
  }
  .call-btn {
    width: 36px; height: 36px; display: flex; align-items: center; justify-content: center;
    color: var(--primary); text-decoration: none; transition: transform .1s; flex-shrink: 0;
  }
  .call-btn :global(.material-symbols-outlined) { font-size: 24px; }

  /* ── Search ── */
  .search-wrap { padding: 4px 20px 16px; background: #f9f9f9; }
  .search-inner { position: relative; display: flex; align-items: center; }
  .search-icon { position: absolute; left: 16px; font-size: 20px; color: rgba(92,64,55,.6); z-index: 1; }
  .search-input {
    width: 100%; background: #fff; border: 1px solid rgba(226,226,226,.8);
    border-radius: 16px; padding: 14px 16px 14px 44px;
    font-family: var(--font-sans); font-size: 14px; font-weight: 500; color: #1a1c1c;
    outline: none; box-shadow: 0 2px 12px rgba(0,0,0,.06); transition: box-shadow .2s;
  }
  .search-input:focus { box-shadow: 0 2px 12px var(--primary-light); }

  /* ── Category Chips ── */
  .chips-bar {
    position: sticky; top: 56px; background: rgba(249,249,249,.9);
    backdrop-filter: blur(20px); z-index: 40;
    border-bottom: 1px solid rgba(226,226,226,.6);
  }
  .chips-scroll { display: flex; gap: 8px; padding: 12px 20px; overflow-x: auto; }
  .chip {
    border: none; cursor: pointer; padding: 8px 20px; border-radius: 999px;
    font-family: var(--font-sans); font-size: 13px; font-weight: 600;
    white-space: nowrap; transition: all .15s;
    background: #eeeeee; color: #5c4037;
    box-shadow: 0 1px 3px rgba(0,0,0,.08);
  }
  .chip-active { background: var(--primary) !important; color: #fff !important; }

  /* ── Food List ── */
  .food-list { flex-grow: 1; padding: 8px 20px 112px; max-width: 512px; margin: 0 auto; width: 100%; }
  .cat-header { background: rgba(238,238,238,.6); margin: 16px -20px 8px; padding: 8px 20px; }
  .cat-label { font-size: 11px; font-weight: 700; color: #5c4037; text-transform: uppercase; letter-spacing: .08em; }

  /* ── Floating Cart / Confirm Bar ── */
  .floating-cart {
    position: fixed; bottom: 16px; left: 50%; transform: translateX(-50%);
    width: calc(100% - 40px); max-width: 384px;
    background: var(--primary); color: #fff;
    border-radius: 12px; padding: 12px 16px;
    display: flex; justify-content: space-between; align-items: center; z-index: 60;
  }
  .floating-left { display: flex; align-items: center; gap: 12px; }
  .floating-icon-bg {
    background: rgba(255,255,255,.2); width: 36px; height: 36px;
    border-radius: 8px; display: flex; align-items: center; justify-content: center;
  }
  .floating-count { font-size: 11px; font-weight: 500; opacity: .8; line-height: 1; margin: 0 0 2px; }
  .floating-price { font-family: var(--font-display); font-weight: 700; font-size: 15px; line-height: 1; margin: 0; }
  .floating-action {
    display: flex; align-items: center; gap: 2px;
    font-family: var(--font-sans); font-size: 13px; font-weight: 600;
    background: transparent; border: none; color: #fff; cursor: pointer;
  }

  /* ── Checkout ── */
  .checkout-main { flex-grow: 1; padding: 20px 20px 128px; max-width: 512px; margin: 0 auto; width: 100%; }
  .checkout-title { font-family: var(--font-display); font-weight: 700; font-size: 17px; color: #1a1c1c; margin: 0; }
  .back-btn {
    width: 40px; height: 40px; border-radius: 999px; background: #eeeeee;
    border: none; display: flex; align-items: center; justify-content: center;
    color: var(--primary); cursor: pointer; transition: transform .1s;
  }
  .topbar-spacer { width: 36px; height: 36px; }

  .section-label { margin-bottom: 12px; }
  .section-title { font-family: var(--font-display); font-weight: 700; font-size: 16px; color: #1a1c1c; margin: 0; }
  .section-sub { font-size: 12px; color: #5c4037; font-weight: 500; margin: 4px 0 0; }

  /* ── Bill Card ── */
  .bill-card {
    background: #fff; border-radius: 12px; border: 1px solid rgba(226,226,226,.5);
    overflow: hidden; margin-bottom: 16px;
  }
  .empty-cart { padding: 32px; text-align: center; color: #5c4037; font-size: 14px; }

  .cart-line { display: flex; align-items: center; gap: 12px; padding: 14px 16px; }
  .cart-line-name { display: flex; flex-direction: column; flex-grow: 1; min-width: 0; }
  .cart-veg-wrap { display: flex; align-items: center; gap: 6px; margin-bottom: 2px; }
  .cart-item-name {
    font-family: var(--font-display); font-weight: 600; font-size: 13px; color: #1a1c1c;
    overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0;
  }
  .cart-line-right { display: flex; align-items: center; gap: 12px; flex-shrink: 0; }
  .cart-item-price { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--primary); }
  .qty-ctrl { display: flex; align-items: center; background: #f3f3f3; border-radius: 999px; padding: 2px; gap: 8px; }
  .qty-btn {
    width: 32px; height: 32px; border-radius: 999px; border: none;
    display: flex; align-items: center; justify-content: center; cursor: pointer; transition: transform .1s;
  }
  .qty-btn-minus { background: #e2e2e2; color: var(--primary); }
  .qty-btn-plus  { background: var(--primary); color: #fff; }
  .qty-num { font-size: 14px; font-weight: 600; color: #1a1c1c; width: 16px; text-align: center; }

  .bill-rows { padding: 16px 16px 12px; }
  .bill-row { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
  .bill-row:last-child { margin-bottom: 0; }
  .bill-label { font-size: 13px; color: #5c4037; font-weight: 500; }
  .bill-value { font-size: 13px; font-weight: 600; color: #1a1c1c; }
  .bill-divider { margin: 0 16px; border-top: 1px solid #eeeeee; }
  .bill-total-row { padding: 14px 16px; display: flex; justify-content: space-between; align-items: center; }
  .bill-total-label { font-family: var(--font-display); font-weight: 700; font-size: 15px; color: #1a1c1c; }
  .bill-total-amount { font-family: var(--font-display); font-weight: 700; font-size: 18px; color: var(--primary); }

  /* ── Recommended ── */
  .rec-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px; }
  .rec-card { background: #fff; border-radius: 12px; border: 1px solid rgba(226,226,226,.5); padding: 10px; display: flex; flex-direction: column; gap: 8px; }
  .rec-img-wrap { position: relative; width: 100%; aspect-ratio: 1; border-radius: 8px; overflow: hidden; background: #eee; }
  .rec-img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .rec-info { display: flex; flex-direction: column; gap: 4px; }
  .rec-name-row { display: flex; align-items: center; gap: 4px; }
  .rec-name { font-family: var(--font-display); font-weight: 600; font-size: 12px; color: #1a1c1c; overflow: hidden; text-overflow: ellipsis; white-space: nowrap; margin: 0; }
  .rec-footer { display: flex; align-items: center; justify-content: space-between; margin-top: 4px; }
  .rec-price { font-family: var(--font-display); font-weight: 700; font-size: 14px; color: var(--primary); }
  .rec-add-btn {
    background: var(--primary-light); color: var(--primary);
    font-family: var(--font-sans); font-size: 11px; font-weight: 700;
    padding: 6px 12px; border-radius: 8px; border: none; cursor: pointer; transition: transform .1s;
  }

  /* ── Payment ── */
  .payment-card {
    background: #fff; border-radius: 12px; border: 1px solid rgba(226,226,226,.5);
    padding: 14px 16px; display: flex; align-items: center; justify-content: space-between;
  }
  .payment-left { display: flex; align-items: center; gap: 12px; }
  .payment-icon-bg { width: 36px; height: 36px; border-radius: 8px; background: var(--primary-light); display: flex; align-items: center; justify-content: center; }
  .payment-label { font-size: 12px; color: #5c4037; font-weight: 500; line-height: 1; margin: 0 0 2px; }
  .payment-value { font-family: var(--font-display); font-weight: 600; font-size: 13px; color: #1a1c1c; line-height: 1; margin: 0; }

  /* ── Success btn ── */
  .success-btn {
    background: var(--primary); color: #fff;
    font-family: var(--font-sans); font-weight: 600; font-size: 14px;
    padding: 14px 32px; border-radius: 12px; border: none; cursor: pointer;
  }

  /* ── Skeleton Loading ── */
  .skeleton-shimmer {
    background: linear-gradient(90deg, #f3f3f3 25%, #e9e9e9 50%, #f3f3f3 75%);
    background-size: 200% 100%;
    animation: shimmer 1.4s infinite linear;
  }
  @keyframes shimmer {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .skeleton-search {
    height: 48px; border-radius: 16px; margin: 4px 20px 16px;
  }
  .skeleton-chips-scroll {
    display: flex; gap: 8px; padding: 12px 20px; overflow: hidden;
  }
  .skeleton-chip {
    width: 80px; height: 35px; border-radius: 999px; flex-shrink: 0;
  }
  .skeleton-list {
    padding: 8px 20px 112px; max-width: 512px; margin: 0 auto; width: 100%;
    display: flex; flex-direction: column; gap: 12px;
  }
  .skeleton-card {
    background: #fff; border-radius: 16px; border: 1px solid rgba(226,226,226,.5);
    padding: 12px; display: flex; gap: 12px; height: 110px; align-items: center;
  }
  .skeleton-img {
    width: 86px; height: 86px; border-radius: 12px; flex-shrink: 0;
  }
  .skeleton-info {
    flex-grow: 1; display: flex; flex-direction: column; gap: 6px; min-width: 0;
  }
  .skeleton-title {
    width: 60%; height: 14px; border-radius: 4px;
  }
  .skeleton-desc {
    width: 90%; height: 10px; border-radius: 4px;
  }
  .skeleton-footer {
    display: flex; justify-content: space-between; align-items: center; margin-top: 4px;
    width: 100%;
  }
  .skeleton-price {
    width: 50px; height: 16px; border-radius: 4px;
  }
  .skeleton-btn {
    width: 96px; height: 34px; border-radius: 9px;
  }

  /* Checkout skeletons */
  .skeleton-selection-title {
    width: 120px; height: 18px; border-radius: 4px; margin-bottom: 12px;
  }
  .skeleton-bill-card {
    background: #fff; border-radius: 12px; border: 1px solid rgba(226,226,226,.5);
    padding: 16px; display: flex; flex-direction: column; gap: 12px; margin-bottom: 16px;
  }
  .skeleton-bill-line {
    height: 14px; border-radius: 4px;
  }
  .skeleton-rec-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 24px;
  }
  .skeleton-rec-card {
    background: #fff; border-radius: 12px; border: 1px solid rgba(226,226,226,.5);
    padding: 10px; display: flex; flex-direction: column; gap: 8px;
  }
  .skeleton-rec-img {
    width: 100%; aspect-ratio: 1; border-radius: 8px;
  }
  .skeleton-rec-title {
    width: 70%; height: 12px; border-radius: 4px;
  }
  .skeleton-rec-footer {
    display: flex; justify-content: space-between; align-items: center;
  }
  .skeleton-rec-price {
    width: 40px; height: 12px; border-radius: 4px;
  }
  .skeleton-rec-btn {
    width: 54px; height: 28px; border-radius: 8px;
  }

  /* Checkout Form Styling */
  .form-group {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 12px;
  }
  .form-group:last-child {
    margin-bottom: 0;
  }
  .form-label {
    font-family: var(--font-sans);
    font-size: 11px;
    font-weight: 700;
    text-transform: uppercase;
    letter-spacing: 0.05em;
    color: var(--text-muted);
  }
  .form-input {
    width: 100%;
    background: var(--card-bg);
    border: 1px solid var(--card-border);
    border-radius: 10px;
    padding: 10px 12px;
    font-family: var(--font-sans);
    font-size: 13px;
    color: var(--text-color);
    outline: none;
    transition: border-color 0.2s;
  }
  .form-input:focus {
    border-color: var(--primary);
  }
  .form-textarea {
    resize: none;
    height: 60px;
  }
  .error-box {
    background: #fef3f2;
    color: #b42318;
    border: 1px solid #fecdca;
    padding: 10px;
    border-radius: 10px;
    font-size: 12px;
    font-weight: 600;
    margin-bottom: 12px;
  }
</style>
