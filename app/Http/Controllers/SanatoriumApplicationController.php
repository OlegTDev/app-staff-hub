<?php

namespace App\Http\Controllers;

use App\Http\Requests\SanatoriumApplicationRequest;
use App\Http\Resources\SanatoriumResource;
use App\Models\Dictionary\Sanatorium;
use App\Models\SanatoriumApplication;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SanatoriumApplicationController extends Controller
{
    /**
     * @route GET /sanatoriums/applications
     */
    public function index()
    {
        return Inertia::render('Sanatoriums/Applications/Index', [
            'labels' => config('labels.sanatorium_applications'),
        ]);
    }

    /**
     * @route GET /sanatoriums/applications/create
     */
    public function create()
    {
        $sanatoriums = SanatoriumResource::collection(Sanatorium::get());
        return Inertia::render('Sanatoriums/Applications/Create', [
            'labels' => config('labels.sanatorium_applications'),
            'sanatoriums' => $sanatoriums,
        ]);
    }

    /**
     * @route POST /sanatoriums/applications
     */
    public function store(SanatoriumApplicationRequest $request)
    {
        $validated = $request->validated();
        $data = array_merge($validated, ['user_id' => auth()->id(), 'app_date' => now()->format('Y-m-d')]);
        $model = SanatoriumApplication::create($data);
        $model->sanatoriumsAdditional()->sync($validated['sanatoriumsAdditional']);
        return to_route('sanatoriums.applications.index')->with('success', 'Заявление создано!');
    }

    /**
     * @route GET /sanatoriums/applications/{sanatoriumApplication}.
     */
    public function show(SanatoriumApplication $sanatoriumApplication)
    {
        //
    }

    /**
     * @route GET /sanatoriums/applications/{sanatoriumApplication}/edit
     */
    public function edit(SanatoriumApplication $sanatoriumApplication)
    {
        //
    }

    /**
     * @route PUT /sanatoriums/applications/{sanatoriumApplication}
     */
    public function update(Request $request, SanatoriumApplication $sanatoriumApplication)
    {
        //
    }

    /**
     * @route DELETE /sanatoriums/applications/{sanatoriumApplication}
     */
    public function destroy(SanatoriumApplication $sanatoriumApplication)
    {
        //
    }
}
