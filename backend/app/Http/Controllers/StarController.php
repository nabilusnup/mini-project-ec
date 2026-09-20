<?php

namespace App\Http\Controllers;

use App\Services\StarService;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class StarController extends Controller
{
    public function __construct(protected StarService $starService) {}

    public function index(Request $request)
    {
        $employeeId = $request->attributes->get('auth_user')['employee_id'];

        return response()->json([
            'success' => true,
            ...$this->starService->all($employeeId),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'number' => 'required|integer|min:1|max:30',
            'type' => ['required', 'string', Rule::in(['Type 1', 'Type 2', 'Type 3'])],
        ]);

        $employeeId = $request->attributes->get('auth_user')['employee_id'];
        $result = $this->starService->create($validated, $employeeId);

        return response()->json([
            'success' => true,
            'message' => 'Stars saved successfully',
            ...$result,
        ], 201);
    }

    public function destroy(Request $request, string $id)
    {
        $employeeId = $request->attributes->get('auth_user')['employee_id'];

        if (!$this->starService->delete($id, $employeeId)) {
            return response()->json([
                'success' => false,
                'message' => 'Star history not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Star history deleted successfully',
        ]);
    }
}
