<script>
  export let product;
  export let quantity = 0;
  export let onAdd;
  export let onUpdate;
</script>

<div
  class="food-card bg-surface-white rounded-xl card-shadow flex gap-3 p-3"
  style="background:var(--card-bg, #fff); border-radius:12px; border:1px solid var(--card-border, rgba(226,226,226,.5)); display:flex; gap:12px; padding:12px; transition:transform .15s; margin-bottom:12px;"
>
  <!-- Thumbnail -->
  <div style="position:relative; width:100px; height:100px; flex-shrink:0; border-radius:10px; overflow:hidden; background:#eee;">
    <img
      src={product.image}
      alt={product.name}
      loading="lazy"
      style="width:100%; height:100%; object-fit:cover; transition:transform .3s; display:block;"
    />
    {#if product.best}
      <div style="position:absolute; top:6px; left:6px; background:#FFB800; color:#3a0b00; padding:3px 6px; border-radius:999px; font-size:9px; font-weight:700; letter-spacing:.04em; text-transform:uppercase; display:flex; align-items:center; gap:2px; line-height:1;">
        <span class="material-symbols-outlined" style="font-size:9px; font-variation-settings:'FILL' 1,'wght' 700;">star</span>
        Best
      </div>
    {/if}
  </div>

  <!-- Content -->
  <div style="display:flex; flex-direction:column; justify-content:space-between; flex-grow:1; padding:2px 0; min-width:0;">
    <div>
      <div style="display:flex; align-items:center; gap:6px; margin-bottom:4px;">
        <div class={product.type === 'veg' ? 'veg-box' : 'nonveg-box'}>
          <div class={product.type === 'veg' ? 'veg-dot' : 'nonveg-tri'}></div>
        </div>
        <h3 style="font-family:var(--font-display); font-weight:600; font-size:14px; color:var(--text-color, #1a1c1c); line-height:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap;">
          {product.name}
        </h3>
      </div>
      <p style="color:var(--text-muted, #5c4037); font-size:12px; line-height:1.4; margin:0; display:-webkit-box; -webkit-line-clamp:2; -webkit-box-orient:vertical; overflow:hidden;">
        {product.desc}
      </p>
    </div>

    <div style="display:flex; justify-content:space-between; align-items:center;">
      <div>
        {#if product.oldPrice}
          <p style="color:var(--text-muted, #5c4037); text-decoration:line-through; font-size:10px; font-weight:500; line-height:1; margin:0 0 2px;">
            ₹{product.oldPrice.toLocaleString('en-IN')}
          </p>
        {/if}
        <p style="color:var(--primary); font-family:var(--font-display); font-weight:700; font-size:17px; line-height:1; margin:0;">
          ₹{product.price.toLocaleString('en-IN')}
        </p>
      </div>

      {#if quantity > 0}
        <div style="display:flex; align-items:center; justify-content:space-between; background:var(--primary); color:#fff; border-radius:9px; overflow:hidden; height:34px; width:96px;">
          <button
            on:click={() => onUpdate(product.id, -1)}
            style="width:36px; height:100%; border:none; background:transparent; color:inherit; display:flex; align-items:center; justify-content:center; cursor:pointer;"
          >
            <span class="material-symbols-outlined" style="font-size:18px;">remove</span>
          </button>
          <span style="font-size:14px; font-weight:600; min-width:24px; text-align:center;">{quantity}</span>
          <button
            on:click={() => onUpdate(product.id, 1)}
            style="width:36px; height:100%; border:none; background:transparent; color:inherit; display:flex; align-items:center; justify-content:center; cursor:pointer;"
          >
            <span class="material-symbols-outlined" style="font-size:18px;">add</span>
          </button>
        </div>
      {:else}
        <button
          on:click={() => onAdd(product)}
          style="width:96px; height:34px; display:inline-flex; align-items:center; justify-content:center; background:var(--primary); color:#fff; font-family:var(--font-sans); font-size:13px; font-weight:600; border-radius:9px; border:none; cursor:pointer; transition:opacity .2s, transform .1s; active:scale(.95);"
          on:mousedown={(e) => e.currentTarget.style.opacity='.8'}
          on:mouseup={(e) => e.currentTarget.style.opacity='1'}
          on:mouseleave={(e) => e.currentTarget.style.opacity='1'}
        >
          Add
        </button>
      {/if}
    </div>
  </div>
</div>
