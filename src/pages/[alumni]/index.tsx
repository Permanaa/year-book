import type { NextPage } from "next";
import Head from "next/head";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "@server/db/client";
import ListBox from "@components/ListBox";

const ClassList: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props,
) => {
  const { alumni, data: dataMajor } = props;

  const alumniTitle = `${alumni.charAt(0).toUpperCase()}${alumni.slice(1).replace("-", " ")}`;

  return (
    <>
      <Head>
        <title>{alumni && alumniTitle}</title>
      </Head>

      <main className="pb-8">

        <div className="flex justify-center text-center max-w-xs mx-auto my-40 h-3/4 md:my-48 md:max-w-5xl relative">
          <h1 className="flex flex-col gap-4 text-5xl font-bold text-slate-700 md:text-7xl relative">
            {alumni && alumniTitle}
          </h1>
        </div>

        <div className="max-w-5xl mx-auto px-4">
          <Tab.Group>

            <Tab.List className="grid grid-cols-3 my-12 gap-4 bg-red-500 max-w-md mx-auto p-1 h-12 rounded-xl relative">
              {dataMajor && dataMajor.map((major, idx) => (
                <Tab as={Fragment} key={idx}>
                  {({ selected }) => (
                    <button
                      className={
                        selected
                          ? "bg-white text-slate-600 rounded-lg font-bold focus:outline-none"
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
              {dataMajor && dataMajor.map((major, idx) => (
                <Tab.Panel key={idx} className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
                  {major.class.map(classroom => (
                    <ListBox
                      key={classroom.id}
                      title={classroom.name}
                      href={`/${classroom.slug}`}
                    />
                  ))}
                </Tab.Panel>
              ))}
            </Tab.Panels>

          </Tab.Group>

          {!dataMajor && (
            <div className="flex justify-center items-center">
              <p className="text-slate-500 text-4xl font-bold">404</p>
            </div>
          )}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ alumni: string }>,
) => {
  const alumni = context.params?.alumni || "";
  const majorList = await prisma.major.findMany({
    orderBy: {
      short_name: "desc"
    },
    include:{
      class: {
        where: {
          slug: {
            contains: alumni
          }
        }
      }
    },
  });

  return {
    props: {
      data: majorList,
      alumni,
    }
  };
};

export default ClassList;
