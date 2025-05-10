<?php

namespace App\Http\Controllers;

use App\Models\Vendor;
use Illuminate\Http\Request;

class VendorController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $vendors = Vendor::all();
        return response()->json($vendors);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        // Validate incoming data
        $request->validate([
            'vendor_code' => 'required|string|max:50|unique:vendors,vendor_code', // no $id!
            'vendor_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'vendor_email' => 'required|string|email|max:255',
            'vendor_address' => 'required|string|max:255',
            'business_name' => 'required|string|max:255',
            'business_number' => 'required|string|max:50', 
        ]);

        // Create vendor
        $vendor = Vendor::create([
            'vendor_code' => $request->vendor_code,
            'vendor_name' => $request->vendor_name,
            'contact_number' => $request->contact_number,
            'vendor_email' => $request->vendor_email,
            'vendor_address' => $request->vendor_address,
            'business_name' => $request->business_name,
            'business_number' => $request->business_number,
        ]);

        return response()->json($vendor, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $vendor = Vendor::find($id);

        if (!$vendor) {
            return response()->json(['message' => 'Vendor not found'], 404);
        }

        return response()->json($vendor);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $vendor = Vendor::find($id);

        if (!$vendor) {
            return response()->json(['message' => 'Vendor not found'], 404);
        }

        // Validate data
        $request->validate([
            'vendor_code' => 'required|string|max:50|unique:vendors,vendor_code,' . $id,
            'vendor_name' => 'required|string|max:255',
            'contact_number' => 'required|string|max:20',
            'vendor_email' => 'required|string|email|max:255',
            'vendor_address' => 'required|string|max:255',
            'business_name' => 'required|string|max:255',
            'business_number' => 'required|string|max:255',
        ]);

        // Update vendor
        $vendor->update([
            'vendor_code' => $request->vendor_code,
            'vendor_name' => $request->vendor_name,
            'contact_number' => $request->contact_number,
            'vendor_email' => $request->vendor_email,
            'vendor_address' => $request->vendor_address,
            'business_name' => $request->business_name,
            'business_number' => $request->business_number,
        ]);

        return response()->json($vendor);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $vendor = Vendor::find($id);

        if (!$vendor) {
            return response()->json(['message' => 'Vendor not found'], 404);
        }

        $vendor->delete();

        return response()->json(['message' => 'Vendor deleted successfully!']);
    }
}

