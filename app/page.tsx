import React from 'react';
import { redirect } from 'next/navigation';

const Page: React.FC = () => {
    redirect("/discover")
};

export default Page;