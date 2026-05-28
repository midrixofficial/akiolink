<?php

namespace Tests\Feature;

use App\Models\Category;
use App\Models\Merchant;
use App\Models\Product;
use App\Models\User;
use Illuminate\Foundation\Testing\RefreshDatabase;
use Laravel\Sanctum\Sanctum;
use Tests\TestCase;

class CategoryProductMerchantTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test that user signup automatically creates a merchant profile.
     */
    public function test_signup_automatically_creates_merchant(): void
    {
        $response = $this->postJson('/api/auth/signup', [
            'email' => 'testmerchant@example.com',
            'password' => 'password123',
        ]);

        $response->assertStatus(201);
        $this->assertDatabaseHas('users', ['email' => 'testmerchant@example.com']);

        $user = User::where('email', 'testmerchant@example.com')->first();
        $this->assertNotNull($user);

        // Verify merchant was created automatically
        $this->assertDatabaseHas('merchants', [
            'user_id' => $user->id,
            'business_email' => 'testmerchant@example.com',
        ]);

        $merchant = $user->merchant;
        $this->assertNotNull($merchant);
        $this->assertEquals($user->name . "'s Store", $merchant->business_name);
    }

    /**
     * Test that creating a category and a product automatically sets the merchant ID in the background.
     */
    public function test_creating_category_and_product_automatically_sets_merchant_id(): void
    {
        $user = User::factory()->create();
        $merchant = Merchant::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'business_name' => $user->name . "'s Store",
            'business_email' => $user->email,
        ]);

        Sanctum::actingAs($user);

        // Create category
        $categoryResponse = $this->postJson('/api/categories', [
            'name' => 'Pizza',
            'description' => 'Delicious pizzas',
        ]);

        $categoryResponse->assertStatus(201);
        $categoryData = $categoryResponse->json();
        $this->assertEquals($merchant->id, $categoryData['merchant_id']);

        // Create product
        $productResponse = $this->postJson('/api/products', [
            'category_id' => $categoryData['id'],
            'name' => 'Margherita Pizza',
            'type' => 'Veg',
            'unit' => 'piece',
            'price' => 299.00,
            'stock_quantity' => 15,
        ]);

        $productResponse->assertStatus(201);
        $productData = $productResponse->json();
        $this->assertEquals($merchant->id, $productData['merchant_id']);
    }

    /**
     * Test that index queries only return categories and products belonging to the logged-in merchant.
     */
    public function test_listing_categories_and_products_scopes_to_merchant(): void
    {
        // Merchant A
        $userA = User::factory()->create();
        $merchantA = Merchant::create([
            'user_id' => $userA->id,
            'name' => $userA->name,
            'business_name' => "A's Store",
        ]);
        $categoryA = Category::create([
            'merchant_id' => $merchantA->id,
            'name' => 'Category A',
        ]);
        $productA = Product::create([
            'merchant_id' => $merchantA->id,
            'category_id' => $categoryA->id,
            'name' => 'Product A',
            'type' => 'Veg',
            'unit' => 'piece',
            'price' => 10.00,
            'stock_quantity' => 5,
        ]);

        // Merchant B
        $userB = User::factory()->create();
        $merchantB = Merchant::create([
            'user_id' => $userB->id,
            'name' => $userB->name,
            'business_name' => "B's Store",
        ]);
        $categoryB = Category::create([
            'merchant_id' => $merchantB->id,
            'name' => 'Category B',
        ]);
        $productB = Product::create([
            'merchant_id' => $merchantB->id,
            'category_id' => $categoryB->id,
            'name' => 'Product B',
            'type' => 'Veg',
            'unit' => 'piece',
            'price' => 20.00,
            'stock_quantity' => 5,
        ]);

        // Test User A view
        Sanctum::actingAs($userA);

        $catResponse = $this->getJson('/api/categories');
        $catResponse->assertStatus(200);
        $catResponse->assertJsonCount(1);
        $catResponse->assertJsonFragment(['name' => 'Category A']);
        $catResponse->assertJsonMissing(['name' => 'Category B']);

        $prodResponse = $this->getJson('/api/products');
        $prodResponse->assertStatus(200);
        $prodResponse->assertJsonCount(1);
        $prodResponse->assertJsonFragment(['name' => 'Product A']);
        $prodResponse->assertJsonMissing(['name' => 'Product B']);

        // Test User B view
        Sanctum::actingAs($userB);

        $catResponseB = $this->getJson('/api/categories');
        $catResponseB->assertStatus(200);
        $catResponseB->assertJsonCount(1);
        $catResponseB->assertJsonFragment(['name' => 'Category B']);
        $catResponseB->assertJsonMissing(['name' => 'Category A']);

        $prodResponseB = $this->getJson('/api/products');
        $prodResponseB->assertStatus(200);
        $prodResponseB->assertJsonCount(1);
        $prodResponseB->assertJsonFragment(['name' => 'Product B']);
        $prodResponseB->assertJsonMissing(['name' => 'Product A']);
    }

    /**
     * Test that a merchant cannot view, update, or delete another merchant's categories or products.
     */
    public function test_cannot_access_or_modify_other_merchants_resources(): void
    {
        // Merchant A
        $userA = User::factory()->create();
        $merchantA = Merchant::create(['user_id' => $userA->id, 'name' => $userA->name]);
        $categoryA = Category::create([
            'merchant_id' => $merchantA->id,
            'name' => 'Category A',
        ]);
        $productA = Product::create([
            'merchant_id' => $merchantA->id,
            'category_id' => $categoryA->id,
            'name' => 'Product A',
            'type' => 'Veg',
            'unit' => 'piece',
            'price' => 10.00,
            'stock_quantity' => 5,
        ]);

        // Merchant B
        $userB = User::factory()->create();
        $merchantB = Merchant::create(['user_id' => $userB->id, 'name' => $userB->name]);

        // Act as User B (Merchant B) attempting to access Merchant A's resources
        Sanctum::actingAs($userB);

        // Category Actions
        $this->getJson("/api/categories/{$categoryA->id}")->assertStatus(403);
        $this->putJson("/api/categories/{$categoryA->id}", ['name' => 'Hacked Name'])->assertStatus(403);
        $this->deleteJson("/api/categories/{$categoryA->id}")->assertStatus(403);

        // Product Actions
        $this->getJson("/api/products/{$productA->id}")->assertStatus(403);
        $this->putJson("/api/products/{$productA->id}", [
            'category_id' => $categoryA->id,
            'name' => 'Hacked Product',
            'type' => 'Veg',
            'unit' => 'piece',
            'price' => 100.00,
            'stock_quantity' => 100,
        ])->assertStatus(403);
        $this->deleteJson("/api/products/{$productA->id}")->assertStatus(403);
    }

    /**
     * Test that a merchant can successfully retrieve and update general settings.
     */
    public function test_merchant_can_retrieve_and_update_settings(): void
    {
        $user = User::factory()->create();
        $merchant = Merchant::create([
            'user_id' => $user->id,
            'name' => $user->name,
            'business_name' => "Original Store Name",
            'business_mobile' => '1234567890',
        ]);

        Sanctum::actingAs($user);

        // Retrieve settings
        $response = $this->getJson('/api/merchant');
        $response->assertStatus(200);
        $response->assertJsonFragment([
            'business_name' => 'Original Store Name',
            'store_status' => 'open',
            'auto_accept' => 1,
            'currency' => 'INR',
        ]);

        // Update settings
        $updateResponse = $this->postJson('/api/merchant/update', [
            'name' => 'New Contact Name',
            'business_name' => 'Premium Coffee Shop',
            'business_mobile' => '9876543210',
            'business_email' => 'support@coffee.com',
            'business_address' => '123 Main St, New York',
            'store_status' => 'closed',
            'auto_accept' => 0,
            'prep_time' => 45,
            'currency' => 'USD',
            'tax_rate' => 12.50,
            'min_order_value' => 150.00,
            'delivery_charge' => 15.00,
            'timezone' => 'America/New_York',
        ]);

        $updateResponse->assertStatus(200);
        
        // Assert database values
        $this->assertDatabaseHas('merchants', [
            'id' => $merchant->id,
            'name' => 'New Contact Name',
            'business_name' => 'Premium Coffee Shop',
            'store_status' => 'closed',
            'auto_accept' => 0,
            'prep_time' => 45,
            'currency' => 'USD',
            'tax_rate' => 12.50,
            'min_order_value' => 150.00,
            'delivery_charge' => 15.00,
            'timezone' => 'America/New_York',
        ]);
    }
}
