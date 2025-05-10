<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Major;

class MajorController extends Controller
{
    // GET /api/majors
    public function index()
    {
        $majors = Major::all();

        return response()->json([
            'data' => $majors
        ]);
    }

    // GET /api/majors/{id}
    public function show($id)
    {
        $major = Major::find($id);

        if (!$major) {
            return response()->json(['message' => 'Major not found'], 404);
        }

        return response()->json($major);
    }

    // POST /api/majors
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255'
        ]);

        $major = Major::create($validated);

        return response()->json($major);
    }

    // PUT /api/majors/{id}
    public function update(Request $request, $id)
    {
        $major = Major::find($id);

        if (!$major) {
            return response()->json(['message' => 'Major not found'], 404);
        }

        $request->validate([
            'name' => 'required|string|max:255',
            'description' => 'nullable|string'
        ]);

        $major->update([
            'name' => $request->name,
            'description' => $request->description,
        ]);

        return response()->json($major);
    }

    // DELETE /api/majors/{id}
    public function destroy($id)
    {
        $major = Major::find($id);

        if (!$major) {
            return response()->json(['message' => 'Major not found'], 404);
        }

        $major->delete();

        return response()->json(['message' => 'Major deleted successfully']);
    }
}
