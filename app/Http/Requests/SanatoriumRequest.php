<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;

class SanatoriumRequest extends FormRequest
{
    /**
     * Determine if the user is authorized to make this request.
     */
    public function authorize(): bool
    {
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
            'name' => ['required', 'string'],
            'city' => ['required', 'string'],
            'address' => ['string', 'nullable'],
            'infrastructure' => ['array', 'nullable'],
            'services' => ['array', 'nullable'],
            'medical_profiles' => ['array', 'nullable'],
            'description' => ['string', 'nullable'],
            'images' => ['array', 'nullable'],
            'images.*' => ['image'],
        ];
    }

    public function attributes(): array
    {
        return config('labels.sanatorium');
    }
}
