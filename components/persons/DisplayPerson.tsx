import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Person } from "@/app/entities/Person";
import { useRouter } from "next/navigation";

interface DisplayPersonProps {
  person: Person;
}

const DisplayPerson: React.FC<DisplayPersonProps> = ({ person }) => {
  const router = useRouter();

  const handleClick = () => {
    router.push(`/persons/${person.id}`);
  }

  return (
    person.profile_path &&
    <Card className="w-full p-1 hover:opacity-90">
      <CardHeader className="p-1 relative">
        <div onClick={handleClick} className="cursor-pointer">
          <Image
            src={`https://image.tmdb.org/t/p/original${person.profile_path}`}
            alt={person.name}
            width={500}
            height={500}
            quality={100}
            className="w-full h-full top-0 left-0 object-cover rounded-lg"
          />
        </div>

      </CardHeader>
      <div onClick={handleClick} className="cursor-pointer">
        <CardContent className="p-2">
          <h2 className="text-base font-bold text-left truncate">{person.name}</h2>
          <div className="flex items-center justify-between">
            <p className="text-sm text-gray-500">
              {person.known_for_department}
            </p>
          </div>
        </CardContent>
      </div>
    </Card >
  );
};

export default DisplayPerson;