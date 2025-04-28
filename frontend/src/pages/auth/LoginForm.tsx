'use client'

import React, {useState} from 'react';
import Input from "@/components/Input";
import Button from "@/components/Button";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import FormContainer from "@/components/FormContainer";
import FieldContainer from "@/components/FieldContainer";
import Link from "next/link";
import {authSchema} from "@utils/schemas/auth";
import {useRouter} from "next/navigation";


const LoginSchema = z.object({
    email: authSchema.email,
    password: authSchema.password,
});

type LoginFormData = z.infer<typeof LoginSchema>;

function LoginForm() {
    const defaultValues = useState<LoginFormData>({
        email: "",
        password: "",
    })[0];

    const router = useRouter();

    const [formError, setFormError] = useState<string | null>(null);

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues,
    });

    const onSubmit = async (data: LoginFormData) => {
        setFormError(null);

        try {
            const res = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (res.status === 401) {
                setFormError("Incorrect email or password.");
                return;
            }

            if (!res.ok) {
                setFormError("An unexpected error occurred. Please try again.");
                return;
            }

            const result = await res.json();
            console.log(result);
            router.push('/profile');
        } catch (err) {
            setFormError("Failed to connect to server. Please try again later.");
            console.error(err);
        }
    };


    return (
        <FormContainer topic={"Login"}>
            <form className={`space-y-4`} onSubmit={handleSubmit(onSubmit)} name={"LoginForm"}>
                <FieldContainer label={"Email"} errorMessage={errors.email?.message}>
                    <Controller
                        name="email"
                        control={control}
                        render={({field: {onChange, value}}) => (
                            <Input
                                type="text"
                                placeholder="Type your email"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </FieldContainer>
                <FieldContainer label={"Password"} errorMessage={errors.password?.message}>
                    <Controller
                        name="password"
                        control={control}
                        render={({field: {onChange, value}}) => (
                            <Input
                                type="password"
                                placeholder="Type your password"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </FieldContainer>

                {formError && (
                    <div className="text-sm text-red-600 text-center">{formError}</div>
                )}

                <Button type={"submit"} className={"w-full"}>Login</Button>
            </form>
            <div className={'flex justify-between py-2'}>
                <Link href={'forgot-password'} className={'text-primary hover:text-primary-hover'}>Forgot password?</Link>
                <Link href={'registration'} className={'text-primary hover:text-primary-hover'}>Register</Link>
            </div>
        </FormContainer>
    );
}

export default LoginForm;