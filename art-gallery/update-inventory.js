/**
 * Update Art Gallery Inventory - 40 Products (Correct Format)
 * 
 * API requires snake_case: item_name, category, quantity, price, supplier_name, 
 * stock_status, featured_item, special_note
 * 
 * stock_status values: "In stock", "Low stock", "Out of stock"
 */

const API_BASE = 'https://prog2005.it.scu.edu.au/ArtGalley';

// 40 Products in snake_case format
const products = [
  { item_name: 'iPhone 16 Mobile Phone', category: 'Electronics', quantity: 168, price: 999, supplier_name: 'Apple', stock_status: 'In stock', featured_item: 1, special_note: 'New flagship model' },
  { item_name: 'Samsung Foldable Phone', category: 'Electronics', quantity: 15, price: 1299, supplier_name: 'Samsung', stock_status: 'Low stock', featured_item: 1, special_note: 'Limited folding design' },
  { item_name: 'Huawei Tablet', category: 'Electronics', quantity: 230, price: 499, supplier_name: 'Huawei', stock_status: 'In stock', featured_item: 0, special_note: 'Student office style' },
  { item_name: 'Sony Wireless Earbuds', category: 'Electronics', quantity: 295, price: 199, supplier_name: 'Sony', stock_status: 'In stock', featured_item: 0, special_note: 'Active noise reduction' },
  { item_name: 'Xiaomi Smart Watch', category: 'Electronics', quantity: 22, price: 159, supplier_name: 'Xiaomi', stock_status: 'Low stock', featured_item: 0, special_note: 'Health monitoring function' },
  { item_name: 'Nintendo Game Console', category: 'Electronics', quantity: 156, price: 299, supplier_name: 'Nintendo', stock_status: 'In stock', featured_item: 1, special_note: 'Family entertainment essential' },
  { item_name: 'Lenovo Ultrabook Laptop', category: 'Electronics', quantity: 142, price: 649, supplier_name: 'Lenovo', stock_status: 'In stock', featured_item: 0, special_note: 'Business portable design' },
  { item_name: 'Canon Mirrorless Camera', category: 'Electronics', quantity: 8, price: 899, supplier_name: 'Canon', stock_status: 'Low stock', featured_item: 1, special_note: 'Entry-level photography device' },
  { item_name: 'ASUS Gaming Monitor', category: 'Electronics', quantity: 93, price: 349, supplier_name: 'ASUS', stock_status: 'In stock', featured_item: 0, special_note: 'High refresh rate screen' },
  { item_name: 'Seagate External Hard Drive', category: 'Electronics', quantity: 0, price: 59, supplier_name: 'Seagate', stock_status: 'Out of stock', featured_item: 0, special_note: 'Short-term out of stock' },
  { item_name: 'IKEA Single Sofa', category: 'Furniture', quantity: 68, price: 229, supplier_name: 'IKEA', stock_status: 'In stock', featured_item: 0, special_note: 'Easy to assemble' },
  { item_name: 'KUKA Leather Bed', category: 'Furniture', quantity: 9, price: 899, supplier_name: 'KUKA', stock_status: 'Low stock', featured_item: 1, special_note: 'High-density latex cushion' },
  { item_name: 'Solid Wood Dining Table', category: 'Furniture', quantity: 52, price: 359, supplier_name: 'Quanu', stock_status: 'In stock', featured_item: 0, special_note: 'Wear-resistant solid wood' },
  { item_name: 'Nordic Dining Chair', category: 'Furniture', quantity: 320, price: 39, supplier_name: 'Nordic Home', stock_status: 'In stock', featured_item: 0, special_note: 'Modern minimalist style' },
  { item_name: 'Multifunctional Shoe Cabinet', category: 'Furniture', quantity: 76, price: 199, supplier_name: 'Smart Home', stock_status: 'In stock', featured_item: 0, special_note: 'Entrance storage furniture' },
  { item_name: 'Rattan Leisure Chair', category: 'Furniture', quantity: 18, price: 129, supplier_name: 'Rattan Crafts', stock_status: 'Low stock', featured_item: 0, special_note: 'Balcony special use' },
  { item_name: 'Light Luxury Dressing Table', category: 'Furniture', quantity: 45, price: 269, supplier_name: 'Luxury Living', stock_status: 'In stock', featured_item: 1, special_note: 'With LED makeup mirror' },
  { item_name: 'Solid Wood Bookshelf', category: 'Furniture', quantity: 59, price: 279, supplier_name: 'Linsy Home', stock_status: 'In stock', featured_item: 0, special_note: 'Large storage space' },
  { item_name: 'Nike Running Shoes', category: 'Clothing', quantity: 286, price: 119, supplier_name: 'Nike', stock_status: 'In stock', featured_item: 0, special_note: 'Breathable sports sole' },
  { item_name: 'Adidas Casual Hoodie', category: 'Clothing', quantity: 241, price: 89, supplier_name: 'Adidas', stock_status: 'In stock', featured_item: 0, special_note: 'Loose daily wear' },
  { item_name: 'LV Classic Scarf', category: 'Clothing', quantity: 12, price: 459, supplier_name: 'Louis Vuitton', stock_status: 'Low stock', featured_item: 1, special_note: 'Luxury limited accessory' },
  { item_name: 'Dior Knit Sweater', category: 'Clothing', quantity: 7, price: 389, supplier_name: 'Dior', stock_status: 'Low stock', featured_item: 1, special_note: 'High-end custom fabric' },
  { item_name: 'Uniqlo Cotton T-Shirt', category: 'Clothing', quantity: 460, price: 19, supplier_name: 'Uniqlo', stock_status: 'In stock', featured_item: 0, special_note: 'Basic daily essential' },
  { item_name: 'ZARA Denim Pants', category: 'Clothing', quantity: 312, price: 49, supplier_name: 'ZARA', stock_status: 'In stock', featured_item: 0, special_note: 'Fashion street style' },
  { item_name: 'The North Face Jacket', category: 'Clothing', quantity: 135, price: 199, supplier_name: 'The North Face', stock_status: 'In stock', featured_item: 1, special_note: 'Waterproof outdoor coat' },
  { item_name: "Levi's Classic Jeans", category: 'Clothing', quantity: 208, price: 75, supplier_name: "Levi's", stock_status: 'In stock', featured_item: 0, special_note: 'Retro classic tailoring' },
  { item_name: 'Converse Canvas Shoes', category: 'Clothing', quantity: 273, price: 65, supplier_name: 'Converse', stock_status: 'In stock', featured_item: 0, special_note: 'All-match casual shoes' },
  { item_name: 'Skechers Dad Shoes', category: 'Clothing', quantity: 25, price: 85, supplier_name: 'Skechers', stock_status: 'Low stock', featured_item: 0, special_note: 'Comfort shock absorption' },
  { item_name: 'Bosch Electric Drill', category: 'Tools', quantity: 89, price: 129, supplier_name: 'Bosch', stock_status: 'In stock', featured_item: 0, special_note: 'Industrial power tool' },
  { item_name: 'Stanley Utility Knife Set', category: 'Tools', quantity: 365, price: 25, supplier_name: 'Stanley', stock_status: 'In stock', featured_item: 0, special_note: 'Household cutting tool' },
  { item_name: 'Makita Angle Grinder', category: 'Tools', quantity: 14, price: 159, supplier_name: 'Makita', stock_status: 'Low stock', featured_item: 0, special_note: 'High-power polishing tool' },
  { item_name: 'Hardware Screwdriver Kit', category: 'Tools', quantity: 420, price: 19, supplier_name: 'Green Forest', stock_status: 'In stock', featured_item: 0, special_note: 'Multi-size combination' },
  { item_name: 'Digital Tape Measure', category: 'Tools', quantity: 388, price: 12, supplier_name: 'Deli', stock_status: 'In stock', featured_item: 0, special_note: 'Precision measuring tool' },
  { item_name: 'Heavy-Duty Pliers', category: 'Tools', quantity: 196, price: 29, supplier_name: 'Sheffield', stock_status: 'In stock', featured_item: 0, special_note: 'Hardware maintenance tool' },
  { item_name: 'Starbucks Thermos Cup', category: 'Miscellaneous', quantity: 257, price: 35, supplier_name: 'Starbucks', stock_status: 'In stock', featured_item: 0, special_note: 'Portable travel cup' },
  { item_name: "Kiehl's Moisturizing Cream", category: 'Miscellaneous', quantity: 21, price: 49, supplier_name: "Kiehl's", stock_status: 'Low stock', featured_item: 0, special_note: 'Skin care product' },
  { item_name: 'Creative Desktop Ornament', category: 'Miscellaneous', quantity: 302, price: 23, supplier_name: 'Trendy Goods', stock_status: 'In stock', featured_item: 0, special_note: 'Home decoration' },
  { item_name: 'Pet Toy Set', category: 'Miscellaneous', quantity: 269, price: 19, supplier_name: 'Pet Joy', stock_status: 'In stock', featured_item: 0, special_note: 'Pet daily supplies' },
  { item_name: 'Scented Candle', category: 'Miscellaneous', quantity: 315, price: 28, supplier_name: 'MUJI', stock_status: 'In stock', featured_item: 0, special_note: 'Aromatherapy stress relief' },
  { item_name: 'Travel Storage Bag Set', category: 'Miscellaneous', quantity: 0, price: 14, supplier_name: 'Travel Goods', stock_status: 'Out of stock', featured_item: 0, special_note: 'Seasonal product out of stock' }
];

async function apiRequest(method, endpoint, data = null) {
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json'
    }
  };

  if (data) {
    options.body = JSON.stringify(data);
  }

  const response = await fetch(`${API_BASE}${endpoint}`, options);
  const text = await response.text();
  
  try {
    return { success: response.ok, data: JSON.parse(text), status: response.status };
  } catch {
    return { success: response.ok, data: text, status: response.status };
  }
}

async function updateInventory() {
  console.log('=== Updating Art Gallery Inventory ===\n');
  console.log(`Total products to add: ${products.length}\n`);
  
  // Step 1: Get existing items
  console.log('Step 1: Fetching existing items...');
  const existingResult = await apiRequest('GET', '');
  let existingCount = 0;
  
  if (existingResult.success && existingResult.data) {
    existingCount = existingResult.data.length;
    console.log(`Found ${existingCount} existing items\n`);
    
    // Step 2: Delete existing items
    console.log('Step 2: Clearing existing inventory...');
    let deletedCount = 0;
    
    for (const item of existingResult.data) {
      const name = item.item_name;
      if (!name) continue; // Skip items with no name
      
      const result = await apiRequest('DELETE', `/${encodeURIComponent(name)}`);
      if (result.success) {
        deletedCount++;
      }
      await new Promise(r => setTimeout(r, 50));
    }
    console.log(`Deleted ${deletedCount} items\n`);
  }

  // Step 3: Add all 40 products
  console.log('Step 3: Adding 40 products...');
  let successCount = 0;
  let failCount = 0;

  for (let i = 0; i < products.length; i++) {
    const product = products[i];
    const result = await apiRequest('POST', '', product);
    
    if (result.success) {
      successCount++;
      console.log(`  [${i + 1}/40] ✓ ${product.item_name}`);
    } else {
      failCount++;
      console.log(`  [${i + 1}/40] ✗ ${product.item_name} (${result.status})`);
    }
    
    await new Promise(r => setTimeout(r, 150));
  }

  // Step 4: Verify
  console.log('\nStep 4: Verifying...');
  const verifyResult = await apiRequest('GET', '');
  
  console.log('\n========================================');
  console.log('           UPDATE COMPLETE');
  console.log('========================================');
  console.log(`Successfully added: ${successCount}`);
  console.log(`Failed: ${failCount}`);
  if (verifyResult.data) {
    console.log(`Total items in database: ${verifyResult.data.length}`);
  }
}

updateInventory().catch(console.error);
