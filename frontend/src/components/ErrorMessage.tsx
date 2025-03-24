import React from 'react';

interface ErrorMessageProps {
    message: string;
}

function ErrorMessage(props:ErrorMessageProps) {
    return (
        <p className="text-red-500 text-sm">
            {props.message}
        </p>
    );
}

export default ErrorMessage;