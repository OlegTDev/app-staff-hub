<?php
declare(strict_types=1);

namespace App\Http\Controllers\Traits;

use Illuminate\Http\Request;
use Illuminate\Database\Eloquent\Builder as BuilderEloquent;
use Illuminate\Pagination\AbstractPaginator;

trait BuildsListQuery
{
    private const string SORT_FIELD = 'sortField';
    private const string SORT_ORDER = 'sortDirection';

    public function paginate(
        Request $request,
        BuilderEloquent $query,
        array $allowSortFields = [],
        array $filterFields = ['search'],
        int $perPage = 10,

    ): AbstractPaginator {
        return $this->baseBuildQuery($request, $query, $allowSortFields, $filterFields, $perPage);
    }

    public function getPaginatedData(
        Request $request,
        BuilderEloquent $query,
        array $allowSortFields = [],
        array $filterFields = ['search'],
        int $perPage = 10,
        ?string $resourceClass = null,
        \Closure $transformCallback = null,
    ): array {
        $paginator = $this->baseBuildQuery($request, $query, $allowSortFields, $filterFields, $perPage);

        if ($resourceClass && class_exists($resourceClass)) {
            $paginator = $paginator->through(fn ($model) => (new $resourceClass($model))->toArray($request));
            $items = $paginator->toArray();
        } elseif (is_callable($transformCallback)) {
            $items = $transformCallback($paginator->toArray());
        } else {
            $items = $paginator;
        }

        return [
            'items' => $items,
            'query' => $request->only([...$filterFields, self::SORT_FIELD, self::SORT_ORDER]),
        ];
    }

    private function baseBuildQuery(
        Request $request,
        BuilderEloquent $query,
        array $allowSortFields = [],
        array $filterFields = ['search'],
        int $perPage = 10,
    ): AbstractPaginator
    {
        $queryClone = clone $query;

        $this->applyFilter($request, $queryClone, $filterFields);
        $this->applySort($request, $queryClone, $allowSortFields);

        return $queryClone->paginate($perPage)->withQueryString();
    }

    /**
     * @param Request $request
     * @param BuilderEloquent|{@method filter()} $buildQuery
     * @param array $fields
     */
    private function applyFilter(Request $request, BuilderEloquent $buildQuery, array $fields): void
    {
        $model = $buildQuery->getModel();
        if (method_exists($model, 'scopeFilter')) {
            $buildQuery->filter($request->only($fields));
        }
    }

    private function applySort(Request $request, BuilderEloquent $buildQuery, array $allowedFields = []): void
    {
        $allowedFields = empty($allowedFields) ? $buildQuery->getModel()->getFillable() : $allowedFields;

        $field = $request->input(self::SORT_FIELD);
        $order = $request->input(self::SORT_ORDER, 'asc');

        if ($field && in_array($field, $allowedFields)) {
            $buildQuery->reorder()->orderBy($field, $order);
        }
    }
}
