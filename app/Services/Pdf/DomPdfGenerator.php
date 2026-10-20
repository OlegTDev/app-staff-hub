<?php

declare(strict_types=1);

namespace App\Services\Pdf;

use Arr;
use Barryvdh\DomPDF\Facade\Pdf;
use Illuminate\Http\Response;

class DomPdfGenerator
{
    public function stream(string $template, array $data, array $options = []): Response
    {
        $paper = Arr::get($options, 'paper', 'a4');
        $orientation = Arr::get($options, 'orientation', 'portrait');
        $pdf = Pdf::loadView($template, $data);
        $pdf
            ->setPaper($paper, $orientation)
            ->setWarnings(Arr::get($options, 'warnings', false));

        $filename = Arr::get($options, 'filename', 'report.pdf');
        return $pdf->stream($filename);
    }
}
