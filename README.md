# SeekAPI Public Surface — Product Direction Retired

The previous SeekAPI public product direction is no longer maintained.

```yaml
status: LEGACY_PUBLIC_CONTENT__DO_NOT_MAINTAIN_AS_CURRENT_PRODUCT
changed_at: 2026-08-15
new_project: CatalogFlow / China Offer Graph
canonical_governance_repo: kiddhu/aion-governance
canonical_project_root: projects/catalogflow
implementation_control: https://github.com/kiddhu/aion-governance/issues/879
public_domain_target: seekapi.ai
```

## Current direction

`seekapi.ai` is being reassigned as the public developer/Agent-data surface for CatalogFlow's China Offer Graph and Agent-callable data primitives.

The first candidate Primitive is `compare_china_offers_v0`: given a procurement requirement and multiple China-source offers, return which offers satisfy the requirement, which are fairly comparable, normalized unit prices, material differences, missing fields, confidence and evidence.

## Historical content

Existing historical blog/SEO/SDK assets are preserved for audit/history or selective reuse. They must not be treated or maintained as current SeekAPI product claims.

Do not add new content for the retired model-gateway/runtime product direction unless it is separately reactivated by the Monarch.

## Boundary

This public repository is not the canonical source for private product logic, data rights, credentials, internal workflows or production secrets. Canonical project decisions and implementation control remain under `kiddhu/aion-governance/projects/catalogflow` and Issue #879.
