<?php

namespace App\Http\Controllers;

use App\Models\Product;
use Illuminate\Http\Request;

class ProductController extends Controller
{
    // ========== API METHODS ========== //

    // List all products (API)
    public function index()
    {
        $products = Product::with(['major', 'minor','category','vendor'])->get();
        return response()->json($products);
    }

    // Store a new product (API)
    public function store(Request $request)
    {
        $validatedData = $this->validateProduct($request);

        $product = Product::create($validatedData);

        return response()->json([
            'message' => 'Product created successfully!',
            'product' => $product
        ], 201);
    }

    // Show a single product (API)
    public function show($id)
    {
        $product = Product::findOrFail($id);
        return response()->json($product);
    }

    // Update a product (API)
    public function update(Request $request, $id)
    {
        $product = Product::findOrFail($id);

        $validatedData = $this->validateProduct($request);

        $product->update($validatedData);

        return response()->json([
            'message' => 'Product updated successfully!',
            'product' => $product
        ]);
    }

    // Delete a product (API)
    public function destroy($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return response()->json([
            'message' => 'Product deleted successfully!'
        ]);
    }

    // ========== WEB METHODS ========== //

    public function indexWeb()
    {
        $products = Product::all();
        return view('products.index', compact('products'));
    }

    public function showWeb($id)
    {
        $product = Product::findOrFail($id);
        return view('products.show', compact('product'));
    }

    public function createWeb()
    {
        return view('products.create');
    }

    public function storeWeb(Request $request)
    {
        $validatedData = $this->validateProduct($request);
        Product::create($validatedData);

        return redirect()->route('products.index')->with('success', 'Product created successfully!');
    }

    public function editWeb($id)
    {
        $product = Product::findOrFail($id);
        return view('products.edit', compact('product'));
    }

    public function updateWeb(Request $request, $id)
    {
        $product = Product::findOrFail($id);
        $validatedData = $this->validateProduct($request);
        $product->update($validatedData);

        return redirect()->route('products.index')->with('success', 'Product updated successfully!');
    }

    public function destroyWeb($id)
    {
        $product = Product::findOrFail($id);
        $product->delete();

        return redirect()->route('products.index')->with('success', 'Product deleted successfully!');
    }

    // ========== SHARED VALIDATION ========== //

    private function validateProduct(Request $request)
    {
        return $request->validate([
            'asset_number' => 'required|string|max:255',
            'vendor_id' => 'required|integer',
            'vendor_name' => 'required|string|max:255',
            'major_id' => 'required|integer',
            'minor_id' => 'required|integer',
            'category_id' => 'required|integer',
            'asset_cost' => 'required|numeric',
            'date_added' => 'required|date',
            'deprn_method_code' => 'required|string|max:255',
            'original_cost' => 'required|numeric',
            'current_cost' => 'required|numeric',
            'accumulated_deprn' => 'required|numeric',
            'deprn_amount' => 'required|numeric',
            'ytd_deprn' => 'required|numeric',
            'period_name' => 'required|string|max:255',
            'quantity' => 'required|integer',
            'life_in_months' => 'required|integer',
            'description' => 'required|string|max:255',
            'cost_account_description' => 'required|string|max:255',
            'accumulated_account_description' => 'required|string|max:255',
        ]);
    }
}
