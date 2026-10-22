<?php

namespace App\Models\Sanatorium;


class DocumentSanatoriumPdfMapper
{
    public function __construct(private readonly DocumentSanatorium $documentSanatorium, private readonly string $dateFormat) {}

    public function getOrganizationName(): string|null
    {
        return $this->documentSanatorium->to_organization;
    }

    public function getManagerName(): string|null
    {
        return $this->documentSanatorium->to_manager_name;
    }

    public function getUserOrganization(): string|null
    {
        return $this->documentSanatorium->user_organization;
    }

    public function getUserPlace(): string|null
    {
        return $this->documentSanatorium->user_place;
    }

    public function getUserName(): string|null
    {
        return $this->documentSanatorium->user_name;
    }

    public function getUserDepartment(): string|null
    {
        return $this->documentSanatorium->user_department;
    }

    public function getUserPosition(): string|null
    {
        return $this->documentSanatorium->user_position;
    }

    public function getUserTelephoneInner(): string|null
    {
        return $this->documentSanatorium->user_telephone_inner;
    }

    public function getUserTelephoneOuter(): string|null
    {
        return $this->documentSanatorium->user_telephone_outer;
    }

    public function getUserRelatives(): array
    {
        return $this->documentSanatorium->user_relatives ?? [];
    }

    public function getMainSanatoriumName(): string|null
    {
        // @phpstan-ignore nullsafe.neverNull
        return $this->documentSanatorium->sanatorium?->name;
    }

    public function getMainSanatoriumCity(): string|null
    {
        // @phpstan-ignore nullsafe.neverNull
        return $this->documentSanatorium->sanatorium?->city;
    }

    public function getVacationDateStart(): string|null
    {
        // @phpstan-ignore nullsafe.neverNull
        return $this->documentSanatorium->vacation_start?->format($this->dateFormat);
    }

    public function getVacationDateEnd(): string|null
    {
        // @phpstan-ignore nullsafe.neverNull
        return $this->documentSanatorium->vacation_end?->format($this->dateFormat);
    }

    public function anyDateDuringVacation(): bool|null
    {
        return $this->documentSanatorium->any_date_during_vacation;
    }

    public function arrivalDateFrom(): string|null
    {
        return $this->documentSanatorium->arrival_date_from?->format($this->dateFormat);
    }

    public function arrivalDateTo(): string|null
    {
        return $this->documentSanatorium->arrival_date_to?->format($this->dateFormat);
    }

    public function sanatoriumsAdditional(): array
    {
        return $this->documentSanatorium->sanatoriumsAdditional->toArray();
    }

    public function appDate(): string|null
    {
        // @phpstan-ignore nullsafe.neverNull
        return $this->documentSanatorium->app_date?->format($this->dateFormat);
    }

}
