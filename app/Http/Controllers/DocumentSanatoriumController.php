<?php

namespace App\Http\Controllers;

use App\Enums\UserRole;
use App\Http\Controllers\Traits\BuildsListQuery;
use App\Http\Requests\DocumentSanatoriumRequest;
use App\Http\Resources\DocumentSanatoriumResource;
use App\Http\Resources\SanatoriumResource;
use App\Models\Dictionary\Sanatorium;
use App\Models\Sanatorium\DocumentSanatorium;
use App\Models\DocumentStatus;
use App\Services\DocumentSanatoriumService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DocumentSanatoriumController extends Controller
{
    use AuthorizesRequests, BuildsListQuery;

    /**
     * @route GET /documents/sanatoriums
     */
    public function index(Request $request, DocumentSanatoriumService $documentSanatoriumService): \Inertia\Response
    {
        /** @var \App\Models\User */
        $user = auth()->user();
        $isModerator = $user->hasRoles(UserRole::SANATORIUM_MODERATOR->value);
        $isAdmin = $user->hasRole(UserRole::ADMIN->value);
        $query = $documentSanatoriumService->getApplicationsBuilder($isModerator, $isAdmin, $user->id);
        $query->with(['sanatoriumsAdditional', 'document']);

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
            'settings' => [
                'organization' => config('settings.organization.normal'),
                'manager' => config('settings.manager.toShort'),
            ],
        ]);
    }

    /**
     * @route POST /documents/sanatoriums
     * @todo Вынести в сервис
     */
    public function store(DocumentSanatoriumRequest $request): RedirectResponse
    {
        $validated = $request->validated();
        $syncData = [];
        foreach ($validated['sanatoriumsAdditional'] as $index => $id) {
            $syncData[$id] = [
                'sort_order' => $index + 1,
            ];
        }

        $status = $validated['send'] ? DocumentStatus::SENDED : DocumentStatus::NEW;
        $documentSanatorium = DocumentSanatorium::create($validated);
        $documentSanatorium->sanatoriumsAdditional()->sync($syncData);
        $documentSanatorium->document()->create(['user_id' => auth()->id(), 'status' => $status]);

        return to_route('documents.sanatoriums.index')->with('success', 'Заявление создано!');
    }

    /**
     * @route GET /documents/sanatoriums/{documentSanatorium}/edit
     */
    public function edit(DocumentSanatorium $documentSanatorium): \Inertia\Response
    {
        $this->authorize('update', $documentSanatorium);

        $documentSanatorium->load(['sanatorium', 'sanatoriumsAdditional']);

        return Inertia::render('Documents/Sanatoriums/Edit', [
            'labels' => config('labels.document_sanatorium'),
            'documentSanatorium' => DocumentSanatoriumResource::make($documentSanatorium),
            'sanatoriums' => SanatoriumResource::collection(Sanatorium::get()),
            'settings' => [
                'organization' => config('settings.organization.normal'),
                'manager' => config('settings.manager.toShort'),
            ],
        ]);
    }

    /**
     * @route PUT /documents/sanatoriums/{documentSanatorium}
     */
    public function update(DocumentSanatoriumRequest $request, DocumentSanatorium $documentSanatorium): RedirectResponse
    {
        $validated = $request->validated();

        $syncData = [];
        if (isset($validated['sanatoriumsAdditional'])) {
            foreach ($validated['sanatoriumsAdditional'] as $index => $id) {
                $syncData[$id] = [
                    'sort_order' => $index + 1,
                ];
            }
        }

        $status = $validated['send'] ? DocumentStatus::SENDED : DocumentStatus::NEW;
        $documentSanatorium->update($validated);
        $documentSanatorium->sanatoriumsAdditional()->sync($syncData);
        $documentSanatorium->document->update(['status' => $status]);

        $message = $status === DocumentStatus::SENDED ? 'Заявление отправлено.' : 'Заявление обновлено.';

        return to_route('documents.sanatoriums.index')
            ->with('success', $message);
    }

    /**
     * @route DELETE /documents/sanatoriums/{documentSanatorium}
     */
    public function destroy(DocumentSanatorium $documentSanatorium): RedirectResponse
    {
        $this->authorize('delete', $documentSanatorium);

        $documentSanatorium->document()->delete();
        $documentSanatorium->delete();

        return to_route('documents.sanatoriums.index')
            ->with('success', 'Заявление удалено.');
    }
}
