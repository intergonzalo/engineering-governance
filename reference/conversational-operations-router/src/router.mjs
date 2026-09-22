const AFFIRMATIVE = new Set(['yes', 'y', 'ok', 'okay', 'sure', 'confirm', 'sim', 'sí', 'dale']);

function normalize(text) {
  return text.trim().toLowerCase().replace(/[.!?]+$/g, '');
}

function livePending(session, now) {
  if (!session.pending) return null;
  return session.pending.expiresAt > now ? session.pending : null;
}

function envelope(session, action, args, correlationId) {
  return Object.freeze({
    action,
    args: Object.freeze({ ...args }),
    actorId: session.actorId,
    workspaceId: session.workspaceId,
    correlationId,
  });
}

export function routeTurn({ session, text, data, now = Date.now(), correlationId }) {
  if (!session?.actorId || !session?.workspaceId) throw new Error('authenticated_session_required');
  if (!correlationId) throw new Error('correlation_id_required');

  const utterance = normalize(text);
  const pending = livePending(session, now);
  const nextSession = { ...session, pending };

  if (pending?.kind === 'confirm_action' && AFFIRMATIVE.has(utterance)) {
    return {
      status: 'execute',
      envelope: envelope(session, pending.action, pending.args, correlationId),
      session: { ...nextSession, pending: null },
    };
  }

  if (pending?.kind === 'choose_candidate') {
    const index = Number.parseInt(utterance, 10);
    if (Number.isInteger(index) && index >= 1 && index <= pending.candidates.length) {
      const candidate = pending.candidates[index - 1];
      const args = { ...pending.baseArgs, itemId: candidate.id };
      if (pending.destructive) {
        return {
          status: 'confirm',
          message: `Confirm ${pending.action} for ${candidate.label}?`,
          session: {
            ...nextSession,
            pending: { kind: 'confirm_action', action: pending.action, args, expiresAt: now + 300_000 },
          },
        };
      }
      return {
        status: 'execute',
        envelope: envelope(session, pending.action, args, correlationId),
        session: { ...nextSession, pending: null },
      };
    }
  }

  if (AFFIRMATIVE.has(utterance)) {
    return { status: 'no_action', message: 'No pending action to confirm.', session: { ...nextSession, pending: null } };
  }

  if (utterance.includes('show this order') || utterance.includes('open this order')) {
    if (!session.currentOrderId) return { status: 'clarify', message: 'No current order in context.', session: nextSession };
    return {
      status: 'execute',
      envelope: envelope(session, 'read_order', { orderId: session.currentOrderId }, correlationId),
      session: nextSession,
    };
  }

  const deleteMatch = utterance.match(/(?:delete|remove)\s+(.+)/);
  if (deleteMatch) {
    const term = deleteMatch[1].trim();
    const candidates = data.items.filter((item) => item.label.toLowerCase().includes(term));
    if (candidates.length === 0) return { status: 'clarify', message: 'No matching item.', session: nextSession };
    if (candidates.length > 1) {
      return {
        status: 'clarify',
        message: 'Multiple items match. Choose by index.',
        candidates: candidates.map((item, index) => ({ index: index + 1, id: item.id, label: item.label, detail: item.detail })),
        session: {
          ...nextSession,
          pending: {
            kind: 'choose_candidate',
            action: 'delete_item',
            destructive: true,
            baseArgs: { orderId: session.currentOrderId },
            candidates,
            expiresAt: now + 300_000,
          },
        },
      };
    }
    const args = { orderId: session.currentOrderId, itemId: candidates[0].id };
    return {
      status: 'confirm',
      message: `Confirm delete_item for ${candidates[0].label}?`,
      session: {
        ...nextSession,
        pending: { kind: 'confirm_action', action: 'delete_item', args, expiresAt: now + 300_000 },
      },
    };
  }

  const priceMatch = utterance.match(/(?:set|change)\s+(.+?)\s+price\s+to\s+(\d+(?:\.\d+)?)/);
  if (priceMatch) {
    const [, term, rawPrice] = priceMatch;
    const candidates = data.items.filter((item) => item.label.toLowerCase().includes(term.trim()));
    if (candidates.length !== 1) {
      return { status: 'clarify', message: candidates.length ? 'Multiple items match.' : 'No matching item.', session: nextSession };
    }
    return {
      status: 'execute',
      envelope: envelope(session, 'update_item_price', {
        orderId: session.currentOrderId,
        itemId: candidates[0].id,
        price: Number(rawPrice),
      }, correlationId),
      session: nextSession,
    };
  }

  return { status: 'no_action', message: 'No allowlisted operation recognized.', session: nextSession };
}
