import Link from "next/link";

type LeadFormProps = {
  title: string;
  href: string;
}

const LeadForm: React.FC<LeadFormProps> = ({ href, title }) => {
  return (
    <div className="flex justify-between items-center bg-slate-100 rounded-lg p-6 gap-4">
      <h5 className="text-2xl font-bold text-slate-700">{title}</h5>
      <Link href={href} passHref>
        <a>
          <button className="btn">Isi form</button>
        </a>
      </Link>
    </div>
  );
};

export default LeadForm;
