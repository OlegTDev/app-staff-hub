<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Controllers\Traits\BuildsListQuery;
use App\Http\Requests\DocumentSanatoriumRequest;
use App\Http\Resources\DocumentSanatoriumResource;
use App\Http\Resources\SanatoriumResource;
use App\Models\Dictionary\Sanatorium;
use App\Models\Sanatorium\DocumentSanatorium;
use App\Services\DocumentSanatoriumService;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentSanatoriumController extends Controller
{
    use BuildsListQuery;

    /**
     * @route GET /documents/sanatoriums
     */
    public function index(Request $request, DocumentSanatoriumService $documentSanatoriumService): \Inertia\Response
    {
        /** @var \App\Models\User */
        $user = auth()->user();
        $isModerator = $user->hasRoles(UserRole::ADMIN->value, UserRole::SANATORIUM_MODERATOR->value);
        $query = $documentSanatoriumService->getApplicationsBuilder($isModerator, $user->id);
        $query->with(['sanatoriumsAdditional']);

        $paginatedData = $this->getPaginatedData(
            request: $request,
            query: $query->orderBy('id', 'asc'),
            resourceClass: DocumentSanatoriumResource::class,
            perPage: 10,
        );

        return Inertia::render('Documents/Sanatoriums/Index', [
            ...$paginatedData,
            'labels' => config('labels.document_sanatorium'),
            'isModerator' => $isModerator,
        ]);
    }

    /**
     * @route GET /documents/sanatoriums/create
     */
    public function create(): \Inertia\Response
    {
        $sanatoriums = SanatoriumResource::collection(Sanatorium::get());
        return Inertia::render('Documents/Sanatoriums/Create', [
            'labels' => config('labels.document_sanatorium'),
            'sanatoriums' => $sanatoriums,
        ]);
    }

    /**
     * @route POST /documents/sanatoriums
     * @todo Вынести в сервис
     */
    public function store(DocumentSanatoriumRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $data = [...$validated, 'user_organization' => 'УФНС', 'app_date' => now()->format('Y-m-d'), 'to_organization' => 'UFNS', 'to_manager_name' => 'RUK'];
        $syncData = [];
        foreach ($validated['sanatoriumsAdditional'] as $index => $id) {
            $syncData[$id] = [
                'sort_order' => $index + 1,
            ];
        }

        $documentSanatorium = DocumentSanatorium::create($data);
        $documentSanatorium->sanatoriumsAdditional()->sync($syncData);
        $documentSanatorium->document()->create(['user_id' => auth()->id(), 'status' => 'new']);

        return to_route('documents.sanatoriums.index')->with('success', 'Заявление создано!');
    }

    /**
     * @route GET /documents/sanatoriums/{sanatorium}
     */
    public function show(DocumentSanatorium $documentSanatorium)
    {
        $documentSanatorium->load(['document']);
        $sanatoriumApplicationResource = DocumentSanatoriumResource::make($documentSanatorium);
        return Inertia::render('Documents/Sanatoriums/Show', [
            'labels' => config('labels.document_sanatorium'),
            'sanatoriumApplication' => $sanatoriumApplicationResource,
            'pdfUrl' => Inertia::defer(fn() => route('documents.pdf', ['document' => $documentSanatorium->document->id])),
        ]);
    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(string $id)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        //
    }
}
