import { ShowRepository } from "@/repository/ShowRepository";
import { useQuery } from "react-query";

export const useShow = (type: string) => {
    const repository = new ShowRepository();

    const fetchShows = async () => {
        switch (type) {
            case "popular":
                return await repository.fetchPopular();
            case "on-the-air":
                return await repository.fetchOnTheAir();
            case "top-rated":
                return await repository.fetchTopRated();
            default:
                throw new Error("Invalid type");
        }
    };

    const { data, error, isLoading } = useQuery(["shows", type], fetchShows);

    return {
        shows: data?.shows || [],
        error: error ? "An error occurred while fetching the data." : null,
        isLoading,
    };
};
