<?php

namespace App\Http\Requests;

use Illuminate\Contracts\Validation\ValidationRule;
use Illuminate\Foundation\Http\FormRequest;
use Illuminate\Validation\Rule;

/**
 * @mixin \App\Models\Sanatorium\DocumentSanatorium
 */
class DocumentSanatoriumRequest extends FormRequest
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
            'sanatorium_id' => ['required', 'exists:sanatoriums,id'],
            'sanatoriumsAdditional' => ['array'],
            'sanatoriumsAdditional.*' => ['numeric', 'exists:sanatoriums,id'],
            'user_name' => ['required', 'string', 'max:100'],
            'user_department' => ['required', 'string', 'max:100'],
            'user_position' => ['required', 'string', 'max:100'],
            'user_place' => ['required', 'string', 'max:50'],
            'user_telephone_inner' => ['required', 'string', 'max:30'],
            'user_telephone_outer' => ['required', 'string', 'max:30'],
            'user_relatives' => ['array'],
            'user_relatives.*.type' => ['required', 'string', 'max:30'],
            'user_relatives.*.name' => ['required', 'string', 'max:100'],
            'user_relatives.*.birthdate' => ['required', 'date'],
            'user_relatives.*.description' => ['string', 'nullable'],
            'vacation_start' => ['required', 'date', Rule::date()->format('Y-m-d')],
            'vacation_end' => ['required', 'date', Rule::date()->format('Y-m-d')],
            'any_date_during_vacation' => ['boolean'],
            'arrival_date_from' => ['date', 'required_if_declined:any_date_during_vacation', Rule::date()->format('Y-m-d')],
            'arrival_date_to' => ['date', 'required_if_declined:any_date_during_vacation', Rule::date()->format('Y-m-d')],
            // 'app_date' => ['required', 'date', Rule::date()->format('Y-m-d')],
            'agree' => ['accepted'],
        ];
    }

    public function attributes(): array
    {
        return config('labels.document_sanatorium');
    }
}
