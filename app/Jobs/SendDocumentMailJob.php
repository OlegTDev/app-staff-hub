<?php

declare(strict_types=1);

namespace App\Jobs;

use App\Contracts\MessagePublisher;
use App\Contracts\RenderableDocument;
use App\Enums\DeliveryStatus;
use App\Models\DocumentDelivery;
use App\Services\Mail\SanatoriumMailComposer;
use App\Services\Pdf\DomPdfGenerator;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldBeUnique;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Bus\Dispatchable;
use Illuminate\Queue\InteractsWithQueue;
use Illuminate\Queue\SerializesModels;
use RuntimeException;
use Throwable;

final class SendDocumentMailJob implements ShouldQueue, ShouldBeUnique
{
    use Dispatchable;
    use InteractsWithQueue;
    use Queueable;
    use SerializesModels;

    public int $tries = 5;

    public int $timeout = 120;

    public function __construct(public readonly int $deliveryId)
    {
        $this->onQueue((string) config('services.outbound_mail.queue', 'mail'));
        $this->afterCommit();
    }

    public function uniqueId(): string
    {
        return (string) $this->deliveryId;
    }

    /**
     * @return list<int>
     */
    public function backoff(): array
    {
        return [10, 30, 60, 120];
    }

    public function handle(
        MessagePublisher $publisher,
        DomPdfGenerator $pdfGenerator,
        SanatoriumMailComposer $composer,
    ): void {
        $delivery = DocumentDelivery::query()
            ->with('document.requestable')
            ->find($this->deliveryId);

        if ($delivery === null || $delivery->status === DeliveryStatus::PUBLISHED) {
            return;
        }

        $document = $delivery->document;
        $requestable = $document->requestable;

        if (!$requestable instanceof RenderableDocument) {
            throw new RuntimeException(sprintf('Документ #%d не поддерживает генерацию PDF.', $document->id));
        }

        $delivery->registerAttempt();

        $pdf = $pdfGenerator->render($requestable->getTemplateName(), ['data' => $requestable->getTemplateData()]);
        $mail = $composer->compose($delivery, $pdf);

        $publisher->publish(
            (string) config('services.outbound_mail.exchange'),
            (string) config('services.outbound_mail.routing_key'),
            $mail->toArray(),
        );

        $delivery->markPublished();
    }

    public function failed(?Throwable $exception): void
    {
        DocumentDelivery::query()
            ->find($this->deliveryId)
            ?->markFailed($exception?->getMessage() ?? 'Неизвестная ошибка публикации');
    }
}
