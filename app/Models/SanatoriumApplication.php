<?php

namespace App\Models;

use App\Models\Dictionary\Sanatorium;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

/**
 * @property int $id
 * @property int $user_id
 * @property int $sanatorium_id
 * @property \Carbon\CarbonInterface $app_date
 * @property string $user_name
 * @property string $user_department
 * @property string $user_position
 * @property string $user_place
 * @property string $user_telephone_inner
 * @property string $user_telephone_outer
 * @property mixed $user_relatives
 * @property \Carbon\CarbonInterface $vacation_start
 * @property \Carbon\CarbonInterface $vacation_end
 * @property bool $any_date_during_vacation
 * @property \Carbon\CarbonInterface|null $arrival_date_from
 * @property \Carbon\CarbonInterface|null $arrival_date_to
 * @property string $status
 * @property \Carbon\CarbonInterface $create_at
 * @property \Carbon\CarbonInterface $updated_at
 *
 * @property-read Sanatorium $sanatorium
 * @property-read \Illuminate\Database\Eloquent\Collection<Sanatorium> $sanatoriumsAdditional
 */
#[Fillable([
    'sanatorium_id', 'user_id', 'app_date', 'user_name', 'user_department', 'user_position', 'user_place',
    'user_telephone_inner', 'user_telephone_outer', 'user_relatives', 'vacation_start', 'vacation_end',
    'any_date_during_vacation', 'arrival_date_from', 'arrival_date_to', 'status',
])]
#[Table('sanatoriums_applications')]
class SanatoriumApplication extends Model
{
    protected $casts = [
        'user_relatives' => 'array',
        'vacation_start' => 'date:Y-m-d',
        'vacation_end' => 'date:Y-m-d',
        'arrival_date_from' => 'date:Y-m-d',
        'arrival_date_to' => 'date:Y-m-d',
    ];

    public function sanatorium(): BelongsTo
    {
        return $this->belongsTo(Sanatorium::class);
    }

    public function sanatoriumsAdditional(): BelongsToMany
    {
        return $this->belongsToMany(Sanatorium::class, 'sanatoriums_applications_additional');
    }
}
