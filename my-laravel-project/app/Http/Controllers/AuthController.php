<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Spatie\Permission\Models\Role; // Import the Role model

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try {
            // Validate incoming request
            $request->validate([
                'name' => 'required|string',
                'email' => 'required|string|email|unique:users',
                'password' => 'required|string|min:6',
            ]);

            // Create user
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);

            // Ensure the 'user' role exists before assigning it
            if (!Role::where('name', 'user')->exists()) {
                // Create 'user' role if it doesn't exist
                Role::create(['name' => 'user']);
            }

            // Assign the 'user' role to the new user
            $user->assignRole('user');

            // Create a token for the user
            $token = $user->createToken('auth_token')->plainTextToken;

            // Prepare user data to return (including the role)
            $userData = [
                'id'    => $user->id,
                'name'  => $user->name,
                'email' => $user->email,
                'role'  => $user->getRoleNames()->first(),
            ];

            return response()->json([
                'status' => 'success',
                'token'  => $token,
                'user'   => $userData,
            ]);

        } catch (\Exception $e) {
            // Log the error to help diagnose the problem
            \Log::error('Registration Error: ' . $e->getMessage());
            return response()->json([
                'status' => 'error',
                'message' => 'There was an error during registration. Please try again.',
            ], 500);
        }
    }

    public function login(Request $request)
    {
        // Validate login request
        $request->validate([
            'email' => 'required|string|email',
            'password' => 'required|string',
        ]);

        // Find user by email
        $user = User::where('email', $request->email)->first();

        // Check if user exists and the password matches
        if (!$user || !Hash::check($request->password, $user->password)) {
            throw ValidationException::withMessages(['email' => 'Invalid credentials']);
        }

        // Create a token for the user
        $token = $user->createToken('auth_token')->plainTextToken;

        // Prepare user data to return (including the role)
        $userData = [
            'id'    => $user->id,
            'name'  => $user->name,
            'email' => $user->email,
            'role'  => $user->getRoleNames()->first(),
        ];

        // Return response with the user's info and token
        return response()->json([
            'status' => 'success',
            'token'  => $token,
            'user'   => $userData,
        ]);
    }
}
