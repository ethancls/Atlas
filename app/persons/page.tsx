"use client";

import { useEffect, useState } from 'react';
import { DefaultLayout } from '@/components/app/DefaultLayout';
import { Person } from '../entities/Person';
import PersonList from '@/components/persons/PersonList';


const Popular = () => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {

        const fetchPopular = async () => {
            try {

                const response = await fetch(`https://api.themoviedb.org/3/trending/person/week`, {
                    headers: {
                        'Authorization': `Bearer ${process.env.NEXT_PUBLIC_TMDB_KEY}`,
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

    if (error) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <p className="text-red-500">{error}</p>
            </div>
        );
    }

    return (
        <DefaultLayout>
            <PersonList persons={persons} />
        </DefaultLayout>
    );
};

export default Popular;