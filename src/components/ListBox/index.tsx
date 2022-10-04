import Link from "next/link";

type ListBoxProps = {
  title: string;
  subtitle?: string;
  href: string;
}

const ListBox: React.FC<ListBoxProps> = (props) => {
  const {
    title,
    subtitle,
    href,
  } = props;
  return (
    <Link href={href} passHref>
      <a>
        <div className="relative flex-1 p-4 h-28 rounded-lg bg-red-50 cursor-pointer hover:bg-red-100">
          <p className="text-2xl font-bold text-slate-700">
            {title}
          </p>
          {!!subtitle &&(
            <p className="text-base text-slate-500">
              {subtitle}
            </p>
          )}
          <div className="absolute bottom-3 right-4">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-red-500">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </div>
        </div>
      </a>
    </Link>
  );
};

export default ListBox;