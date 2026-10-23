<?php

declare(strict_types=1);

namespace App\Models;

enum DocumentStatus: string
{
    case NEW = 'new';
    case SENDED = 'sended';
}
