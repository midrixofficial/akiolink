import { writable, derived } from 'svelte/store';

// Dummy brand config representing the single API payload
const initialBrandConfig = {
  brandName: "The Vellore Kitchen",
  brandAddress: "New Bangalore Service Road, No: 1, Near Green Circle, NH 46 Service Rd, Vellore, Tamil Nadu 632004",
  
  // Header Action configuration (dynamic button type and value)
  headerAction: {
    type: "call", // e.g. "call", "link", "none"
    value: "+919876543210", // Phone number or URL
    icon: "call" // Material Symbol icon name
  },
  
  // Design details
  theme: {
    primaryColor: "#a93100",      // Main brand color
    primaryLightColor: "#ffdbd0", // Light tint for highlights/backgrounds
    onPrimaryColor: "#ffffff",    // Text/Icon color on top of primaryColor
    fontDisplay: "Plus Jakarta Sans",
    fontSans: "Inter"
  },
  
  // Menu Products List
  products: [
    {
      id: 'p1',
      name: 'Artisan Margherita',
      desc: 'San Marzano tomatoes, fresh buffalo mozzarella, and aromatic basil.',
      price: 799,
      oldPrice: 950,
      type: 'veg',
      category: 'Authentic Pizza',
      best: true,
      image: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?q=80&w=400&h=400&auto=format&fit=crop'
    },
    {
      id: 'p4',
      name: 'Pepperoni Feast',
      desc: 'Spicy pepperoni, loaded mozzarella, and Italian herbs.',
      price: 899,
      oldPrice: 1100,
      type: 'nonveg',
      category: 'Authentic Pizza',
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=400&h=400&auto=format&fit=crop'
    },
    {
      id: 'p2',
      name: 'Signature Truffle Wagyu',
      desc: 'Wagyu beef patty, black truffle aioli, and fontina cheese.',
      price: 1899,
      oldPrice: 2200,
      type: 'nonveg',
      category: 'Signature Burgers',
      best: true,
      image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?q=80&w=400&h=400&auto=format&fit=crop'
    },
    {
      id: 'p5',
      name: 'Classic Cheese Smash',
      desc: 'Double smash patty, aged cheddar, and secret sauce.',
      price: 599,
      oldPrice: 799,
      type: 'nonveg',
      category: 'Signature Burgers',
      image: 'https://images.unsplash.com/photo-1550547660-d9450f859349?q=80&w=400&h=400&auto=format&fit=crop'
    },
    {
      id: 'p3',
      name: 'Harvest Detox Bowl',
      desc: 'Crisp greens, quinoa, seeds, and citrus dressing.',
      price: 649,
      type: 'veg',
      category: 'Healthy Salads',
      image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?q=80&w=400&h=400&auto=format&fit=crop'
    },
    {
      id: 'p6',
      name: 'Mediterranean Greek',
      desc: 'Feta, olives, cherry tomatoes, and herbed vinaigrette.',
      price: 549,
      type: 'veg',
      category: 'Healthy Salads',
      image: 'https://images.unsplash.com/photo-1546793665-c74683f339c1?q=80&w=400&h=400&auto=format&fit=crop'
    },
    {
      id: 'p7',
      name: 'Belgian Chocolate Melt',
      desc: 'Warm gooey chocolate center with cocoa dust.',
      price: 449,
      type: 'veg',
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=400&h=400&auto=format&fit=crop'
    },
    {
      id: 'p8',
      name: 'Red Velvet Cheesecake',
      desc: 'Creamy red velvet cheesecake with berry glaze.',
      price: 499,
      type: 'veg',
      category: 'Desserts',
      image: 'https://images.unsplash.com/photo-1533134242443-d4fd215305ad?q=80&w=400&h=400&auto=format&fit=crop'
    }
  ],
  
  // Recommended Products List
  recommendedProducts: [
    { 
      id: 'p7', 
      name: 'Belgian Chocolate Melt',  
      price: 449, 
      type: 'veg',    
      image: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?q=80&w=300&h=300&auto=format&fit=crop' 
    },
    { 
      id: 'p4', 
      name: 'Pepperoni Feast', 
      price: 899, 
      type: 'nonveg', 
      image: 'https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?q=80&w=300&h=300&auto=format&fit=crop' 
    }
  ]
};

// Main store for full Brand Config
export const brand = writable(initialBrandConfig);

// Derived stores for easy reactive access in templates
export const brandName = derived(brand, ($b) => $b.brandName);
export const brandAddress = derived(brand, ($b) => $b.brandAddress);
export const headerAction = derived(brand, ($b) => $b.headerAction);
export const theme = derived(brand, ($b) => $b.theme);
export const products = derived(brand, ($b) => $b.products);
export const recommendedProducts = derived(brand, ($b) => $b.recommendedProducts);

// Automatically derive unique product categories
export const categories = derived(products, ($products) => {
  return ['All', ...new Set($products.map((p) => p.category))];
});
