<?php

declare(strict_types=1);

namespace App\Services;

use App\Models\Sanatorium\DocumentSanatorium;

class DocumentSanatoriumService
{
    public function getApplicationsBuilder(bool $isModerator, int $userId)
    {
        $query = DocumentSanatorium::query();
        $query->whereHas('document', static function($query) use($isModerator, $userId) {
            $query->where(static function($subQuery) use ($isModerator, $userId) {
                $subQuery->where('user_id', $userId);

                if ($isModerator) {
                    $subQuery->orWhere(static function($groupQuery) use ($userId) {
                        $groupQuery->where('user_id', '<>', $userId)
                            ->where('status', 'send');
                    });
                }
            });
        });
        return $query;
    }
}
