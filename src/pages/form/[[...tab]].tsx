import type { NextPage } from "next";
import Head from "next/head";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { Tab } from "@headlessui/react";
import { Fragment } from "react";
import { getServerAuthSession } from "@server/common/get-server-auth-session";
import Link from "next/link";
import AlumniForm from "@components/Form/alumni";
import { useRouter } from "next/router";

const Form: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = () => {
  const router = useRouter();

  const tab = router.query.tab || ["alumni"];

  const selectedIndex = () => {
    switch (tab[0]) {
      case "kelas": return 1;
      case "mantan": return 2;
      case "alumni":
      default: return 0;
    }
  };

  const tabOptions = [
    { label: "Alumni", href: "/form/alumni" },
    { label: "Kelas", href: "/form/kelas" },
    { label: "Mantan", href: "/form/mantan" },
  ];

  const renderForm = () => {
    switch (tab[0]) {
      case "kelas": return <div>Kelas</div>;
      case "mantan": return <div>Mantan</div>;
      case "alumni":
      default: return <AlumniForm />;
    }
  };

  return (
    <>
      <Head>
        <title>Form</title>
        <meta name="description" content="Year book alumni dari SMK Telkom Purwokerto" />
      </Head>

      <main>
        <div className="flex justify-center text-center max-w-xs mx-auto my-40 h-3/4 md:my-48 md:max-w-5xl">
          <h1 className="flex flex-col gap-4 text-5xl font-bold text-slate-700 md:text-7xl">
            Form
          </h1>
        </div>

        <div className="max-w-5xl mx-auto p-4">
          <Tab.Group selectedIndex={selectedIndex()}>
            <Tab.List className="grid grid-cols-3 my-12 gap-4 bg-red-500 max-w-md mx-auto p-1 h-12 rounded-xl relative">
              {tabOptions.map((tab, idx) => (
                <Tab as={Fragment} key={tab.label + idx}>
                  {({ selected }) => (
                    <button
                      className={
                        selected
                          ? "bg-white text-slate-600 rounded-lg font-bold focus:outline-none flex"
                          : "text-white font-bold flex"
                      }
                    >
                      <Link href={tab.href} passHref shallow>
                        <a className="h-full w-full flex justify-center items-center">
                          {tab.label}
                        </a>
                      </Link>
                    </button>
                  )}
                </Tab>
              ))}
            </Tab.List>
          </Tab.Group>
        </div>

        <div className="max-w-5xl mx-auto p-4 mb-16">
          {renderForm()}
        </div>
      </main>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{
    tab: string[]
  }>
) => {
  const session = await getServerAuthSession({ res: context.res, req: context.req });
  const tab = context.params?.tab || [];

  if (!session) {
    return {
      redirect: {
        destination: "/api/auth/signin",
        permanent: false,
      }
    };
  }

  if (tab?.length > 1) {
    return {
      notFound: true,
    };
  }

  if (typeof tab[0] === "string" && !["alumni", "kelas", "mantan"].includes(tab[0])) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      tab,
      // session,
    }
  };
};

export default Form;
