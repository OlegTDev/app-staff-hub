<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\DocumentStatus;
use App\Models\Sanatorium\DocumentSanatorium;

class DocumentSanatoriumService
{
    public function getApplicationsBuilder(bool $isModerator, bool $isAdmin, int $userId)
    {
        $query = DocumentSanatorium::query();
        $query->whereHas('document', static function($query) use($isModerator, $isAdmin, $userId) {
            $query->where(static function($subQuery) use ($isModerator, $isAdmin, $userId) {
                $subQuery->where('user_id', $userId);

                if ($isModerator) {
                    $subQuery->orWhere(static function($groupQuery) use ($userId) {
                        $groupQuery->where('user_id', '<>', $userId)
                        ->where('status', DocumentStatus::SENDED->value);
                        });
                        }

                if ($isAdmin) {
                    $subQuery->orWhere(static function($groupQuery) use ($userId) {
                        $groupQuery->where('user_id', '<>', $userId);
                    });
                }

            });
        });
        return $query;
    }
}
