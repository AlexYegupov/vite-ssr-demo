# Sourcemap Environment Variables

The project uses two environment variables to control sourcemaps:

1. **SOURCEMAPS_GENERATE_PROD**: Controls whether sourcemaps are generated during build
   - Default: "false"
   - When "true": Sourcemaps are generated in production builds
   - In development: Always generated regardless of this setting

2. **SOURCEMAPS_ACCESS_PROD**: Controls runtime access to sourcemap files
   - Default: "false"
   - When "true": Allows access to .map files in production
   - Implementation: Cloudflare Worker intercepts requests to .map files and returns 404 unless this is "true"

This two-variable approach provides flexibility:
- Can generate sourcemaps but block access (default)
- Can enable access temporarily for debugging without rebuilding
- Can disable generation completely to reduce bundle size
