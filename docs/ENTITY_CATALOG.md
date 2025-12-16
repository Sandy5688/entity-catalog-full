# **ENTITY CATALOG Documentation**

## **1. Overview**

The Entity Catalog is a **global, category-agnostic service** that stores metadata about organizations in any country.  
It provides **REST APIs, background workers, caching, metrics, and admin tools** while maintaining strict authentication and audit logs.

---

## **2. Repository Structure**

```plaintext
/migrations/2025xxxx_create_entity_catalog.sql
/src/services/entityCatalog.service.js
/src/routes/entity.routes.js
/src/controllers/entity.controller.js
/src/services/metadataCatalog.service.js
/workers/entityDiscovery.worker.js
/workers/metadataIngestion.worker.js
/services/scraper.service.js
/src/services/ai/entityMatcher.js
/src/utils/textNormalizer.js
/src/services/region.service.js
/src/services/cacheAggregator.service.js
/src/services/redis.client.js
/docs/ENTITY_CATALOG.md
/tests/

3. Database Schema
entity_catalog
Columns: id, display_name, slug, entity_category, primary_country, primary_subregion, website_url, info_page_url, contact_url, contact_email, source, processing_notes, coverage_regions, is_active, created_at, updated_at.

Unique index: (slug, primary_country)

Triggers: auto-update updated_at

metadata_catalog
Columns: id, entity_id, package_name, package_key, raw_data, features, source, imported_at.

Index: metadata_catalog(entity_id)

Triggers: auto-update updated_at

admin_audit_log
Columns: admin_id, action_type, entity_ids, details, created_at.

4. Public API Endpoints
Method	Endpoint	Auth Required	Description
GET	/api/v1/entity	Optional	Query entities by country, region, category
GET	/api/v1/entity/:id	Optional	Retrieve a single entity by ID
POST	/api/v1/entity/import/manual	Yes	Import entities from JSON/CSV
POST	/api/v1/entity/suggest	Yes	Suggest entity via semi-structured text
POST	/api/v1/entity/:id/refresh-metadata	Yes	Refresh metadata for entity
POST	/api/v1/entity/merge	Yes	Merge duplicate entities (admin only)
GET	/metrics	No	Prometheus metrics endpoint
GET	/healthz	No	Health check for Docker container

Auth & RBAC:

Unauthenticated → 401

Non-admin trying admin actions → 403

Admin or system role → allowed

5. Background Workers
entityDiscovery.worker.js
Periodically queries public directories/search engines

Scrapes homepage, contact, and about pages

Inserts/updates entity_catalog

No domain-specific logic

metadataIngestion.worker.js
Fetches structured JSON from APIs or fallback scrapers

Stores raw JSON in metadata_catalog

No parsing or scoring

6. Text Matching Layer
Entity Matcher: fuzzy matching, phonetic similarity, token normalization

Text Normalizer: removes punctuation, symbols, and legal suffixes (Inc, LLC, Ltd, etc.)

7. Region Resolution & Caching
Logic: exact match → country-only → global fallback

Cache Key: region:entities:<country>-<subregion>

TTL: 300–600 seconds

Fallback: verifies region → country → global

8. Metrics & Monitoring
Metric	Type	Description
entity_created_total	Counter	Number of entities created
entity_updated_total	Counter	Number of entities updated
metadata_packages_imported_total	Counter	Metadata packages imported
discovery_run_duration_seconds	Histogram	Discovery worker duration
scrape_error_total	Counter	Number of scrape errors
cache_hit_ratio	Gauge	Region cache hit ratio

Exposed at /metrics endpoint.

9. Admin Actions & Audit Logging
Admins can list, edit, merge, toggle active/inactive, trigger discovery or metadata refresh

All admin actions logged in admin_audit_log

Merge endpoint supports dry-run mode

10. Docker & Healthcheck
Multi-stage Dockerfile: Dockerfile.prod

Non-root user

Health endpoint: /healthz

HEALTHCHECK instruction included

Environment variables documented in .env.example

11. Security & Secret Management
All write routes require API key + JWT auth

Metadata ingestion restricted to internal roles

Scraper respects robots.txt and rate limits

.env excluded from repo

No hardcoded secrets

Secret scan performed before delivery


