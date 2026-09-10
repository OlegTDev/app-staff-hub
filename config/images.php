<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Default Image Driver
    |--------------------------------------------------------------------------
    |
    | This option controls the default image processing driver that will be
    | used when manipulating or converting images. This driver is always
    | utilized unless another driver is explicitly specified instead.
    |
    | Supported: "gd", "imagick"
    |
    */

    'default' => env('IMAGE_DRIVER', 'gd'),

    /*
    |--------------------------------------------------------------------------
    | Настройки изображений по умолчанию
    |--------------------------------------------------------------------------
    */
    'settings' => [
        'default' => [
            'thumb' => [
                'width' => env('IMAGE_DEFAULT_THUMB_WIDTH', 300),
                'height' => env('IMAGE_DEFAULT_THUMB_HEIGHT', 300),
                'is_private' => false,
            ],
        ],
    ],

];
