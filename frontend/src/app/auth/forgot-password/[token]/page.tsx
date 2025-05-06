import React from 'react';
import PasswordRecoveryForm from "@/pagesProxy/auth/PasswordRecoveryForm";

async function Page({}:{
    params: Promise<{ token:string }>
}) {
    // const { token } = await params;

    return (
        <div>
            <PasswordRecoveryForm />
        </div>
    );
}

export default Page;