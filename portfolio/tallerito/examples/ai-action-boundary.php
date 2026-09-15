<?php
/**
 * SANITIZED PORTFOLIO EXAMPLE
 *
 * Illustrative only. This is not production Tallerito code.
 * It demonstrates an allowlisted server-side action boundary without exposing
 * real tables, routes, provider contracts, credentials or business rules.
 */

final class AiActionBoundary
{
    private const ALLOWED_ACTIONS = [
        'read_work_order',
        'create_work_order_draft',
        'search_vehicle_history',
    ];

    public function execute(string $action, array $payload, array $actor): array
    {
        if (!in_array($action, self::ALLOWED_ACTIONS, true)) {
            throw new RuntimeException('Action is not allowed.');
        }

        $this->assertAuthenticated($actor);
        $this->assertAuthorizedForWorkspace($actor, $payload);

        $requestId = $this->stableRequestId($action, $payload, $actor);

        if ($this->alreadyProcessed($requestId)) {
            return $this->previousResult($requestId);
        }

        $result = match ($action) {
            'read_work_order' => $this->readWorkOrder($payload, $actor),
            'create_work_order_draft' => $this->createDraft($payload, $actor),
            'search_vehicle_history' => $this->searchHistory($payload, $actor),
        };

        $this->audit($requestId, $action, $actor, $result);

        return $result;
    }

    // Portfolio placeholders: production implementations are intentionally private.
    private function assertAuthenticated(array $actor): void {}
    private function assertAuthorizedForWorkspace(array $actor, array $payload): void {}
    private function stableRequestId(string $action, array $payload, array $actor): string { return 'synthetic-id'; }
    private function alreadyProcessed(string $requestId): bool { return false; }
    private function previousResult(string $requestId): array { return []; }
    private function readWorkOrder(array $payload, array $actor): array { return []; }
    private function createDraft(array $payload, array $actor): array { return []; }
    private function searchHistory(array $payload, array $actor): array { return []; }
    private function audit(string $requestId, string $action, array $actor, array $result): void {}
}
