import { Person } from "@/app/entities/Person";
import DisplayPerson from "@/components/persons/DisplayPerson";

const PersonList = ({ persons }: { persons: Person[] }) => {
    return (
        <div className="p-6 lg:p-12">
            <h2 className="text-2xl font-semibold mb-4">Persons</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-6">
                {persons.map((person) => (
                    <DisplayPerson key={person.id} person={person} />
                ))}
            </div>
        </div>
    );
};

export default PersonList;