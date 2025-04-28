import React from 'react';
import HeroTextPage from "@/pages/auth/HeroTextPage";
import Button from "@/components/Button";
import Link from "next/link";

function Success() {

    return (
        <>
            <HeroTextPage topic={'Success'} description={'We have sent you an email with instructions to reset your password.'} >
                <Link href="/auth/login">
                    <Button className={`mt-4`}>
                        Go to Login
                    </Button>
                </Link>
            </HeroTextPage>
        </>
    );
}

export default Success;