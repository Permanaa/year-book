import type { NextPage } from "next";
import Head from "next/head";
import Header from "@components/Header";
import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import Link from "next/link";

const ClassList: NextPage = () => {
  const router = useRouter();
  const { alumni } = router.query;

  const alumniTitle = `${alumni?.toString().charAt(0).toUpperCase()}${alumni?.toString().slice(1).replace("-", " ")}`;

  const { data: dataMajor, isLoading: loadingMajor } = trpc.useQuery([
    "major.getAllByAlumni",
    { alumni: alumni ? alumni?.toString() : "" }
  ]);

  return (
    <>
      <Head>
        <title>{alumni && alumniTitle}</title>
      </Head>

      <main>
        <Header />

        <div className="flex justify-center text-center max-w-xs mx-auto my-40 h-3/4 md:my-48 md:max-w-5xl relative">
          <h1 className="flex flex-col gap-4 text-5xl font-bold text-slate-700 md:text-7xl relative">
            {alumni && alumniTitle}
          </h1>
        </div>

        <div className="max-w-5xl mx-auto px-4">
          <Tab.Group>
            <Tab.List className="grid grid-cols-3 my-12 gap-4 bg-red-500 max-w-md mx-auto p-1 h-12 rounded-xl relative md:mb-24">

              {loadingMajor && new Array(3).fill("").map((_, idx) => (
                <div key={idx} className="animate-pulse h-full flex-1 flex justify-center items-center">
                  <div className="animation-pulse h-4 bg-slate-300 rounded w-10"></div>
                </div>
              ))}

              {(!loadingMajor && dataMajor) && dataMajor.map((major, idx) => (
                <Tab as={Fragment} key={idx}>
                  {({ selected }) => (
                    <button
                      className={
                        selected
                          ? "bg-white text-slate-500 rounded-lg font-bold focus:outline-none"
                          : "text-white font-bold"
                      }
                    >
                      {major.short_name}
                    </button>
                  )}
                </Tab>
              ))}

            </Tab.List>

            <Tab.Panels>

              {loadingMajor && (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {new Array(3).fill("").map((_, idx) => (
                    <div key={idx} className="animate-pulse flex-1 space-y-4 p-4 h-28 rounded-lg bg-slate-100">
                      <div className="h-4 bg-slate-300 rounded"></div>
                      <div className="h-2 w-7/12 bg-slate-300 rounded"></div>
                      <div className="h-2 w-7/12 bg-slate-300 rounded"></div>
                    </div>
                  ))}
                </div>
              )}

              {(!loadingMajor && dataMajor) && dataMajor.map((major, idx) => (
                <Tab.Panel key={idx} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {major.class.map((classroom, keyClass) => (
                    <Link href={`/${classroom.slug}`} passHref key={keyClass}>
                      <a>
                        <div className="relative flex-1 p-4 h-28 rounded-lg bg-slate-100 cursor-pointer hover:bg-red-50">
                          <p className="text-2xl font-bold text-slate-700">
                            {classroom.name}
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
                </Tab.Panel>
              ))}

            </Tab.Panels>
          </Tab.Group>
        </div>

      </main>
    </>
  );
};

export default ClassList;
