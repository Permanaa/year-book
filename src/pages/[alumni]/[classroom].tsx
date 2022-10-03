import { NextPage } from "next";
import Head from "next/head";
import { useRouter } from "next/router";
import { trpc } from "@utils/trpc";
import ImageWithFallback from "@components/ImageWithFallback";
import type { Student } from "@prisma/client";
import { Dialog, Transition } from "@headlessui/react";
import { useDisclosure } from "@utils/useDisclosure";
import { Fragment, useRef } from "react";
import moment from "moment";

const PhoneIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M2 3.5A1.5 1.5 0 013.5 2h1.148a1.5 1.5 0 011.465 1.175l.716 3.223a1.5 1.5 0 01-1.052 1.767l-.933.267c-.41.117-.643.555-.48.95a11.542 11.542 0 006.254 6.254c.395.163.833-.07.95-.48l.267-.933a1.5 1.5 0 011.767-1.052l3.223.716A1.5 1.5 0 0118 15.352V16.5a1.5 1.5 0 01-1.5 1.5H15c-1.149 0-2.263-.15-3.326-.43A13.022 13.022 0 012.43 8.326 13.019 13.019 0 012 5V3.5z" clipRule="evenodd" />
  </svg>
);

const AtIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5">
    <path fillRule="evenodd" d="M5.404 14.596A6.5 6.5 0 1116.5 10a1.25 1.25 0 01-2.5 0 4 4 0 10-.571 2.06A2.75 2.75 0 0018 10a8 8 0 10-2.343 5.657.75.75 0 00-1.06-1.06 6.5 6.5 0 01-9.193 0zM10 7.5a2.5 2.5 0 100 5 2.5 2.5 0 000-5z" clipRule="evenodd" />
  </svg>
)

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

  console.log(place_of_birth)

  const infoDisplay = [
    { value: name, label: "Nama" },
    { value: place_of_birth, label: "Tempat Lahir" },
    { value: birthDate, label: "Tanggal Lahir" },
    { value: address, label: "Alamat" },
  ];

  const contacts = [
    { icon: <PhoneIcon />, value: whatsapp },
    { icon: <AtIcon />, value: instagram },
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
                <Dialog.Panel className="overflow-y-auto h-full w-full sm:rounded-lg bg-white p-4 sm:h-auto sm:max-w-2xl sm:w-full sm:m-4">

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

                  <div className="grid grid-col-1 sm:grid-cols-3 gap-4">
                    <div>
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
                    <div className="flex flex-col w-full col-span-2">
                      {infoDisplay.map((info, idx) => (
                        <div key={idx} className="mb-4">
                          <p className="text-slate-700 font-bold text-sm">{info.label}</p>
                          <p className="text-slate-500 text-base">{info?.value || "-"}</p>
                        </div>
                      ))}

                      <div className="mb-4">
                        <p className="text-slate-700 font-bold text-sm mb-2">Kontak</p>
                        {contacts.map((contact, idx) => (
                          <div key={idx} className="flex items-center gap-2 text-slate-500 mb-1">
                            {contact.icon}
                            <p className="text-slate-500 text-base">{contact?.value || "-"}</p>
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

const StudentList: NextPage = () => {
  const router = useRouter();

  const { data, isLoading } = trpc.useQuery([
    "class.getBySlug",
    { slug: router.asPath.slice(1) }
  ]);

  return (
    <>
      <Head>
        <title>{data?.name}</title>
      </Head>

      <main className="pb-8">
        <div className="flex justify-center text-center max-w-xs mx-auto my-40 h-3/4 md:my-48 md:max-w-5xl">
          {isLoading && (
            <div className="animation-pulse h-8 w-2/3 sm:w-1/2 bg-slate-300 rounded"></div>
          )}
          {(!isLoading && data) && (
            <h1 className="flex flex-col gap-4 text-5xl font-bold text-slate-700 md:text-7xl">
              {data?.name}
            </h1>
          )}
        </div>

        <div className="relative px-4 max-w-5xl mx-auto grid grid-cols-2 gap-x-4 gap-y-6 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {isLoading && new Array(5).fill("").map((_, idx) => (
            <div key={idx} className="animate-pulse flex-1 flex flex-col justify-center items-center space-y-4">
              <div className="w-4/5 bg-slate-300 rounded-lg aspect-[3/4]"></div>
              <div className="h-2 w-7/12 bg-slate-300 rounded"></div>
              <div className="h-2 w-7/12 bg-slate-300 rounded"></div>
            </div>
          ))}

          {(!isLoading && data) && data.student.map(item => (
            <StudentItem {...item} key={item.id}/>
          ))}
        </div>
      </main>
    </>
  );
};

export default StudentList;
