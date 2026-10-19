<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Controllers\Traits\BuildsListQuery;
use App\Http\Requests\DocumentSanatoriumRequest;
use App\Http\Resources\DocumentSanatoriumResource;
use App\Http\Resources\SanatoriumResource;
use App\Models\Dictionary\Sanatorium;
use App\Models\SanatoriumApplication;
use App\Services\DocumentSanatoriumService;
use Illuminate\Http\Request;
use Inertia\Inertia;

class SanatoriumApplicationController extends Controller
{
    use BuildsListQuery;

    /**
     * @route GET /sanatoriums/applications
     */
    public function index(Request $request, DocumentSanatoriumService $sanatoriumApplicationService): \Inertia\Response
    {
        /** @var \App\Models\User */
        $user = auth()->user();
        $isModerator = $user->hasRoles(UserRole::ADMIN->value, UserRole::SANATORIUM_MODERATOR->value);
        $query = $sanatoriumApplicationService->getApplicationsBuilder($isModerator, $user->id);
        $query->with(['sanatoriumsAdditional']);

        $paginatedData = $this->getPaginatedData(
            request: $request,
            query: $query->orderBy('id', 'asc'),
            resourceClass: DocumentSanatoriumResource::class,
            perPage: 10,
        );

        return Inertia::render('Sanatoriums/Applications/Index', [
            ...$paginatedData,
            'labels' => config('labels.sanatorium_applications'),
            'isModerator' => $isModerator,
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
    public function store(DocumentSanatoriumRequest $request)
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
        $sanatoriumApplicationResource = DocumentSanatoriumResource::make($sanatoriumApplication);
        return Inertia::render('Sanatoriums/Applications/Show', [
            'labels' => config('labels.sanatorium_applications'),
            'sanatoriumApplication' => $sanatoriumApplicationResource,
        ]);
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
