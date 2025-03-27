import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

function Container(props:ContainerProps) : React.ReactNode {
    return (
        <div className={`w-full px-4 sm:px-6 lg:px-8 bg-background text-foreground justify-center ${props.className}`}>
            {props.children}
        </div>
    );
}

export default Container;