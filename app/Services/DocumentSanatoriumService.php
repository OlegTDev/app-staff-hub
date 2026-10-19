<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Sanatorium\DocumentSanatorium;

class DocumentSanatoriumService
{
    public function getApplicationsBuilder(bool $isModerator, int $userId)
    {
        $query = DocumentSanatorium::query();
        if (!$isModerator) {
            $query->withExists(['document' => fn($query) => $query->where('user_id', $userId)]);
        }
        return $query;
    }
}
