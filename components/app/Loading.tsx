import React from 'react';

const Loading = ({ isLoading }: { isLoading: boolean }) => {
    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 dark:border-white border-black"></div>
            </div>
        );
    }

    return null;
};

export default Loading;