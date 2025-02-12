<?php

namespace App\Http\Middleware;

use App\UserType;
use Closure;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Symfony\Component\HttpFoundation\Response;

class ApiAdminMiddleware {
    /**
     * Handle an incoming request.
     *
     * @param Closure(Request): (Response) $next
     */
    public function handle (Request $request, Closure $next): Response {
        $token = $request->bearerToken();

        if (!$token) {
            return response()->json(['message' => 'Token não encontrado'], 401);
        }

        $user = Auth::guard('sanctum')->user();

        if (!$user) {
            return response()->json(['message' => 'Usuário não autenticado'], 401);
        }
        if ($user->type !== UserType::ADMIN->value) {
            return response()->json([
                'message' => 'Acesso negado. Apenas administradores podem acessar esta rota.'
            ], 403);
        }

        return $next($request);
    }
}
