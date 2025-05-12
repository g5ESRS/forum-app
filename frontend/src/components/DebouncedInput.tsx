/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable @typescript-eslint/no-explicit-any */
// code from the documentation, that is why we ignore eslint rules

import React from 'react';

interface DebouncedInputProps {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
    [key: string]: any
}

function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 500,
    ...props
}:DebouncedInputProps) {
    const [value, setValue] = React.useState(initialValue);


    React.useEffect(() => {
        setValue(initialValue)
    }, [initialValue])

    React.useEffect(() => {
        const timeout = setTimeout(() => {
            onChange(value)
        }, debounce!)

        return () => clearTimeout(timeout)
    }, [value])

    return (
        <input {...props} value={value} onChange={e => setValue(e.target.value)}/>
    );
}

export default DebouncedInput;