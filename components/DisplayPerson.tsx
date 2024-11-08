import React, { useEffect, useState } from "react";
import Image from "next/image";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Person } from "@/app/entities/Person";
import { useRouter } from "next/navigation";

interface DisplaypersonProps {
  person: Person;
}

const Displayperson: React.FC<DisplaypersonProps> = ({ person }) => {
  const router = useRouter();

  const handleClick=()=>{
    router.push(`/persons/${person.id}`);
  }

  return (
    <div onClick={handleClick}>
    <Card className="w-20 min-w-[140px] md:w-30 md:min-w-[160px] lg:w-40 lg:min-w-[180px] xl:w-50 xl:min-w-[200px] 2xl:w-60  2xl:min-w-[220px] flex-shrink-0 shadow-lg rounded-lg bg-gradient-to-bl from-pink-200 to-blue-200 hover:shadow-xl hover:scale-105 transition-transform duration-300 hover">
      <CardHeader className="p-1">
          <Image
          src={`https://image.tmdb.org/t/p/w500${person.profile_path}`}
          alt={person.name}
          width={180}
          height={260}
          quality={100}
          className="w-full h-full top-0 left-0 object-cover rounded-lg"
        />
      </CardHeader>
      <CardContent className="p-2">
        <h2 className="text-sm font-bold text-left truncate">{person.name}</h2>
        <div className="flex items-center justify-between">
          <p className="text-xs text-gray-500">
            {person.known_for_department}
          </p>
          <p className="text-sm text-violet-500">
            ★ {person.popularity.toFixed(1)}
          </p>
        </div>
      </CardContent>
    </Card>
    </div>
  );
};

export default Displayperson;