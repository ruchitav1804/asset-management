<?php

namespace App\Http\Controllers;

use App\Models\Major;
use App\Models\Minor;
use Illuminate\Http\Request;

class MajorMinorController extends Controller
{
    // Get all majors
    public function getMajors()
    {
        return response()->json(Major::all());
    }

    // Get minors by major ID
    public function getMinors($majorId)
    {
        $minors = Minor::where('major_id', $majorId)->get();
        return response()->json($minors);
    }
}
