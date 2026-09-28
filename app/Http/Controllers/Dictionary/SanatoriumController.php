<?php

namespace App\Http\Controllers\Dictionary;

use App\Http\Controllers\Controller;
use App\Http\Controllers\Traits\BuildsListQuery;
use App\Http\Requests\SanatoriumRequest;
use App\Http\Resources\SanatoriumResource;
use App\Models\Dictionary\Sanatorium;
use App\Services\Dictionary\SanatoriumService;
use DB;
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
            perPage: 6,
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
        DB::transaction(function () use ($request, $sanatoriumService) {
            $sanatorium = $sanatoriumService->createSanatorium($request->validated());

            if ($request->hasFile('photo_thumbnail')) {
                $sanatoriumService->uploadGeneralPhoto($request->file('photo_thumbnail'), $sanatorium);
            }

            if ($request->hasFile('images')) {
                $sanatoriumService->uploadGalleryPhotos($request->file('images'), $sanatorium);
            }
        });

        return to_route('dictionary.sanatoriums.index')
            ->with('success', 'Запись успешно добавлена!');
    }

    /**
     * @route GET /dictionary/sanatoriums/{sanatorium}
     */
    public function show(Sanatorium $sanatorium): \Inertia\Response
    {
        $sanatorium->load('photos');
        return Inertia::render('Dictionary/Sanatorium/Show', [
            'sanatorium' => SanatoriumResource::make($sanatorium),
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

        return back()->with('success', 'Запись успешно удалена!');
    }
}
