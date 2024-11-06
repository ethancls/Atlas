import React from 'react';
import Sidebar from '@/components/sidebar';

const Page: React.FC = () => {
    return (
        <div>
            <Sidebar />
            <div>
                {/* Other content goes here */}
            </div>
        </div>
    );
};

export default Page;