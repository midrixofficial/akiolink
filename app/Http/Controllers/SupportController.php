<?php

namespace App\Http\Controllers;

use App\Models\Support;
use App\Models\SupportReply;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class SupportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $tickets = Support::where('user_id', $user->id)
            ->with('replies')
            ->orderBy('created_at', 'desc')
            ->get();

        return response()->json($tickets);
    }

    public function store(Request $request): JsonResponse
    {
        $user = $request->user();

        $validated = $request->validate([
            'subject' => ['required', 'string', 'max:255'],
            'category' => ['nullable', 'string', 'max:100'],
            'message' => ['required', 'string'],
        ]);

        $ticket = Support::create([
            'user_id' => $user->id,
            'subject' => $validated['subject'],
            'category' => $validated['category'] ?? 'technical',
            'message' => $validated['message'],
            'status' => 'open',
        ]);

        return response()->json([
            'message' => 'Support ticket created successfully.',
            'ticket' => $ticket->load('replies')
        ], 201);
    }

    public function reply(Request $request, $id): JsonResponse
    {
        $user = $request->user();
        $ticket = Support::where('user_id', $user->id)->findOrFail($id);

        $validated = $request->validate([
            'message' => ['required', 'string'],
        ]);

        $reply = SupportReply::create([
            'support_id' => $ticket->id,
            'user_id' => $user->id,
            'message' => $validated['message'],
        ]);

        return response()->json([
            'message' => 'Reply posted successfully.',
            'reply' => $reply->load('user')
        ], 201);
    }
}
