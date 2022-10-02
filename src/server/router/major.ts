import { z } from "zod";
import { createRouter } from "./context";

export const majorRouter = createRouter()
  .query("getAllByAlumni",{
    input: z.object({
      alumni: z.string()
    }),
    resolve: async ({ ctx, input }) => {
      const res = await ctx.prisma.major.findMany({
        orderBy: {
          short_name: "desc"
        },
        include:{
          class: {
            where: {
              slug: {
                contains: input.alumni
              }
            }
          }
        }
      });
      return res;
    },
  });
