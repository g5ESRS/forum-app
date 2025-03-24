import React from 'react';

interface ContainerProps {
    children: React.ReactNode;
    className?: string;
}

function Container(props:ContainerProps) : React.JSX.Element {
    return (
        <div className={`mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 bg-background text-foreground ${props.className}`}>
            {props.children}
        </div>
    );
}

export default Container;