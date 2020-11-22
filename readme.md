psql postgres
CREATE extension IF NOT EXISTS "uuid-ossp";

// check if installed
SELECT * FROM pg_available_extensions;



ts-node ./node_modules/typeorm/cli.js migration:run