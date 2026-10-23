<?php
/**
 * @var \App\Models\Sanatorium\DocumentSanatoriumPdfMapper $data
 * */
?>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="utf-8">
    <title>Заявление на санаторно-курортное лечение</title>
    <style>
        body {
            font-family: 'DejaVu Sans', 'sans-serif';
            font-size: 14px;
            line-height: 1.5;
            color: #000;
            margin: 20px;
        }
        .header-table {
            width: 100%;
            border-collapse: collapse;
            margin-bottom: 30px;
        }
        .header-table td {
            vertical-align: top;
            padding: 0;
        }
        .header-right {
            width: 17.5em;
            font-size: 13px;
        }
        .title {
            text-align: center;
            font-weight: bold;
            font-size: 16px;
            margin-bottom: 25px;
            letter-spacing: 1px;
        }
        .text-justify {
            text-align: justify;
            text-indent: 30px; /* Красная строка */
            margin-bottom: 15px;
        }
        .list-item {
            text-align: justify;
            margin-left: 30px;
            margin-bottom: 8px;
        }
        .warning-title {
            text-align: center;
            font-weight: bold;
            margin-top: 25px;
            margin-bottom: 10px;
        }
        .footer-table {
            width: 100%;
            margin-top: 40px;
            border-collapse: collapse;
        }
        .footer-table td {
            width: 50%;
            vertical-align: bottom;
        }
        .underline {
            border-bottom: 1px solid #000;
            display: inline-block;
            width: 150px;
            text-align: center;
        }
    </style>
</head>
<body>
    <table class="header-table">
        <tr>
            <td>
            </td>
            <td class="header-right">
                {{ $data->getOrganizationName() }}<br>
                <strong>{{ $data->getManagerName() }}</strong><br>
                {{ $data->getUserOrganization() }} ({{ $data->getUserPlace() }})
                <br>
                <strong>{{ $data->getUserName() }}</strong><br>
                {{ Str::lower($data->getUserPosition()) }}<br />
                {{ Str::lower($data->getUserDepartment()) }}<br />
                тел. раб.: {{ $data->getUserTelephoneInner() }}<br>
                тел. сот.: {{ $data->getUserTelephoneOuter() }}
            </td>
        </tr>
    </table>

    <div class="title">ЗАЯВЛЕНИЕ</div>

    <div class="text-justify">
        @php
            $totalVacationPackages = count($data->getUserRelatives()) + 1;
        @endphp
        Прошу выделить {{ $totalVacationPackages }} {{ trans_choice('documents.count_vacation_packages', $totalVacationPackages, ['count' => $totalVacationPackages]) }}
        мне{{ $totalVacationPackages > 1 ? ' и моей семье:' : '' }}
    </div>

    @foreach($data->getUserRelatives() as $index => $member)
        <div class="list-item">
            {{ $index + 1 }}. {{ $member['type'] }} <strong>{{ $member['name'] }}</strong> {{ $member['birthdate'] }} г.р.{{ $member['description'] ?? '' }}
        </div>
    @endforeach

    <div class="list-item" style="margin-top: 10px;">
        на санаторно-курортное лечение в санаторий-профилакторий «{{ $data->getMainSanatoriumName() }}» г. {{ $data->getMainSanatoriumCity() }}.
    </div>

    <!-- Условия периода -->
    <div class="text-justify" style="margin-top: 20px;">
        Период отпуска с {{ $data->getVacationDateStart() }} по {{ $data->getVacationDateEnd() }}.
        Желаемая дата заезда:
        @if ($data->anyDateDuringVacation())
            любая дата заезда в период отпуска.
        @else
            с {{ $data->arrivalDateFrom() }} по {{ $data->arrivalDateTo() }}.
        @endif
        В отсутствии желаемого периода в санаторий-профилакторий «{{ $data->getMainSanatoriumName() }}» г. {{ $data->getMainSanatoriumCity() }}
        @if (count($data->sanatoriumsAdditional()) > 0)
            рассматриваю другие санатории:
            @foreach ($data->sanatoriumsAdditional() as $sanatoriumAdditional)
                «{{ $sanatoriumAdditional['name'] }}» г. {{ $sanatoriumAdditional['city'] }}
            @endforeach
        @else
            другие санатории не рассматриваю.
        @endif
    </div>

    <div class="text-justify" style="font-weight: bold;">
        В случае отказа от путёвок, выделенных мне{{ $totalVacationPackages > 1 ? ' и моей семье' : '' }},
        обязуюсь найти кандидатов на санаторно-курортное лечение.
    </div>

    <!-- Подпись и дата -->
    <table class="footer-table">
        <tr>
            <td>{{ $data->appDate() ?? now()->format('d.m.Y') }}</td>
            <td style="text-align: right;">
                {{ $data->getUserName() }} <span class="underline">&nbsp;</span>
            </td>
        </tr>
    </table>

</body>
</html>
