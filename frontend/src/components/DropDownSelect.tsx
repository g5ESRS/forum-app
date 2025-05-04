import React from 'react';

interface Option {
    name: string;
    id: string | number;
}

interface DropDownSelectProps {
    options: Option[];
    value: string;
    onChange: (value: string) => void;
}

function DropDownSelect({
    options,
    value,
    onChange
}: DropDownSelectProps) {


    return (
        <select
            className="p-2 border rounded w-full"
            value={value}
            onChange={(e) => onChange(e.target.value)}
        >
            <option value="">Select an option</option>
            {options.map((option) => (
                <option key={option.id} value={option.id}>
                    {option.name}
                </option>
            ))}
        </select>
    );
}

export default DropDownSelect;