import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

function Container(props:ContainerProps) : React.ReactNode {
    return (
        <div className={`w-full flex justify-center items-center min-h-screen bg-background`}>
            <div className={`w-3/4 px-4 sm:px-6 lg:px-8 text-foreground ${props.className}`}>
                {props.children}
            </div>
        </div>
    );
}

export default Container;