<?php

declare(strict_types=1);

namespace App\Services\Mail;

use App\Data\Mail\MailAttachmentData;
use App\Data\Mail\OutboundMailData;
use App\Data\Mail\RecipientData;
use App\Models\DocumentDelivery;

final class SanatoriumMailComposer
{
    private const SUBJECT = 'Заявление на санаторно-курортное лечение';

    private const BODY = '<p>Во вложении заявление на санаторно-курортное лечение.</p>';

    public function compose(DocumentDelivery $delivery, string $pdfContent): OutboundMailData
    {
        $document = $delivery->document;

        return new OutboundMailData(
            messageId: $delivery->message_id,
            recipient: RecipientData::adAccount($delivery->recipient),
            subject: self::SUBJECT,
            body: self::BODY,
            attachments: [
                MailAttachmentData::fromContent(
                    filename: sprintf('Заявление_на_санкур_%d.pdf', $document->id),
                    mime: 'application/pdf',
                    content: $pdfContent,
                ),
            ],
            metadata: [
                'source' => 'app-staff-hub',
                'document_id' => $document->id,
                'document_type' => 'sanatorium',
                'user_id' => $document->user_id,
            ],
        );
    }
}
