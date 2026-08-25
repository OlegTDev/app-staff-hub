<?php

namespace App\Http\Controllers;

use App\Http\Controllers\Traits\BuildsListQuery;
use App\Http\Requests\UserRequest;
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
            query: User::query()->with('roles')->orderBy('id', 'asc'),
            resourceClass: UserResource::class,
        );

        return Inertia::render('Users/Index', [
            ...$paginatedData,
            'labels' => config('labels.user'),
        ]);
    }

    /**
     * @route POST /users
     */
    public function store(UserRequest $request)
    {
        User::create($request->validated());

        return back()->with('success', 'Запись успешно добавлена!');
    }

    /**
     * @route PUT /users/{user}
     */
    public function update(UserRequest $request, User $user): \Illuminate\Http\RedirectResponse
    {
        $user->update($request->validated());

        return back()->with('success', 'Запись успешно обновлена');
    }

    /**
     * @route DELETE /users/{user}
     */
    public function destroy(User $user)
    {
        // trash

        return back()->with('success', 'Запись успешно удалена');
    }
}
