<?php

declare(strict_types=1);

namespace App\Data\Mail;

final readonly class RecipientData
{
    public const TYPE_AD_ACCOUNT = 'ad_account';

    public function __construct(
        public string $type,
        public string $login,
    ) {
    }

    public static function adAccount(string $login): self
    {
        return new self(self::TYPE_AD_ACCOUNT, $login);
    }

    /**
     * @return array{type: string, login: string}
     */
    public function toArray(): array
    {
        return [
            'type' => $this->type,
            'login' => $this->login,
        ];
    }
}
