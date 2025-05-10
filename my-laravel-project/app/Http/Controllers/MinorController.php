<?php

namespace App\Http\Controllers;

use App\Models\Minor;
use Illuminate\Http\Request;

class MinorController extends Controller
{
    public function index(Request $request)
    {
        if ($request->has('major_id')) {
            $minors = Minor::with('major')->where('major_id', $request->major_id)->get();
        } else {
            $minors = Minor::with('major')->get();
        }

        return response()->json($minors);
    }

    public function store(Request $request)
    {
        $request->validate([
            'name' => 'required|string',
            'major_id' => 'required|exists:majors,id',
        ]);

        $minor = Minor::create($request->only('name', 'major_id'));

        return response()->json(['message' => 'Minor created', 'data' => $minor], 201);
    }

    public function show($id)
    {
        $minor = Minor::with('major')->findOrFail($id); // Include major in single minor fetch
        return response()->json($minor, 200);
    }

    public function update(Request $request, $id)
    {
        $request->validate([
            'name' => 'required|string',
            'major_id' => 'required|exists:majors,id',
        ]);

        $minor = Minor::findOrFail($id);
        $minor->update($request->only('name', 'major_id'));

        return response()->json(['message' => 'Minor updated', 'data' => $minor], 200);
    }

    public function destroy($id)
    {
        $minor = Minor::findOrFail($id);
        $minor->delete();

        return response()->json(['message' => 'Minor deleted'], 200);
    }

    public function getMinorsByMajor($majorId)
    {
        $minors = Minor::where('major_id', $majorId)->get();
        return response()->json($minors);
    }

}
