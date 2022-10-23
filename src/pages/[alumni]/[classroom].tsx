import { NextPage } from "next";
import Head from "next/head";
import ImageWithFallback from "@components/ImageWithFallback";
import type { Student } from "@prisma/client";
import { Dialog, Transition } from "@headlessui/react";
import { useDisclosure } from "@utils/useDisclosure";
import { Fragment, useRef } from "react";
import moment from "moment";
import { GetServerSidePropsContext, InferGetServerSidePropsType } from "next";
import { prisma } from "@server/db/client";
import { serialize } from "superjson";
import LeadForm from "@components/LeadForm";

const StudentItem = (props: Student) => {
  const {
    date_of_birth,
    place_of_birth,
    name,
    image,
    words,
    address,
    instagram,
    whatsapp,
  } = props;

  const { isOpen, onOpen, onClose } = useDisclosure();
  const closeRef = useRef(null);

  const birthDate = date_of_birth
    ? moment(date_of_birth).format("DD MMMM YYYY")
    : "";

  const infoDisplay = [
    { value: name, label: "Nama" },
    { value: place_of_birth, label: "Tempat Lahir" },
    { value: birthDate, label: "Tanggal Lahir" },
    { value: address, label: "Alamat" },
  ];

  const contacts = [
    { label: "WA", value: whatsapp },
    { label: "IG", value: instagram },
  ];

  return (
    <>
      <div
        onClick={onOpen}
        className="flex-1 flex flex-col items-center space-y-2 cursor-pointer"
      >
        <div className="w-4/5 rounded-lg aspect-[3/4]">
          <ImageWithFallback
            width={245}
            height={320}
            quality={100}
            objectFit="cover"
            src={image || ""}
            alt={name}
            fallbackSrc="/images/no-image.jpg"
            className="rounded-lg"
          />
        </div>
        <div className="text-center">
          <p className="text-slate-600 font-bold">
            {name}
          </p>
          <p className="text-slate-500">
            {words}
          </p>
        </div>
      </div>

      <Transition show={isOpen} as={Fragment}>
        <Dialog
          onClose={onClose}
          initialFocus={closeRef}
          className="relative z-50"
        >
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-200"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 backdrop-blur-sm" aria-hidden="true" />
          </Transition.Child>

          <div className="fixed inset-0">
            <div className="flex h-full items-center justify-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-200"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-100"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="overflow-y-auto h-full w-full sm:rounded-lg bg-white p-4 sm:h-auto sm:max-w-xl sm:w-full sm:m-4">

                  <Dialog.Title className="relative">
                    <div
                      onClick={onClose}
                      ref={closeRef}
                      className="bg-slate-200 rounded-lg p-2 cursor-pointer text-slate-600 fixed right-4 top-4 sm:absolute sm:right-0 sm:top-0 z-10"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                  </Dialog.Title>

                  <div className="grid grid-col-1 gap-4 sm:grid-cols-9 sm:gap-4">
                    <div className="col-span-4">
                      <ImageWithFallback
                        key={props.id}
                        width={245}
                        height={320}
                        quality={100}
                        objectFit="cover"
                        src={image || ""}
                        alt={name}
                        fallbackSrc="/images/no-image.jpg"
                        className="rounded-lg"
                      />
                    </div>
                    <div className="flex flex-col w-full col-span-5">
                      {infoDisplay.map((info, idx) => (
                        <div key={idx} className="mb-4">
                          <p className="text-slate-700 font-bold text-sm">{info.label}</p>
                          <p className="text-slate-500 text-base">{info?.value || "-"}</p>
                        </div>
                      ))}

                      <div className="mb-4">
                        <p className="text-slate-700 font-bold text-sm mb-2">Kontak</p>
                        {contacts.map((contact, idx) => (
                          <div key={idx} className="grid grid-cols-7">
                            <p className="text-slate-500 text-base font-medium col-span-1">{contact.label || "-"}</p>
                            <p className="text-slate-500 text-base col-span-6">{contact.value || "-"}</p>
                          </div>
                        ))}
                      </div>

                      {words && (
                        <div className="flex justify-center items-center w-full my-4">
                          <p className="text-slate-500 text-base text-center">
                            {`"${words}"`}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};

const StudentList: NextPage<InferGetServerSidePropsType<typeof getServerSideProps>> = (
  props
) => {
  const { data } = props;

  return (
    <>
      <Head>
        <title>{data?.name}</title>
        <meta name="description" content="Year book alumni dari SMK Telkom Purwokerto" />
      </Head>

      <main className="pb-8">
        <div className="flex justify-center text-center max-w-xs mx-auto my-40 h-3/4 md:my-48 md:max-w-5xl">
          <h1 className="flex flex-col gap-4 text-5xl font-bold text-slate-700 md:text-7xl">
            {data?.name}
          </h1>
        </div>

        <div className="relative px-4 max-w-5xl mx-auto grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {!!data && data.student.map((item) => (
            <StudentItem {...item} key={item.id}/>
          ))}
        </div>
        {!data?.student.length && (
          <div className="flex justify-center items-center">
            <p className="text-slate-500 text-4xl font-bold">404</p>
          </div>
        )}

        <footer className="max-w-5xl mx-auto mt-24 p-4">
          <LeadForm href="/form/mantan" title="Bantu kami melengkapi data alumni." />
        </footer>
      </main>
    </>
  );
};

export const getServerSideProps = async (
  context: GetServerSidePropsContext<{ alumni: string, classroom: string }>,
) => {
  const alumni = context.params?.alumni || "";
  const classroom = context.params?.classroom || "";

  const slug =`${alumni}/${classroom}`;

  const studentList = await prisma.class.findUnique({
    where: {
      slug,
    },
    include: {
      student: {
        orderBy: {
          name: "asc"
        },
        where: {
          status: "PUBLISHED"
        }
      }
    }
  });

  const { json } = serialize(studentList);

  return {
    props: {
      data: json as typeof studentList,
      alumni,
      classroom,
      slug,
    }
  };
};

export default StudentList;
