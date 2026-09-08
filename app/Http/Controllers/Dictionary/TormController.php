<?php

namespace App\Http\Controllers\Dictionary;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\BuildsListQuery;
use App\Http\Requests\TormRequest;
use App\Http\Resources\TormResource;
use App\Models\Dictionary\Torm;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class TormController extends Controller
{
    use BuildsListQuery;

    /**
     * @route GET /dictionary/torm
     */
    public function index(Request $request): \Inertia\Response
    {
        $paginatedData = $this->getPaginatedData(
            request: $request,
            query: Torm::query()->orderBy('code', 'asc'),
            resourceClass: TormResource::class,
        );

        return Inertia::render('Dictionary/Torms/Index', [
            ...$paginatedData,
            'labels' => config('labels.torm'),
        ]);
    }

    public function store(TormRequest $request): RedirectResponse
    {
        Torm::create($request->validated());
        return back()->with('success', 'Запись успешно добавлена');
    }

    public function update(TormRequest $request, Torm $torm): RedirectResponse
    {
        $torm->update($request->validated());
        return back()->with('success', 'Запись успешно обновлена');
    }

}
