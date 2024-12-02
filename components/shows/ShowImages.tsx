
import React from 'react';
import Image from 'next/image';
import { ImageData } from '@/app/entities/ImageData';

const ShowImages = ({ images }: {images : ImageData[]}) => {
    return (
        <>
            {/* Images */}
            <div className="p-6 lg:p-12">
                <h2 className="text-xl font-semibold mb-4">Images</h2>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {images.filter(image => image.type === "backdrop").map((image) => (
                        <div
                            key={image.file_path}
                            className="flex-shrink-0 w-[300px] cursor-pointer"
                            onClick={() => {
                                const modal = document.createElement("div");
                                modal.className =
                                    "fixed inset-0 z-50 flex items-center justify-center bg-black/80";
                                modal.onclick = () => modal.remove();

                                const img = document.createElement("img");
                                img.src = `https://image.tmdb.org/t/p/original${image.file_path}`;
                                img.className =
                                    "max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg";

                                modal.appendChild(img);
                                document.body.appendChild(modal);
                            }}
                        >
                            <Image
                                src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                                alt="Movie backdrop"
                                width={300}
                                height={200}
                                quality={100}
                                className="rounded-lg shadow-md hover:opacity-80"
                            />
                        </div>
                    ))}
                </div>
            </div>

            {/* Posters */}
            <div className="p-6 lg:p-12">
                <h2 className="text-xl font-semibold mb-4">Posters</h2>
                <div className="flex gap-4 overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                    {images.filter(image => image.type === "poster").map((image) => (
                        <div
                            key={image.file_path}
                            className="flex-shrink-0 w-[150px] cursor-pointer hover:opacity-80"
                            onClick={() => {
                                const modal = document.createElement("div");
                                modal.className =
                                    "fixed inset-0 z-50 flex items-center justify-center bg-black/80";
                                modal.onclick = () => modal.remove();

                                const img = document.createElement("img");
                                img.src = `https://image.tmdb.org/t/p/original${image.file_path}`;
                                img.className =
                                    "max-h-[80vh] max-w-[80vw] object-contain rounded-lg shadow-lg";

                                modal.appendChild(img);
                                document.body.appendChild(modal);
                            }}
                        >
                            <Image
                                src={`https://image.tmdb.org/t/p/original${image.file_path}`}
                                alt="Movie poster"
                                width={150}
                                height={200}
                                quality={100}
                                className="rounded-lg shadow-md"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </>
    );
};

export default ShowImages;