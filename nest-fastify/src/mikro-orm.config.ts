import 'dotenv/config' // Load .env file for CLI usage

import { defineConfig } from '@mikro-orm/postgresql'
import { createMikroOrmOptions } from './infra/postgres/mikro-orm.options'

export default defineConfig(createMikroOrmOptions())
