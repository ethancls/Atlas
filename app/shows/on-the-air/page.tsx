"use client";

import { LoaderPinwheelIcon } from 'lucide-react';
import { DefaultLayout } from '@/components/app/DefaultLayout';
import TVShowList from '@/components/shows/TVShowList';
import { useShow } from '@/app/shows/rules/useShow';
import Loading from '@/components/app/Loading';


const OnTheAir = () => {
  const { shows, error, isLoading } = useShow('on-the-air');

  <Loading isLoading={isLoading} />

  return (
    <DefaultLayout>
      <div className="min-h-screen p-6 sm:p-8 space-y-12 w-full">
        <div className="flex justify-center space-x-2 w-full">
          <LoaderPinwheelIcon className="h-8 w-8 xl:h-12 xl-w-12" />
          <h1 className="text-3xl lg:text-4xl font-bold text-center">On The Air</h1>
        </div>

        {isLoading ? (
          <Loading isLoading={true} />
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <TVShowList shows={shows} />
        )}
      </div>
    </DefaultLayout>
  );
};

export default OnTheAir;