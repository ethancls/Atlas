import { useQuery } from "react-query";
import { ShowDetailRepository } from "@/repository/ShowDetailRepository";

export function useShowDetail(id: string, apiKey: string) {
    const repository = new ShowDetailRepository(apiKey);

    const fetchShowData = async () => {
        const [showDetails, showCredits, showImages, related, showSeasons] = await Promise.all([
            repository.fetchShowDetails(id),
            repository.fetchShowCredits(id),
            repository.fetchShowImages(id),
            repository.fetchRelatedShows(id),
            repository.fetchSeasons(id),
        ]);

        const trailerData = await repository.fetchYoutubeTrailer(showDetails);


        return {
            showDetails,
            showCredits,
            showImages,
            related,
            showSeasons,
            trailerData,
        };
    };

    const { data, isLoading, error } = useQuery(['showDetail', id], fetchShowData);

    return {
        show: data?.showDetails || null,
        credits: data?.showCredits || [],
        images: data?.showImages || [],
        relatedShows: data?.related || [],
        seasons: data?.showSeasons || [],
        isLoading,
        error,
        trailerLink: data?.trailerData || null,
    };
}
