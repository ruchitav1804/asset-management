<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Vendor extends Model
{
    use HasFactory;

    protected $fillable = [
        'vendor_code',
        'vendor_name',
        'contact_number',
        'vendor_email',
        'vendor_address',
        'business_name',
        'business_number',
    ];
    
    public function products()
    {
        return $this->hasMany(Product::class);
    }
}
