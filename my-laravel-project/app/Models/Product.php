<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    use HasFactory;

    protected $fillable = [
        'asset_number',
        'vendor_id',
        'vendor_code',
        'vendor_name',
        'major_id',
        'minor_id',
        'category_id',
        'asset_cost',
        'date_added',
        'deprn_method_code',
        'original_cost',
        'current_cost',
        'accumulated_deprn',
        'deprn_amount',
        'ytd_deprn',
        'period_name',
        'quantity',
        'life_in_months',
        'description',
        'cost_account_description',
        'accumulated_account_description'
    ];

    // Add the vendor_code and vendor_name as dynamic properties to the API response
    protected $appends = ['vendor_code', 'vendor_name'];

    /**
     * Relationship with Vendor model.
     */
    public function vendor()
    {
        return $this->belongsTo(Vendor::class, 'vendor_id');
    }

    /**
     * Accessor for vendor_code.
     */
    public function getVendorCodeAttribute()
    {
        // If the vendor relationship exists, return the vendor_code; otherwise null
        return $this->vendor ? $this->vendor->vendor_code : null;
    }

    /**
     * Accessor for vendor_name.
     */
    public function getVendorNameAttribute()
    {
        // If the vendor relationship exists, return the vendor_name; otherwise null
        return $this->vendor ? $this->vendor->vendor_name : null;
    }

    /**
     * Relationship with Category model (optional, since you have it already).
     */
    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function major()
    {
        return $this->belongsTo(Major::class, 'major_id');
    }

    public function minor()
    {
        return $this->belongsTo(Minor::class, 'minor_id');
    }

    
}
