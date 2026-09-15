/**
 * SANITIZED PORTFOLIO EXAMPLE
 *
 * This file is illustrative and is not production code.
 * It demonstrates a selective-deployment policy without exposing
 * real repository paths, infrastructure identifiers or business logic.
 */

const TARGETS = {
  "ui-admin/": "admin-ui",
  "ui-client/": "client-ui",
  "ui-investor/": "investor-ui",
  "server/": "serverless",
};

export function resolveDeployment(changedFiles) {
  const targets = new Set();
  let unmappedRuntimeChange = false;

  for (const file of changedFiles) {
    if (file.startsWith("docs/") || file.endsWith(".md")) continue;

    const match = Object.entries(TARGETS)
      .find(([prefix]) => file.startsWith(prefix));

    if (match) {
      targets.add(match[1]);
      continue;
    }

    // Unknown runtime-impacting changes do not silently become "deploy all".
    unmappedRuntimeChange = true;
  }

  if (unmappedRuntimeChange) {
    return {
      allowed: false,
      reason: "Deployment impact is not safely mapped.",
      targets: [],
    };
  }

  return {
    allowed: true,
    targets: [...targets],
  };
}
