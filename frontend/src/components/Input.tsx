import React from 'react';

interface InputProps {
    type: string;
    placeholder: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

function Input(props: InputProps): React.ReactElement {
    return (
        <input
            type={props.type}
            placeholder={props.placeholder}
            value={props.value}
            onChange={props.onChange}
            className={`w-full p-2 bg-background border border-gray-300 rounded-md ${props.className}`}
        />
    );
}

export default Input;