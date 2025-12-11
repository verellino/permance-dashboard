# Observability & Monitoring

- Logging: rely on Next.js/Vercel logs; extend with structured logs in API routes.
- Metrics: plan to integrate OpenTelemetry/Next Monitor for request + DB timings.
- Alerts: configure provider alerts for 5xx rate and auth failures.
- Audit logs: persisted in Mongo; consider shipping to external SIEM for retention.
- Health: `pingMongo()` helper can back a `/health` endpoint.

