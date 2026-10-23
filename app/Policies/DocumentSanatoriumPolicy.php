<?php

namespace App\Policies;

use App\Enums\UserRole;
use App\Models\Sanatorium\DocumentSanatorium;
use App\Models\DocumentStatus;
use App\Models\User;

class DocumentSanatoriumPolicy
{
    /**
     * Determine whether the user can create models.
     */
    public function create(User $user): bool
    {
        return true;
    }

    /**
     * Determine whether the user can update the model.
     */
    public function update(User $user, DocumentSanatorium $documentSanatorium): bool
    {
        if ($user->hasRole(UserRole::ADMIN->value) || $user->hasRole(UserRole::SANATORIUM_MODERATOR->value)) {
            return true;
        }

        return $user->id === $documentSanatorium->document->user_id
            && $documentSanatorium->document->status === DocumentStatus::NEW;
    }

    /**
     * Determine whether the user can delete the model.
     */
    public function delete(User $user, DocumentSanatorium $documentSanatorium): bool
    {
        if ($user->hasRole(UserRole::ADMIN->value)) {
            return true;
        }

        if ($user->id === $documentSanatorium->document->user_id && $documentSanatorium->document->status === DocumentStatus::NEW) {
            return true;
        }

        return false;
    }

    /**
     * Determine whether the user can restore the model.
     */
    public function restore(User $user, DocumentSanatorium $documentSanatorium): bool
    {
        return $user->hasRole(UserRole::ADMIN->value);
    }

    /**
     * Determine whether the user can permanently delete the model.
     */
    public function forceDelete(User $user, DocumentSanatorium $documentSanatorium): bool
    {
        return $user->hasRole(UserRole::ADMIN->value);
    }
}
