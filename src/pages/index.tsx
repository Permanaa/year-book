import type { NextPage } from "next";
import Head from "next/head";
import { trpc } from "@utils/trpc";
import superjson from "superjson";
import { createContextInner } from "@server/router/context";
import { createSSGHelpers } from "@trpc/react/ssg";
import { appRouter } from "@server/router";
import ListBox from "@components/ListBox";
import LeadForm from "@components/LeadForm";

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
            {/* <span className="text-red-500">
              SMK Telkom Purwokerto
            </span> */}
          </h1>
        </div>

        <div>
          <div className="px-4 max-w-5xl mx-auto grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">

            {/* need to be removed when using SSG (on research) */}
            {isLoading && new Array(3).fill("").map((_, idx) => (
              <div key={idx} className="animate-pulse flex-1 space-y-4 p-4 h-28 rounded-lg bg-slate-100">
                <div className="h-4 bg-slate-300 rounded"></div>
                <div className="h-2 w-7/12 bg-slate-300 rounded"></div>
                <div className="h-2 w-7/12 bg-slate-300 rounded"></div>
              </div>
            ))}

            {(!isLoading && !!data?.length) && data.map(item => (
              <ListBox
                key={item.id}
                title={`Alumni ${item.generation}`}
                subtitle={`${item.school_year} - ${item.graduation_year}`}
                href={`/${item.slug}`}
              />
            ))}

          </div>
          {(!isLoading && !data?.length) && (
            <div className="flex justify-center items-center">
              <p className="text-slate-500 text-4xl font-bold">404</p>
            </div>
          )}
        </div>

        <footer className="max-w-5xl mx-auto mt-24 p-4">
          <LeadForm href="/form/alumni" title="Alumni mu belum tertera?" />
        </footer>
      </main>
    </>
  );
};

export async function getStaticProps () {
  const ssg = createSSGHelpers({
    router: appRouter,
    ctx: await createContextInner(),
    transformer: superjson,
  });

  await ssg.fetchQuery("alumni.getAll");

  return {
    props: {
      trpcState: ssg.dehydrate(),
    },
    revalidate: 1,
  };
}

export default Home;
