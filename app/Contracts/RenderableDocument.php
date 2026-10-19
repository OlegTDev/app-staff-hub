<?php

namespace App\Contracts;

interface RenderableDocument
{
    /**
     * Возвращает путь к Blade-шаблону для этого документа.
     */
    public function getTemplateName(): string;

    /**
     * Возвращает массив данных, которые специфичны для этого шаблона.
     */
    public function getTemplateData(): array|object;
}
