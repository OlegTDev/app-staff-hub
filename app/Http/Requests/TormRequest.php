<?php

namespace App\Http\Requests;

use App\Models\Dictionary\Torm;
use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Support\Facades\Route;
use Illuminate\Validation\Rule;

class TormRequest extends FormRequest
{
    private ?Torm $_torm;

    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
        $this->_torm = Route::input('torm');
        return true;
    }

    /**
     * Get the validation rules that apply to the request.
     *
     * @return array<string, ValidationRule|array<mixed>|string>
     */
    public function rules(): array
    {
        return [
            'code' => [
                'required',
                Rule::unique('torms', 'code')->ignore($this->_torm?->id),
                'string',
                'max:10',
            ],
            'name' => ['required', 'string', 'max:150'],
        ];
    }

    public function attributes(): array
    {
        return config('labels.torm');
    }
}
