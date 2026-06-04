# Global Agent Constitution
**Version:** 1.3
**Status:** ACTIVE
**Scope:** All governed projects inheriting from this repository

---

## Purpose

This constitution defines the universal, non-negotiable rules that govern agent
behaviour across every project, product repo, and pod that inherits from this
global governance repository. No local constitution, gate override, or human
instruction may contradict or suspend these principles.

---

## Principles

### PRINCIPLE-02 — Problem Statement Prerequisite

A problem statement describing the user problem being solved must exist before
specification work begins. Requirements written without a problem statement have
no validated purpose and cannot be gate-checked for relevance.

---

### PRINCIPLE-03 — PII Declaration

Any system that collects or processes personally identifiable information must
explicitly declare the PII fields by name and must name a specific encryption
strategy for those fields. Vague language (e.g. "industry-standard measures",
"appropriate controls") does not satisfy this principle. The agent must reason
from requirements and business logic to identify implied PII -- it must not rely
on the word "PII" appearing explicitly.

---

### PRINCIPLE-04 — Payment Card Compliance

Any system that handles payment card data -- including card numbers, CVV codes,
expiry dates, or cardholder names -- must explicitly declare PCI-DSS in its
compliance list. Implied handling through a payment provider does not remove this
requirement. The agent must not assume a payment provider is in scope without
human confirmation.

---

### PRINCIPLE-05 — Admin Authentication

Any admin, manager, or privileged capability that provides access to user data
must have a specific, named authentication requirement. Vague statements such as
"appropriate access controls will be in place" do not satisfy this principle.
The named method must be specific enough to be implemented (e.g. MFA, OAuth 2.0,
RBAC with named roles).

---

### PRINCIPLE-06 — Data Retention Declaration

Any system that stores user data must declare a data retention period or deletion
policy. The absence of a retention declaration is a governance gap that must be
resolved before specification is approved.

---

### PRINCIPLE-07 — Contradiction Resolution

Directly contradictory requirements must be resolved by the human before any
progression. The agent must not resolve contradictions itself, must not choose
one requirement over another, and must not average or merge conflicting requirements.
Both conflicting requirements must be named explicitly in the block message.

---

## Amendment Rules

1. Amendments require a version increment to this document.
2. No amendment may weaken an existing principle.
3. Product repos that inherit from this governance must re-validate their local
   constitutions within 30 days of any amendment.