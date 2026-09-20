<?php

namespace App\Http\Controllers;

use App\Services\TerbilangService;
use Illuminate\Http\Request;

class TerbilangController extends Controller
{
    public function __construct(protected TerbilangService $terbilangService) {}

    public function index(Request $request)
    {
        $employeeId = $request->attributes->get('auth_user')['employee_id'];

        return response()->json([
            'success' => true,
            ...$this->terbilangService->all($employeeId),
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'amount' => 'required|integer|min:1|max:999999999999999',
            'result' => 'required|string|max:1000',
        ]);

        $employeeId = $request->attributes->get('auth_user')['employee_id'];
        $result = $this->terbilangService->create($validated, $employeeId);

        return response()->json([
            'success' => true,
            'message' => 'Conversion result saved successfully',
            ...$result,
        ], 201);
    }

    public function destroy(Request $request, string $id)
    {
        $employeeId = $request->attributes->get('auth_user')['employee_id'];

        if (!$this->terbilangService->delete($id, $employeeId)) {
            return response()->json([
                'success' => false,
                'message' => 'Conversion history not found',
            ], 404);
        }

        return response()->json([
            'success' => true,
            'message' => 'Conversion history deleted successfully',
        ]);
    }
}
