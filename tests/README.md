# HTML Tests for Hugo Photo Album (Playwright)

## Prerequisites

- Install Playwright and its test runner:
  ```
  npm install --save-dev @playwright/test
  npx playwright install
  ```

## Running the Tests

1. **Build your Hugo site** so the `public/` directory is up-to-date:
   ```
   hugo
   ```
2. **Run the tests from the project root:**
   ```
   npx playwright test tests/html.spec.ts
   ```

### Alternatively: Run the tests via Docker

1. **Build the Docker image** (if not already built):
   ```
   docker build -t my-playwright .
   ```
2. **Run the tests:**
   ```
   ./run-tests-docker
   ```

## Customizing

- Edit `tests/html.spec.ts` to match the album names, images, key texts, and other test data.
