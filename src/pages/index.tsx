import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@utils/trpc";
import Link from "next/link";
import superjson from "superjson";
import { createContextInner } from "@server/router/context";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@server/router";

const Home: NextPage = () => {
  const { data, isLoading } = trpc.useQuery(["alumni.getAll"]);

  return (
    <>
      <Head>
        <title>Year Book</title>
        <meta name="description" content="Year book alumni dari SMK Telkom Purwokerto" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className="pb-8">

        <div className="flex justify-center text-center max-w-xs mx-auto my-40 h-3/4 md:my-48 md:max-w-5xl">
          <h1 className="flex flex-col gap-4 text-5xl font-bold text-slate-700 md:text-7xl">
            Alumni<br />
            <span className="text-red-500">
              SMK Telkom Purwokerto
            </span>
          </h1>
        </div>

        <div>
          <div className="px-4 max-w-5xl mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">

            {isLoading && new Array(3).fill("").map((_, idx) => (
              <div key={idx} className="animate-pulse flex-1 space-y-4 p-4 h-28 rounded-lg bg-slate-100">
                <div className="h-4 bg-slate-300 rounded"></div>
                <div className="h-2 w-7/12 bg-slate-300 rounded"></div>
                <div className="h-2 w-7/12 bg-slate-300 rounded"></div>
              </div>
            ))}

            {(!isLoading && data) && data.map((item, idx) => (
              <Link href={`/${item.slug}`} passHref key={idx}>
                <a>
                  <div className="relative flex-1 p-4 h-28 rounded-lg bg-slate-100 cursor-pointer hover:bg-red-50">
                    <p className="text-2xl font-bold text-slate-700">
                      {`Alumni ${item.generation}`}
                    </p>
                    <p className="text-base text-slate-500">
                      {`${item.school_year} - ${item.graduation_year}`}
                    </p>
                    <div className="absolute bottom-3 right-4">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-slate-400 hover:text-red-500">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
                      </svg>
                    </div>
                  </div>
                </a>
              </Link>
            ))}

          </div>
        </div>
      </main>
    </>
  );
};

export async function getServerSideProps() {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer: superjson,
  });

  await ssg.prefetchQuery("alumni.getAll");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    }
  }
}

export default Home;
