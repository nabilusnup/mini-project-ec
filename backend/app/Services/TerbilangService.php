<?php

namespace App\Services;

use Elastic\Elasticsearch\Exception\ClientResponseException;

class TerbilangService
{
    public function __construct(protected ElasticsearchService $elasticsearch)
    {
    }

    public function all(string $employeeId): array
    {
        if (!$this->elasticsearch->client()->indices()->exists(['index' => 'terbilang'])->asBool()) {
            return ['total' => 0, 'data' => []];
        }

        $result = $this->elasticsearch->client()->search([
            'index' => 'terbilang',
            'body' => [
                'size' => 100,
                'sort' => [['created_at' => ['order' => 'desc']]],
                'query' => ['term' => ['employee_id.keyword' => $employeeId]],
            ],
        ])->asArray();

        $data = array_map(function ($item) {
            $source = $item['_source'];
            unset($source['employee_id']);

            return ['id' => $item['_id'], ...$source];
        }, $result['hits']['hits']);

        return ['total' => $result['hits']['total']['value'], 'data' => $data];
    }

    public function create(array $data, string $employeeId): array
    {
        $document = [...$data, 'employee_id' => $employeeId, 'created_at' => now()->toIso8601String()];
        $result = $this->elasticsearch->client()->index([
            'index' => 'terbilang', 'body' => $document, 'refresh' => 'wait_for',
        ])->asArray();
        unset($document['employee_id']);

        return ['id' => $result['_id'], 'data' => $document];
    }

    public function delete(string $id, string $employeeId): bool
    {
        try {
            $document = $this->elasticsearch->client()->get([
                'index' => 'terbilang',
                'id' => $id,
            ])->asArray();

            if (($document['_source']['employee_id'] ?? null) !== $employeeId) {
                return false;
            }

            $this->elasticsearch->client()->delete(['index' => 'terbilang', 'id' => $id, 'refresh' => 'wait_for']);
            return true;
        } catch (ClientResponseException $exception) {
            if ($exception->getCode() === 404) {
                return false;
            }

            throw $exception;
        }
    }
}
