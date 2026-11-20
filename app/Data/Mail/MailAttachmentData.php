<?php

declare(strict_types=1);

namespace App\Data\Mail;

final readonly class MailAttachmentData
{
    public function __construct(
        public string $filename,
        public string $mime,
        public string $contentBase64,
    ) {
    }

    public static function fromContent(string $filename, string $mime, string $content): self
    {
        return new self($filename, $mime, base64_encode($content));
    }

    /**
     * @return array{filename: string, mime: string, content_base64: string}
     */
    public function toArray(): array
    {
        return [
            'filename' => $this->filename,
            'mime' => $this->mime,
            'content_base64' => $this->contentBase64,
        ];
    }
}
