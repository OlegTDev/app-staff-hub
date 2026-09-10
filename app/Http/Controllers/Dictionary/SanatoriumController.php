<?php

namespace App\Http\Controllers\Dictionary;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\BuildsListQuery;
use App\Http\Requests\SanatoriumRequest;
use App\Http\Resources\SanatoriumResource;
use App\Models\Dictionary\Sanatorium;
use App\Services\Dictionary\SanatoriumService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SanatoriumController extends Controller
{
    use BuildsListQuery;

    /**
     * @route GET /dictionary/sanatoriums
     */
    public function index(Request $request): \Inertia\Response
    {
        $paginatedData = $this->getPaginatedData(
            request: $request,
            query: Sanatorium::query()->orderBy('id', 'asc'),
            resourceClass: SanatoriumResource::class,
        );

        return Inertia::render('Dictionary/Sanatorium/Index', [
            ...$paginatedData,
            'labels' => config('labels.sanatorium'),
        ]);
    }

    /**
     * @route GET /dictionary/sanatoriums/create
     */
    public function create(): \Inertia\Response
    {
        return Inertia::render('Dictionary/Sanatorium/Create', [
            'labels' => config('labels.sanatorium'),
        ]);
    }

    /**
     * @route POST /dictionary/sanatoriums
     */
    public function store(SanatoriumRequest $request, SanatoriumService $sanatoriumService): RedirectResponse
    {
        $sanatoriumService->createSanatorium($request);

        return to_route('dictionary.sanatoriums.index')
            ->with('success', 'Запись успешно добавлена!');
    }

    /**
     * @route GET /dictionary/sanatoriums/{sanatorium}
     */
    public function show(Sanatorium $sanatorium): \Inertia\Response
    {
        return Inertia::render('Dictionary/Sanatorium/Show', [
            'sanatorium' => $sanatorium,
            'labels' => config('labels.sanatorium'),
        ]);
    }

    /**
     * @route GET /dictionary/sanatoriums/{sanatorium}/edit
     */
    public function edit(Sanatorium $sanatorium)
    {
        return Inertia::render('Dictionary/Sanatorium/Edit', [
            'sanatorium' => $sanatorium,
            'labels' => config('labels.sanatorium'),
        ]);
    }

    /**
     * @route PUT /dictionary/sanatoriums/{sanatorium}
     */
    public function update(SanatoriumRequest $request, Sanatorium $sanatorium): RedirectResponse
    {
        $sanatorium->update($request->validated());

        return to_route('dictionary.sanatoriums.index')
            ->with('success', 'Запись успешно изменена!');
    }


    /**
     * @route DELETE /dictionary/sanatoriums/{sanatorium}
     */
    public function destroy(Sanatorium $sanatorium)
    {
        $sanatorium->delete();

        return to_route('dictionary.sanatoriums.index')
            ->with('success', 'Запись успешно удалена!');
    }
}
