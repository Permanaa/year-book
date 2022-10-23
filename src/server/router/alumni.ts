import { TRPCError } from "@trpc/server";
import { z } from "zod";
import { createRouter } from "./context";

export const alumniRouter = createRouter()
  .query("getAll", {
    async resolve({ ctx }) {
      const res = await ctx.prisma.alumni.findMany({
        orderBy: {
          generation: "desc",
        },
        where: {
          status: "PUBLISHED"
        }
      });
      return res;
    }
  })
  .mutation("post", {
    input: z.object({
      generation: z.number(),
      school_year: z.string(),
      graduation_year: z.string(),
      slug: z.string(),
    }),
    resolve: async ({ ctx, input }) => {
      if (!ctx.session || !ctx.session.user) throw new TRPCError({
        code: "UNAUTHORIZED"
      });

      if (Number(input.graduation_year) - Number(input.school_year) !== 3) {
        throw new TRPCError({
          code: "BAD_REQUEST",
          message: "Tahun Masuk dan Tahun Kelulusan harus selisih 3 tahun"
        });
      }

      const validation = await ctx.prisma.alumni.findMany();

      const notValid = validation.some(alumni => {
        return alumni.generation === input.generation || alumni.graduation_year === input.graduation_year || alumni.school_year === input.school_year;
      });

      if (notValid) throw new TRPCError({
        code: "BAD_REQUEST",
        message: "Alumni sudah terdaftar."
      });

      await ctx.prisma.alumni.create({
        data: {
          generation: input.generation,
          graduation_year: input.graduation_year,
          school_year: input.school_year,
          slug: input.slug,
          createdBy: ctx.session.user?.id
        }
      });
    }
  });
