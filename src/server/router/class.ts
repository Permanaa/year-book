import { z } from "zod";
import { createRouter } from "./context";

export const classRouter = createRouter()
  .query("getBySlug", {
    input: z.object({
      slug: z.string()
    }),
    resolve: async ({ ctx, input }) => {
      const res = await ctx.prisma.class.findUnique({
        where: {
          slug: input.slug,
        },
        include: {
          student: {
            orderBy: {
              name: "asc"
            }
          }
        }
      });
      return res;
    },
  });
