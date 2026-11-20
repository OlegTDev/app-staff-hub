<?php

declare(strict_types=1);

namespace App\Services\Pdf;

use Arr;
use Barryvdh\DomPDF\Facade\Pdf;
use Barryvdh\DomPDF\PDF as DomPdf;
use Illuminate\Http\Response;

class DomPdfGenerator
{
    public function stream(string $template, array $data, string $filename = 'Заявление', array $options = []): Response
    {
        $filename = Arr::get($options, 'filename', "$filename.pdf");

        return $this->make($template, $data, $options)->stream($filename);
    }

    /**
     * Возвращает бинарное содержимое PDF.
     */
    public function render(string $template, array $data, array $options = []): string
    {
        return $this->make($template, $data, $options)->output();
    }

    private function make(string $template, array $data, array $options): DomPdf
    {
        $paper = Arr::get($options, 'paper', 'a4');
        $orientation = Arr::get($options, 'orientation', 'portrait');

        return Pdf::loadView($template, $data)
            ->setPaper($paper, $orientation)
            ->setOption('isFontSubsettingEnabled', true)
            ->setOption('isHtml5ParserEnabled', true)
            ->setWarnings((bool) Arr::get($options, 'warnings', false));
    }
}
