<?php

namespace App\Observers;

use App\Models\Dictionary\Sanatorium;
use App\Services\Dictionary\SanatoriumService;

class SanatoriumObserver
{

    /**
     * Handle the Sanatorium "force deleted" event.
     */
    public function forceDeleted(Sanatorium $sanatorium, SanatoriumService $sanatoriumService): void
    {
        $sanatoriumService->deleteFolder($sanatorium);
    }

}
