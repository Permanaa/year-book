import moment from "moment";
import { useForm, SubmitHandler } from "react-hook-form";
import { trpc } from "@utils/trpc";
import { useToast } from "@context/toast";
import { useRouter } from "next/router";

export type AlumniForm = {
  generation: number;
  school_year: number;
  graduation_year: number;
}

const AlumniForm = () => {
  const { register, handleSubmit } = useForm<AlumniForm>();

  const router = useRouter();

  const { setToast } = useToast();

  const { mutate } = trpc.useMutation("alumni.post", {
    onError: (error) => {
      setToast({
        open: true,
        message: error.message,
        variant: "error"
      });
    },
    onSuccess: () => {
      setToast({
        open: true,
        message: "Alumni berhasil diajukan. Admin akan meninjau terlebih dahulu sebelum ditampilkan",
        variant: "success",
      });
      router.push("/");
    }
  });

  const nowYear = moment().year();
  const maxAlumni = (nowYear - 3) - 1993 + 1;

  const onSubmit: SubmitHandler<AlumniForm> = async (val) => {
    const slug = `alumni-${val.generation}`;

    const payload = {
      slug,
      generation: Number(val.generation),
      graduation_year: `${val.graduation_year}`,
      school_year: `${val.school_year}`
    };

    mutate(payload);
  };

  return (
    <div className="max-w-xl mx-auto">
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label htmlFor="generation" className="block text-base font-medium text-gray-700">
            Alumni
          </label>
          <input
            required
            min={1}
            max={maxAlumni}
            type="number"
            id="generation"
            placeholder="ex: 25"
            className="input mt-1"
            {...register("generation")}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="school_year" className="block text-base font-medium text-gray-700">
            Tahun Masuk
          </label>
          <input
            required
            type="number"
            min={1993}
            max={nowYear - 3}
            id="school_year"
            placeholder="ex: 2017"
            className="input mt-1"
            {...register("school_year")}
          />
        </div>

        <div className="mt-4">
          <label htmlFor="graduation_year" className="block text-base font-medium text-gray-700">
            Tahun Kelulusan
          </label>
          <input
            required
            type="number"
            min={1996}
            max={nowYear}
            id="graduation_year"
            placeholder="ex: 2020"
            className="input mt-1"
            {...register("graduation_year")}
          />
        </div>

        <div className="flex justify-end mt-4">
          <button type="submit" className="btn">Submit</button>
        </div>
      </form>
    </div>
  );
};

export default AlumniForm;
