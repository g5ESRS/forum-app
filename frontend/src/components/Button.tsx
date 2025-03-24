import React from 'react';

interface ButtonProps {
    type?: "button" | "submit";
    children: React.ReactNode;
    onClick?: () => void;
    variant?: "primary" | "secondary";
    className?: string;
}

function Button(props: ButtonProps) {
    return (
        <button
            type={props.type}
            onClick={props.onClick}
            className={`bg-primary text-white px-4 py-2 rounded-md hover:bg-primary-hover ${props.className}`}
        >
            {props.children}
        </button>
    );
}

export default Button;