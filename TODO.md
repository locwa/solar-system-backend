# TODO: Fix TypeScript Type Errors

- [ ] Change `const express = require('express');` to `import express from 'express';` in server.ts
- [ ] Change `const express = require('express');` to `import express from 'express';` in routes/authRoutes.ts
- [ ] Remove duplicate `const sessionAuth = require('../middleware/sessionAuth');` in routes/authRoutes.ts
- [ ] Add type imports and annotations in controllers/authController.ts
- [ ] Add type imports and annotations in middleware/sessionAuth.ts
- [ ] Add type imports and annotations in middleware/roleAuth.ts
- [ ] Add type imports and annotations in routes/authRoutes.ts
- [ ] Run `npx tsc --noEmit` to verify errors are resolved
- [ ] Run `npx ts-node server.ts` to test runtime behavior
