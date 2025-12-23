BEGIN;

CREATE TYPE project_status AS ENUM ('active', 'archived', 'completed');

CREATE TABLE projects (
  id UUID PRIMARY KEY,
  tenant_id UUID NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  status project_status NOT NULL DEFAULT 'active',
  created_by UUID NOT NULL,
  created_at TIMESTAMP NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMP NOT NULL DEFAULT NOW(),
  CONSTRAINT fk_projects_tenant
    FOREIGN KEY (tenant_id)
    REFERENCES tenants(id)
    ON DELETE CASCADE,
  CONSTRAINT fk_projects_creator
    FOREIGN KEY (created_by)
    REFERENCES users(id)
    ON DELETE SET NULL
);

CREATE INDEX idx_projects_tenant_id ON projects(tenant_id);

COMMIT;
