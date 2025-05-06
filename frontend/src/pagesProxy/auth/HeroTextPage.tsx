import React from 'react';

interface HeroTextPageProps {
    topic: string;
    description: string;
    children?: React.ReactNode;
}

function HeroTextPage(props: HeroTextPageProps) {
    return (
        <div className={`flex flex-col items-center justify-center h-screen bg-background`}>
            <div className={`max-w-md mx-auto p-6 bg-background shadow-md rounded-md`}>
                <h3 className="text-2xl font-bold text-center mb-4">{props.topic}</h3>
                <p className="text-center text-gray-600">{props.description}</p>
                <div className={`mt-4 flex flex-col items-center`}>
                    {props.children}
                </div>
            </div>
        </div>
    );
}

export default HeroTextPage;