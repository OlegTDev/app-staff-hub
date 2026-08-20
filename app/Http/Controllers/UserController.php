<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\BuildsListQuery;
use App\Http\Resources\UserResource;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class UserController extends Controller
{
    use BuildsListQuery;

    /**
     * @route GET /users
     */
    public function index(Request $request)
    {
        $paginatedData = $this->getPaginatedData(
            request: $request,
            query: User::query(),
            resourceClass: UserResource::class,
        );

        return Inertia::render('Users/Index', [
            ...$paginatedData,
            'labels' => config('labels.user'),
        ]);
    }

    /**
     * @route GET /users/create
     */
    public function create()
    {
        //
        return Inertia::render('Users/Create', [
            'labels' => config('labels.user'),
        ]);
    }

    /**
     * @route POST /users
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * @route GET /users/{user}
     */
    public function show(string $id)
    {
        //
    }

    /**
     * @route GET /users/{user}/edit
     */
    public function edit(User $user)
    {
        dd($user);
    }

    /**
     * @route PUT /users/{user}
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * @route DELETE /users/{user}
     */
    public function destroy(string $id)
    {
        //
    }
}
