import { createRouteHandler } from "uploadthing/next";

import { ourFileRouter } from "./core";

// Export routes for Next App Router, POST is keyword
// eslint-disable-next-line @typescript-eslint/naming-convention
export const { POST } = createRouteHandler({
  router: ourFileRouter,
});
