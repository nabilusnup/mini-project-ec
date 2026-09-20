<?php

namespace App\Services;

use Elastic\Elasticsearch\Exception\ClientResponseException;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class EmployeeService
{
    public const POSITION_SALARY_RANGES = [
        'Staff' => ['min' => 5_000_000, 'max' => 7_000_000],
        'Supervisor' => ['min' => 7_000_000, 'max' => 10_000_000],
        'Manager' => ['min' => 10_000_000, 'max' => 15_000_000],
    ];

    public function __construct(protected ElasticsearchService $elasticsearch) {}

    public function all(string $search = ''): array
    {
        $query = $search === ''
            ? ['match_all' => new \stdClass()]
            : ['bool' => [
                'should' => [
                    ['match' => ['name' => $search]],
                    ['wildcard' => ['employee_id' => ['value' => "*{$search}*", 'case_insensitive' => true]]],
                    ['wildcard' => ['email' => ['value' => "*{$search}*", 'case_insensitive' => true]]],
                    ['wildcard' => ['position' => ['value' => "*{$search}*", 'case_insensitive' => true]]],
                ],
                'minimum_should_match' => 1,
            ]];

        $result = $this->elasticsearch->client()->search([
            'index' => 'employees',
            'body' => ['query' => $query],
        ])->asArray();

        $employees = array_map(function ($item) {
            $employee = $item['_source'];
            unset($employee['password']);
            return $employee;
        }, $result['hits']['hits']);

        return ['total' => $result['hits']['total']['value'], 'data' => $employees];
    }

    public function create(array $data): array
    {
        $this->validateSalaryRange($data['position'], $data['salary']);

        if ($this->elasticsearch->client()->exists(['index' => 'employees', 'id' => $data['employee_id']])->asBool()) {
            throw ValidationException::withMessages(['employee_id' => 'Employee ID already exists.']);
        }

        $this->checkExistingEmail($data['email']);
        $data['password'] = Hash::make($data['password']);

        $result = $this->elasticsearch->client()->create([
            'index' => 'employees',
            'id' => $data['employee_id'],
            'body' => $data,
        ])->asArray();

        unset($data['password']);
        return ['id' => $result['_id'], 'data' => $data];
    }

    public function find(string $employeeId): ?array
    {
        try {
            $employee = $this->elasticsearch->client()->get([
                'index' => 'employees',
                'id' => $employeeId,
            ])->asArray()['_source'];
            unset($employee['password']);
            return $employee;
        } catch (ClientResponseException $exception) {
            if ($exception->getCode() === 404) {
                return null;
            }

            throw $exception;
        }
    }

    public function update(string $employeeId, array $data): ?string
    {
        try {
            $existing = $this->elasticsearch->client()->get([
                'index' => 'employees',
                'id' => $employeeId,
            ])->asArray()['_source'];
        } catch (ClientResponseException $exception) {
            if ($exception->getCode() === 404) {
                return null;
            }

            throw $exception;
        }

        $this->validateSalaryRange($data['position'] ?? $existing['position'], $data['salary'] ?? $existing['salary']);

        if (isset($data['email'])) {
            $this->checkExistingEmail($data['email'], $employeeId);
        }

        if (isset($data['password'])) {
            $data['password'] = Hash::make($data['password']);
        }

        $result = $this->elasticsearch->client()->update([
            'index' => 'employees',
            'id' => $employeeId,
            'body' => ['doc' => $data],
        ])->asArray();

        return $result['_id'];
    }

    public function delete(string $employeeId): ?string
    {
        try {
            $result = $this->elasticsearch->client()->delete([
                'index' => 'employees',
                'id' => $employeeId,
            ])->asArray();
            return $result['_id'];
        } catch (ClientResponseException $exception) {
            if ($exception->getCode() === 404) {
                return null;
            }

            throw $exception;
        }
    }

    private function checkExistingEmail(string $email, ?string $excludedEmployeeId = null): void
    {
        $bool = ['must' => [['term' => ['email' => $email]]]];
        if ($excludedEmployeeId) {
            $bool['must_not'] = [['term' => ['employee_id' => $excludedEmployeeId]]];
        }

        $result = $this->elasticsearch->client()->search([
            'index' => 'employees',
            'body' => ['size' => 1, 'query' => ['bool' => $bool]],
        ])->asArray();

        if ($result['hits']['total']['value'] > 0) {
            throw ValidationException::withMessages(['email' => 'Email already exists.']);
        }
    }

    private function validateSalaryRange(string $position, int $salary): void
    {
        if (!isset(self::POSITION_SALARY_RANGES[$position])) {
            throw ValidationException::withMessages(['position' => 'Position must be Staff, Supervisor, or Manager.']);
        }

        $range = self::POSITION_SALARY_RANGES[$position];
        if ($salary < $range['min'] || $salary > $range['max']) {
            $minimum = number_format($range['min'], 0, ',', '.');
            $maximum = number_format($range['max'], 0, ',', '.');
            throw ValidationException::withMessages([
                'salary' => "The salary for the {$position} position must be between Rp {$minimum} and Rp {$maximum}.",
            ]);
        }
    }
}
