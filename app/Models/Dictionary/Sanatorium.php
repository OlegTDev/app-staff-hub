<?php

namespace App\Models\Dictionary;

use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\SoftDeletes;

/**
 * @property int $id
 * @property string $name
 * @property string $city
 * @property string|null $address
 * @property string[] $infrastructure
 * @property string[] $services
 * @property string[] $medical_profiles
 * @property string|null $description
 * @property \Carbon\CarbonInterface $created_at
 * @property \Carbon\CarbonInterface $updated_at
 *
 * @property-read \Illuminate\Support\Collection<SanatoriumPhoto> $photos
 */
#[Fillable(['name', 'city', 'address', 'infrastructure', 'services', 'medical_profiles', 'description'])]
class Sanatorium extends Model
{
    use SoftDeletes, HasFactory;

    protected $table = 'sanatoriums';

    protected $casts = [
        'infrastructure' => 'array',
        'services' => 'array',
        'medical_profiles' => 'array',
    ];

    public function photos(): HasMany
    {
        return $this->hasMany(SanatoriumPhoto::class, 'sanatorium_id');
    }
}
