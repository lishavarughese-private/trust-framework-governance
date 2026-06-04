# trust-framework-governance

Central Spec-Kit Governance Repository -- the single source of truth for all rules,
gates, and evaluator logic that every governed product repo inherits.

## Contents

| Folder | Purpose |
|--------|---------|
| `governance/CONSTITUTION.md` | 14 immutable principles (PII, sycophancy resistance, phase integrity, etc.) |
| `governance/gates/` | 47 gate evaluator modules (HARD, SOFT, INFO severities) across 5 phase folders |
| `governance/evaluator/` | Gate evaluator engine -- `gate-evaluator.js` + `evaluate-phase.js` |
| `governance/tests/` | Unit tests (89 cases), sycophancy resistance proof, constitution integrity/coverage |
| `governance/examples/` | Sample artifacts for testing and reference |
| `governance/METRICS.json` | Global metric thresholds by severity |

## Inheritance

Product repos pin a governance version in `.governance/REFERENCE.txt` and inherit
all gates automatically. Local rules may only extend (stricter), never weaken.