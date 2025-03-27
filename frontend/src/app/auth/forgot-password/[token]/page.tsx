import React from 'react';
import PasswordRecoveryForm from "@/pages/PasswordRecoveryForm";

async function Page({
                        params,
}:{
    params: Promise<{ token:string }>
}) {
    // const { token } = await params;

    console.log(params);

    return (
        <div>
            <PasswordRecoveryForm />
        </div>
    );
}

export default Page;