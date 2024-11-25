"use client";

import { useEffect, useState } from 'react';
import { MedalIcon } from 'lucide-react';
import { DefaultLayout } from '@/components/app/DefaultLayout';
import { Person } from '../entities/Person';
import DisplayPerson from '@/components/persons/DisplayPerson';
import { PersonIcon } from '@radix-ui/react-icons';


const Popular = () => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchPopular = async () => {
            try {

                const response = await fetch(`https://api.themoviedb.org/3/trending/person/week`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_API_TOKEN}`,
                        'Accept': 'application/json',
                    },
                });

                if (!response.ok) {
                    throw new Error(`Erreur ${response.status}: ${response.statusText}`);
                }

                const data = await response.json();
                
                const persons: Person[] = [];
                data.results.forEach((person: Person) => {
                    if (person.profile_path === null) {
                        return;
                    }
                    persons.push(person);
                }
                );
                setPersons(persons);

            } catch (error) {
                console.error("Erreur lors de la récupération des films:", error);
                setError("An error occured when retrieving people.");
            }
        };

        fetchPopular();

    }, []);

    return (
        <DefaultLayout>
            <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
                {/* Discover Title with Icon */}
                <div className="flex justify-center space-x-2 w-full">
                    <MedalIcon className="h-8 w-8 xl:h-12 xl-w-12" />
                    <h1 className="text-3xl lg:text-4xl font-bold text-center">Popular</h1>
                </div>

                <div className="flex items-center space-x-2 mb-2">
                    <PersonIcon className="h-6 w-6 xl:h-10 xl-w-10" />
                    <h2 className="text-2xl font-semibold xl:text-3xl">Persons</h2>
                </div>
                {error ? (
                    <p className="text-red-500 text-center">{error}</p>
                ) : (
                    <div className="flex flex-wrap justify-center gap-4">
                        {persons.map((person) => (
                            <DisplayPerson key={person.id} person={person} />
                        ))}
                    </div>
                )}
            </div>
        </DefaultLayout>
    );
};

export default Popular;