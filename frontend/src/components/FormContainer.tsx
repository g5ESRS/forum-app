import React from 'react';

interface FormContainerProps {
    topic: string;
    children: React.ReactNode;
}

function FormContainer(props: FormContainerProps) {
    return (
        <div className={`max-w-md mx-auto p-6 bg-background shadow-md rounded-md`}>
            <h2 className="text-2xl font-bold text-center mb-4">{props.topic}</h2>
            {props.children}
        </div>
    );
}

export default FormContainer;