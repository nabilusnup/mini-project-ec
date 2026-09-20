<?php

namespace App\Http\Controllers;

use App\Services\EmployeeService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class EmployeeController extends Controller
{
    public function __construct(protected EmployeeService $employeeService) {}

    public function index(Request $request)
    {
        $result = $this->employeeService->all(trim($request->query('search', '')));

        return response()->json([
            'success' => true,
            ...$result,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate($this->rules());

        $result = $this->employeeService->create($validated);

        return response()->json([
            'success' => true,
            'message' => 'Employee created successfully',
            ...$result,
        ], 201);
    }

    public function show(string $employeeId)
    {
        $employee = $this->employeeService->find($employeeId);

        if (!$employee) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $employee,
        ]);
    }

    public function update(Request $request, string $employeeId)
    {
        $validated = $request->validate($this->rules(true));
        $id = $this->employeeService->update($employeeId, $validated);

        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Employee updated successfully',
            'id' => $id,
        ]);
    }

    public function destroy(Request $request, string $employeeId)
    {
        $currentEmployeeId = $request->attributes->get('auth_user')['employee_id'];

        if ($currentEmployeeId === $employeeId) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own account while signed in',
            ], 422);
        }

        $id = $this->employeeService->delete($employeeId);

        if (!$id) {
            return response()->json([
                'success' => false,
                'message' => 'Employee not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Employee deleted successfully',
            'id' => $id,
        ]);
    }

    private function rules(bool $partial = false): array
    {
        $required = $partial ? 'sometimes|required' : 'required';

        return [
            'employee_id' => $partial ? 'prohibited' : 'required|string',
            'name' => "{$required}|string|max:255",
            'birth_date' => "{$required}|date_format:Y-m-d",
            'age' => "{$required}|integer|min:0",
            'address' => "{$required}|string",
            'province' => "{$required}|string",
            'city' => "{$required}|string",
            'district' => "{$required}|string",
            'village' => "{$required}|string",
            'position' => $partial
                ? ['sometimes', 'required', 'string', Rule::in(array_keys(EmployeeService::POSITION_SALARY_RANGES))]
                : ['required', 'string', Rule::in(array_keys(EmployeeService::POSITION_SALARY_RANGES))],
            'salary' => "{$required}|integer|min:0",
            'email' => "{$required}|email",
            'password' => $partial ? 'sometimes|required|string|min:6' : 'required|string|min:6',
        ];
    }
}
