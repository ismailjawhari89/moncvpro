import { defineConfig } from 'prisma'

export default defineConfig({
    datasource: {
        url: process.env.DATABASE_URL
    },
    // For production/acceleration if needed
    // accelerateUrl: process.env.PRISMA_ACCELERATE_URL
})
