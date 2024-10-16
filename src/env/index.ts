import 'dotenv/config'
import { z } from 'zod'

// 1. Create validation schema with zod
// 2. Validate the environment variables with safeParse
// 3. Throw an error if they are invalid
// 4. Exports the environment variables if they are valid

const envSchema = z.object({
  NODE_ENV: z.enum(['dev', 'test', 'production']).default('dev'),
  JWT_SECRET: z.string(),
  PORT: z.coerce.number().default(3333),
})

const _env = envSchema.safeParse(process.env)

if (_env.success === false) {
  console.error('⚠️ Invalid environment variables!', _env.error.format())

  throw new Error('Invalid environment variables!')
}

export const env = _env.data
