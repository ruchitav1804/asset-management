<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Product;
use App\Models\Vendor;
use App\Models\Category;
use App\Models\Major;
use App\Models\Minor;

class DashboardController extends Controller
{
    public function counts()
    {
        return response()->json([
            'products' => Product::count(),
            'vendors' => Vendor::count(),
            'categories' => Category::count(),
            'majors' => Major::count(),
            'minors' => Minor::count(),
        ]);
    }
}