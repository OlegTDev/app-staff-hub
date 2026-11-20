<?php

declare(strict_types=1);

namespace App\Actions\Sanatorium;

use App\Enums\DeliveryStatus;
use App\Jobs\SendDocumentMailJob;
use App\Models\Document;
use App\Models\DocumentDelivery;
use Illuminate\Support\Str;

final class SendSanatoriumApplicationAction
{
    /**
     * Создаёт запись о доставке и ставит задание на публикацию письма в очередь.
     */
    public function execute(Document $document): DocumentDelivery
    {
        $recipient = (string) config('services.outbound_mail.recipient');

        $delivery = DocumentDelivery::query()->create([
            'document_id' => $document->id,
            'message_id' => (string) Str::uuid(),
            'recipient' => $recipient,
            'status' => DeliveryStatus::PENDING,
        ]);

        if ($recipient === '') {
            $delivery->markFailed('Не задан получатель письма (OUTBOUND_MAIL_RECIPIENT).');

            return $delivery;
        }

        SendDocumentMailJob::dispatch($delivery->id);

        return $delivery;
    }

    /**
     * Ручная повторная отправка: создаёт новую доставку с новым message_id.
     */
    public function resend(Document $document): DocumentDelivery
    {
        return $this->execute($document);
    }
}
