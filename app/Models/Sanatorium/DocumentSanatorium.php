<?php

namespace App\Models\Sanatorium;

use App\Contracts\RenderableDocument;
use App\Models\Dictionary\Sanatorium;
use App\Models\Document;
use Illuminate\Database\Eloquent\Attributes\Fillable;
use Illuminate\Database\Eloquent\Attributes\Table;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\MorphOne;

/**
 * @property int $id
 * @property string $to_organization
 * @property string $to_manager_name
 * @property int $sanatorium_id
 * @property \Carbon\CarbonInterface $app_date
 * @property string $user_name
 * @property string $user_organization
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
 *
 * @property Document $document
 * @property-read Sanatorium $sanatorium
 * @property-read \Illuminate\Database\Eloquent\Collection<Sanatorium> $sanatoriumsAdditional
 */
#[Fillable([
    'to_organization', 'to_manager_name', 'sanatorium_id', 'app_date', 'user_name', 'user_organization',
    'user_department', 'user_position', 'user_place', 'user_telephone_inner', 'user_telephone_outer',
    'user_relatives', 'vacation_start', 'vacation_end', 'any_date_during_vacation', 'arrival_date_from',
    'arrival_date_to', 'status',
])]
#[Table('document_sanatoriums')]
class DocumentSanatorium extends Model implements RenderableDocument
{
    public $timestamps = false;

    protected $casts = [
        'user_relatives' => 'array',
        'app_date' => 'date:Y-m-d',
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
        return $this->belongsToMany(Sanatorium::class, 'document_sanatorium_additional');
    }

    public function document(): MorphOne
    {
        return $this->morphOne(Document::class, 'requestable');
    }

    public function getTemplateName(): string
    {
        return 'pdf.documents.sanatorium';
    }

    public function getTemplateData(): DocumentSanatoriumPdfMapper
    {
        $dateFormat = config('app.date_format');
        return new DocumentSanatoriumPdfMapper($this, $dateFormat);
    }

}
