<?php

namespace App\Models\Sanatorium;


class DocumentSanatoriumPdfMapper
{
    public function __construct(private readonly DocumentSanatorium $documentSanatorium, private readonly string $dateFormat) {}

    public function getOrganizationName(): string
    {
        return $this->documentSanatorium->to_organization;
    }

    public function getManagerName(): string
    {
        return $this->documentSanatorium->to_manager_name;
    }

    public function getUserOrganization(): string
    {
        return $this->documentSanatorium->user_organization;
    }

    public function getUserPlace(): string
    {
        return $this->documentSanatorium->user_place;
    }

    public function getUserName(): string
    {
        return $this->documentSanatorium->user_name;
    }

    public function getUserDepartment(): string
    {
        return $this->documentSanatorium->user_department;
    }

    public function getUserPosition(): string
    {
        return $this->documentSanatorium->user_position;
    }

    public function getUserTelephoneInner(): string
    {
        return $this->documentSanatorium->user_telephone_inner;
    }

    public function getUserTelephoneOuter(): string
    {
        return $this->documentSanatorium->user_telephone_outer;
    }

    public function getUserRelatives(): array
    {
        return $this->documentSanatorium->user_relatives ?? [];
    }

    public function getMainSanatoriumName(): string
    {
        return $this->documentSanatorium->sanatorium->name;
    }

    public function getMainSanatoriumCity(): string
    {
        return $this->documentSanatorium->sanatorium->city;
    }

    public function getVacationDateStart(): string
    {
        return $this->documentSanatorium->vacation_start->format($this->dateFormat);
    }

    public function getVacationDateEnd(): string
    {
        return $this->documentSanatorium->vacation_end->format($this->dateFormat);
    }

    public function anyDateDuringVacation(): bool
    {
        return $this->documentSanatorium->any_date_during_vacation;
    }

    public function arrivalDateFrom(): string
    {
        return $this->documentSanatorium->arrival_date_from->format($this->dateFormat);
    }

    public function arrivalDateTo(): string
    {
        return $this->documentSanatorium->arrival_date_to->format($this->dateFormat);
    }

    public function sanatoriumsAdditional(): array
    {
        return $this->documentSanatorium->sanatoriumsAdditional->toArray();
    }

    public function appDate(): string
    {
        return $this->documentSanatorium->app_date->format($this->dateFormat);
    }

}
