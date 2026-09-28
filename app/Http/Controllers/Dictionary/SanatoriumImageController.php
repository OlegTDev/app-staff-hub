<?php

namespace App\Http\Controllers\Dictionary;

use App\Http\Controllers\Controller;
use App\Http\Resources\SanatoriumResource;
use App\Models\Dictionary\Sanatorium;
use App\Models\Dictionary\SanatoriumPhoto;
use App\Services\Dictionary\SanatoriumService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SanatoriumImageController extends Controller
{
    public function show(Sanatorium $sanatorium)
    {
        $sanatorium->load('photos');

        return Inertia::render('Dictionary/Sanatorium/Photos', [
            'sanatorium' => SanatoriumResource::make($sanatorium),
            'labels' => config('labels.sanatorium'),
        ]);
    }

    /**
     * @route POST /dictionary/sanatory/{id}/images
     */
    public function store(Request $request, Sanatorium $sanatorium, SanatoriumService $sanatoriumService): RedirectResponse
    {
        if ($request->hasFile('photo_thumbnail')) {
            $sanatoriumService->uploadGeneralPhoto($request->file('photo_thumbnail'), $sanatorium);
        }

        if ($request->hasFile('images')) {
            $sanatoriumService->uploadGalleryPhotos($request->file('images'), $sanatorium);
        }

        return back()->with('success', 'Изображения загружены');
    }

    /**
     * @route DELETE /dictionary/sanatory/{id}/images
     */
    public function destroy(Sanatorium $sanatorium, SanatoriumService $sanatoriumService): RedirectResponse
    {
       $sanatoriumService->deleteGeneralPhoto($sanatorium);
       return back()->with('success', 'Изображение удалено');
    }

    /**
     * @route DELETE /dictionary/sanatory/images-gallery/{id}
     */
    public function destroyGallery(SanatoriumPhoto $sanatoriumPhoto, SanatoriumService $sanatoriumService): RedirectResponse
    {
        $sanatoriumService->deleteGalleryPhoto($sanatoriumPhoto);
        return back()->with('success', 'Изображение удалено');
    }
}
