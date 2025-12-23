BEGIN;

CREATE TABLE audit_logs (
  id UUID PRIMARY KEY,
  tenant_id UUID NULL,
  user_id UUID NULL,
  action VARCHAR(100) NOT NULL,
  entity_type VARCHAR(50),
  entity_id UUID,
  ip_address VARCHAR(50),
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_audit_logs_tenant
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE SET NULL,
  CONSTRAINT fk_audit_logs_user
    FOREIGN KEY (user_id)
    REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE INDEX idx_audit_logs_tenant_id ON audit_logs(tenant_id);
CREATE INDEX idx_audit_logs_user_id ON audit_logs(user_id);

COMMIT;
