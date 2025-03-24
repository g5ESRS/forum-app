import React from 'react';

interface FieldContainerProps {
    label: string;
    children: React.ReactNode;
    errorMessage?: string;
}

function FieldContainer(props: FieldContainerProps) {
    return (
        <div>
            <label>
                {props.label}
            </label>
            {props.children}
            <p className={"text-danger"}>
                {props.errorMessage}
            </p>
        </div>
    );
}

export default FieldContainer;