import type { NextPage } from "next";
import Head from "next/head";
import Header from "@components/Header";

const Home: NextPage = () => {
  return (
    <>
      <Head>
        <title>Year Book</title>
        <meta name="description" content="Year book alumni dari SMK Telkom Purwokerto" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main>
        <Header />
        <div className="flex justify-center text-center max-w-xs mx-auto mt-28 md:mt-36 md:max-w-md">
          <h1 className="flex flex-col gap-4 text-5xl font-bold text-slate-700 md:text-6xl">
            Alumni <br />
            <span className="text-red-500">
              SMK Telkom Purwokerto
            </span>
          </h1>
        </div>
      </main>
    </>
  );
};

export default Home;
