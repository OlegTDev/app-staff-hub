<?php

namespace App\Http\Controllers;

use App\Contracts\RenderableDocument;
use App\Models\Document;
use App\Models\Sanatorium\DocumentSanatorium;
use App\Services\Pdf\DomPdfGenerator;
use Illuminate\Http\Request;
use Illuminate\Http\Response;

class DocumentGeneratePdfController
{
    /**
     * @route GET /documents/{document}/pdf
     */
    public function generate(Document $document, DomPdfGenerator $domPdfGenerator): Response
    {
        $requestableModel = $document->requestable;
        if ($requestableModel === null) {
            abort(500, 'Невозможно создать PDF для документа без запроса');
        }

        if (!$requestableModel instanceof RenderableDocument) {
            abort(500, 'Невозможно создать PDF для документа без RenderableDocument');
        }

        return $domPdfGenerator->stream($requestableModel->getTemplateName(), ['data' => $requestableModel->getTemplateData()]);
    }

    /**
     * @route POST /documents/sanatoriums/pdf-preview
     */
    public function preview(Request $request, DomPdfGenerator $domPdfGenerator): Response
    {
        $documentSanatorium = new DocumentSanatorium($request->input());
        return $domPdfGenerator->stream($documentSanatorium->getTemplateName(), ['data' => $documentSanatorium->getTemplateData()]);
    }
}
