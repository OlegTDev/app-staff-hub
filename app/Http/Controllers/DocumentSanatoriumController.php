<?php

namespace App\Http\Controllers;

use App\Actions\Sanatorium\SendSanatoriumApplicationAction;
use App\Enums\UserRole;
use App\Http\Controllers\Traits\BuildsListQuery;
use App\Http\Requests\DocumentSanatoriumRequest;
use App\Http\Resources\DocumentSanatoriumResource;
use App\Http\Resources\SanatoriumResource;
use App\Models\Dictionary\Sanatorium;
use App\Models\Document;
use App\Models\Sanatorium\DocumentSanatorium;
use App\Models\DocumentStatus;
use App\Services\DocumentSanatoriumService;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use Illuminate\Http\RedirectResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
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
        $query->with(['sanatoriumsAdditional', 'document.latestDelivery', 'sanatorium']);

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
            'isAdmin' => $isAdmin,
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
     */
    public function store(
        DocumentSanatoriumRequest $request,
        SendSanatoriumApplicationAction $sendAction,
    ): RedirectResponse {
        $validated = $request->validated();
        $syncData = [];
        foreach ($validated['sanatoriumsAdditional'] as $index => $id) {
            $syncData[$id] = [
                'sort_order' => $index + 1,
            ];
        }

        $status = $validated['send'] ? DocumentStatus::SENDED : DocumentStatus::NEW;

        DB::transaction(function () use ($validated, $syncData, $status, $sendAction): void {
            $documentSanatorium = DocumentSanatorium::create($validated);
            $documentSanatorium->sanatoriumsAdditional()->sync($syncData);
            $document = new Document([
                'user_id' => auth()->id(),
                'status' => $status,
            ]);
            $documentSanatorium->document()->save($document);

            if ($status === DocumentStatus::SENDED) {
                $sendAction->execute($document);
            }
        });

        return to_route('documents.sanatoriums.index')->with('success', 'Заявление создано!');
    }

    /**
     * @route GET /documents/sanatoriums/{documentSanatorium}/edit
     */
    public function edit(DocumentSanatorium $documentSanatorium): \Inertia\Response
    {
        $this->authorize('update', $documentSanatorium);

        $documentSanatorium->load(['sanatorium', 'sanatoriumsAdditional', 'document.latestDelivery']);

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
    public function update(
        DocumentSanatoriumRequest $request,
        DocumentSanatorium $documentSanatorium,
        SendSanatoriumApplicationAction $sendAction,
    ): RedirectResponse {
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
        $wasSent = $documentSanatorium->document->status === DocumentStatus::SENDED;

        DB::transaction(function () use ($documentSanatorium, $validated, $syncData, $status, $wasSent, $sendAction): void {
            $documentSanatorium->update($validated);
            $documentSanatorium->sanatoriumsAdditional()->sync($syncData);
            $documentSanatorium->document->update(['status' => $status]);

            if ($status === DocumentStatus::SENDED && !$wasSent) {
                $sendAction->execute($documentSanatorium->document);
            }
        });

        $message = $status === DocumentStatus::SENDED ? 'Заявление отправлено.' : 'Заявление обновлено.';

        return to_route('documents.sanatoriums.index')
            ->with('success', $message);
    }

    /**
     * @route POST /documents/sanatoriums/{documentSanatorium}/resend
     */
    public function resend(
        DocumentSanatorium $documentSanatorium,
        SendSanatoriumApplicationAction $sendAction,
    ): RedirectResponse {
        $this->authorize('resend', $documentSanatorium);

        $document = $documentSanatorium->document;

        if ($document->status !== DocumentStatus::SENDED) {
            return to_route('documents.sanatoriums.index')
                ->with('error', 'Повторная отправка доступна только для отправленных заявлений.');
        }

        $sendAction->resend($document);

        return to_route('documents.sanatoriums.index')
            ->with('success', 'Письмо повторно передано в сервис отправки.');
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
