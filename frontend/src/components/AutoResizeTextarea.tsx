import React, { useRef, useEffect } from 'react';

interface AutoResizeTextareaProps {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
}

function AutoResizeTextarea({ value, onChange, placeholder }: AutoResizeTextareaProps) {
    const textareaRef = useRef<HTMLTextAreaElement | null>(null);

    useEffect(() => {
        if (textareaRef.current) {
            if ("style" in textareaRef.current) {
                textareaRef.current.style.height = 'auto';
            }
            if ("style" in textareaRef.current) {
                textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
            }
        }
    }, [value]);

    return (
        <textarea
            ref={textareaRef}
            value={value}
            placeholder={placeholder}
            onChange={(e) => onChange(e.target.value)}
            className="w-full resize-none overflow-hidden p-2 border rounded h-2"
            rows={1} // starts small
        />
    );
}

export default AutoResizeTextarea;