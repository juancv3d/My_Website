-- Triple-S Snow Day (2026-11-17) - one-time admin setup, run by ACCOUNTADMIN before the labs
-- Replace TSS_SNOWDAY_LAB_ROLE with the role participants will use in Snowsight.

USE ROLE ACCOUNTADMIN;

-- Warehouse used by notebooks, Dynamic Tables and the agent
CREATE WAREHOUSE IF NOT EXISTS TSS_SNOWDAY_WH
  WAREHOUSE_SIZE = XSMALL AUTO_SUSPEND = 60 AUTO_RESUME = TRUE INITIALLY_SUSPENDED = TRUE;

-- Lab database: each participant creates their own schema LAB1_<USER> / LAB2_<USER>
CREATE DATABASE IF NOT EXISTS TSS_SNOWDAY;

CREATE ROLE IF NOT EXISTS TSS_SNOWDAY_LAB_ROLE;
GRANT USAGE ON WAREHOUSE TSS_SNOWDAY_WH TO ROLE TSS_SNOWDAY_LAB_ROLE;
GRANT USAGE, CREATE SCHEMA ON DATABASE TSS_SNOWDAY TO ROLE TSS_SNOWDAY_LAB_ROLE;

-- Notebooks in Workspaces run on Container Runtime: each participant's notebook service takes ONE node.
-- Size MAX_NODES to the number of concurrent participants (about 47 for Snow Day) and check the account quota.
-- Alternative: grant USAGE on the default SYSTEM_COMPUTE_POOL_CPU instead.
CREATE COMPUTE POOL IF NOT EXISTS TSS_SNOWDAY_POOL
  MIN_NODES = 1 MAX_NODES = 50 INSTANCE_FAMILY = CPU_X64_XS
  AUTO_SUSPEND_SECS = 600 AUTO_RESUME = TRUE INITIALLY_SUSPENDED = TRUE;
GRANT USAGE ON COMPUTE POOL TSS_SNOWDAY_POOL TO ROLE TSS_SNOWDAY_LAB_ROLE;

-- Cortex AI functions, Cortex Code, Agents
GRANT DATABASE ROLE SNOWFLAKE.CORTEX_USER       TO ROLE TSS_SNOWDAY_LAB_ROLE;
GRANT DATABASE ROLE SNOWFLAKE.CORTEX_AGENT_USER TO ROLE TSS_SNOWDAY_LAB_ROLE;
GRANT DATABASE ROLE SNOWFLAKE.COPILOT_USER      TO ROLE TSS_SNOWDAY_LAB_ROLE;  -- Cortex Code in Snowsight (until BCR-2445)

-- Model access by RBAC: Dynamic Table refreshes run as the owner role, so it needs explicit model access
GRANT APPLICATION ROLE SNOWFLAKE."CORTEX-MODEL-ROLE-ALL" TO ROLE TSS_SNOWDAY_LAB_ROLE;

-- Agents and AI functions route through cross-region inference if models are not in the local region
ALTER ACCOUNT SET CORTEX_ENABLED_CROSS_REGION = 'ANY_REGION';

-- CoWork: if the account has a CoWork object, agents are visible only after being added to it.
-- Check with SHOW SNOWFLAKE INTELLIGENCES; if a row is returned, let participants add their agent (Lab 1, section 5.1)
-- GRANT USAGE  ON SNOWFLAKE INTELLIGENCE SNOWFLAKE_INTELLIGENCE_OBJECT_DEFAULT TO ROLE TSS_SNOWDAY_LAB_ROLE;
-- GRANT MODIFY ON SNOWFLAKE INTELLIGENCE SNOWFLAKE_INTELLIGENCE_OBJECT_DEFAULT TO ROLE TSS_SNOWDAY_LAB_ROLE;

-- Grant the role to every participant (repeat per user), and make it their default
-- GRANT ROLE TSS_SNOWDAY_LAB_ROLE TO USER <user>;
-- ALTER USER <user> SET DEFAULT_ROLE = TSS_SNOWDAY_LAB_ROLE DEFAULT_WAREHOUSE = TSS_SNOWDAY_WH;

-- Optional: role that is allowed to see unmasked PHI in Lab 2 (nobody needs it during the lab)
CREATE ROLE IF NOT EXISTS TSS_PHI_READER;

-- After the event:
-- DROP DATABASE IF EXISTS TSS_SNOWDAY;
-- DROP COMPUTE POOL IF EXISTS TSS_SNOWDAY_POOL;
-- DROP WAREHOUSE IF EXISTS TSS_SNOWDAY_WH;
-- DROP ROLE IF EXISTS TSS_SNOWDAY_LAB_ROLE;
-- DROP ROLE IF EXISTS TSS_PHI_READER;
