import { createRouter } from "./context";

export const alumniRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const res = await ctx.prisma.alumni.findMany({
        orderBy: {
          generation: "desc"
        }
      });
      return res;
    }
  });
