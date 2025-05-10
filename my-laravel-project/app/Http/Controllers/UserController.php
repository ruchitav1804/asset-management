<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Spatie\Permission\Models\Role;

class UserController extends Controller
{
    // Get all users
    public function index()
{
    return User::with('roles')->get()->map(function ($user) {
        return [
            'id' => $user->id,
            'name' => $user->name,
            'email' => $user->email,
            'roles' => $user->getRoleNames(), // Spatie method
        ];
    });
}

    // Create a new user
    public function store(Request $request)
    {
        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users',
            'password' => 'required|string|min:6',
            'role' => 'required|string|exists:roles,name',
        ]);
    
        $data['password'] = Hash::make($data['password']);
    
        $user = User::create($data);
        $user->assignRole($data['role']);
    
        return $user->load('roles');
    }

    // Show a specific user
    public function show(User $user)
    {
        return response()->json($user);
    }

    // Update a specific user
    public function update(Request $request, User $user)
{
    $data = $request->validate([
        'name' => 'string|max:255',
        'email' => 'email|unique:users,email,' . $user->id,
        'password' => 'nullable|string|min:6',
        'role' => 'required|string|exists:roles,name',
    ]);

    if (isset($data['password'])) {
        $data['password'] = Hash::make($data['password']);
    } else {
        unset($data['password']);
    }

    $user->update($data);

    if ($request->has('role')) {
        $user->syncRoles([$data['role']]);
    }

    return $user->load('roles');
}

    // Delete a specific user
    public function destroy(User $user)
    {
        $user->delete();
        return response()->json(['message' => 'User deleted']);
    }
}
