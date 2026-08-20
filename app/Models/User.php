<?php

namespace App\Models;

use Database\Factories\UserFactory;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Hidden;
use Illuminate\Database\Eloquent\Builder;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Illuminate\Notifications\Notifiable;
use LdapRecord\Laravel\Auth\AuthenticatesWithLdap;

/**
 * @property int $id
 * @property string $name
 * @property string $email
 * @property ?\DateTime $email_verified_at
 * @property string $password
 * @property ?string $remember_token
 * @property string $login
 * @property ?string $company
 * @property ?string $department
 * @property ?string $position
 * @property ?string $telephone
 * @property string $guid
 * @property string $domain
 * @property ?\Carbon\CarbonInterface $created_at
 * @property ?\Carbon\CarbonInterface $updated_at
 *
 * @property-read \Illuminate\Support\Collection<Role> $roles
 */
#[Fillable(['name', 'email', 'password', 'login', 'company', 'department', 'position', 'telephone', 'guid', 'domain'])]
#[Hidden(['password', 'remember_token'])]
class User extends Authenticatable
{
    /** @use HasFactory<UserFactory> */
    use HasFactory, Notifiable;
    use AuthenticatesWithLdap;

    /**
     * Get the attributes that should be cast.
     *
     * @return array<string, string>
     */
    protected function casts(): array
    {
        return [
            'email_verified_at' => 'datetime',
            'password' => 'hashed',
        ];
    }

    public function roles(): BelongsToMany
    {
        return $this->belongsToMany(Role::class);
    }

    public function scopeFilter(Builder $query, array $filters): void
    {
        $query->when($filters['search'] ?? null, function (Builder $query, string $search) {
            $query->whereLike('name', "%$search%")
                ->orWhereLike('login', "%$search%");
        });
    }

}
