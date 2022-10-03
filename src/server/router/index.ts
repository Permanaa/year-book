// src/server/router/index.ts
import { createRouter } from "./context";
import superjson from "superjson";

import { exampleRouter } from "./example";
import { protectedExampleRouter } from "./protected-example-router";
import { alumniRouter } from "./alumni";
import { majorRouter } from "./major";
import { classRouter } from "./class";

export const appRouter = createRouter()
  .transformer(superjson)
  .merge("example.", exampleRouter)
  .merge("auth.", protectedExampleRouter)
  .merge("alumni.", alumniRouter)
  .merge("major.", majorRouter)
  .merge("class.", classRouter);

// export type definition of API
export type AppRouter = typeof appRouter;
