import Link from "next/link";
import { useSession, signIn, signOut } from "next-auth/react"
import Image from "next/image";
import { Menu, Transition } from "@headlessui/react";
import { Fragment } from "react";

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

const Header = () => {
  const { data: session } = useSession();
  return (
    <header className="sticky top-0 bg-white z-10">
      <div className="py-4 px-4 max-w-5xl mx-auto">
        <div className="flex items-center justify-between">
          <Link href="/" passHref>
            <a>
              <div className="flex">
                <div className="w-4 h-7 bg-red-500 rounded-sm mr-1" />
                <p className="text-2xl font-bold text-slate-700">YB</p>
              </div>
            </a>
          </Link>
          <div>
            {session ? (
               <Menu as="div" className="relative inline-block text-left">
                <div>
                  <Menu.Button className="py-1 pl-1 pr-1 sm:pl-5 inline-flex w-full justify-center items-center gap-3 rounded-full bg-white hover:bg-red-50 focus:outline-none focus:ring-2 focus:ring-red-300">
                    <p className="text-md font-medium hidden sm:block text-slate-600">
                      {session.user?.name}
                    </p>
                    {session.user?.image && (
                      <Image
                        width={40}
                        height={40}
                        src={session.user?.image}
                        alt={session.user?.name || "user photo"}
                        className="rounded-full"
                      />
                    )}
                  </Menu.Button>
                </div>
          
                <Transition
                  as={Fragment}
                  enter="transition ease-out duration-100"
                  enterFrom="transform opacity-0 scale-95"
                  enterTo="transform opacity-100 scale-100"
                  leave="transition ease-in duration-75"
                  leaveFrom="transform opacity-100 scale-100"
                  leaveTo="transform opacity-0 scale-95"
                >
                  <Menu.Items className="absolute right-0 z-10 mt-2 w-56 origin-top-right rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none">
                    <div className="py-1">
                      <Menu.Item>
                        {({ active }) => (
                          <button
                            onClick={() => signOut()}
                            className={classNames(
                              active ? 'bg-red-50 text-slate-600' : 'text-slate-500',
                              'block w-full px-4 py-2 text-left text-sm'
                            )}
                          >
                            Sign out
                          </button>
                        )}
                      </Menu.Item>
                    </div>
                  </Menu.Items>
                </Transition>
              </Menu>
            ) : (
              <button className="btn" onClick={() => signIn()}>
                Masuk
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;
