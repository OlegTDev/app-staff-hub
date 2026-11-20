<?php

declare(strict_types=1);

namespace App\Data\Mail;

final readonly class OutboundMailData
{
    public const VERSION = 1;

    /**
     * @param list<MailAttachmentData> $attachments
     * @param array<string, scalar|null> $metadata
     */
    public function __construct(
        public string $messageId,
        public RecipientData $recipient,
        public string $subject,
        public string $body,
        public array $attachments = [],
        public string $bodyType = 'html',
        public array $metadata = [],
        public int $version = self::VERSION,
    ) {
    }

    /**
     * @return array<string, mixed>
     */
    public function toArray(): array
    {
        return [
            'message_id' => $this->messageId,
            'version' => $this->version,
            'recipient' => $this->recipient->toArray(),
            'subject' => $this->subject,
            'body_type' => $this->bodyType,
            'body' => $this->body,
            'attachments' => array_map(
                static fn (MailAttachmentData $attachment): array => $attachment->toArray(),
                $this->attachments,
            ),
            'metadata' => $this->metadata,
        ];
    }
}
