'use client'

import React, {useEffect} from 'react';
import {z} from "zod";
import {useState} from "react";

import FormContainer from "@/components/FormContainer";
import {zodResolver} from "@hookform/resolvers/zod";
import FieldContainer from "@/components/FieldContainer";
import Input from "@/components/Input";
import {Controller, useForm} from "react-hook-form";
import Button from "@/components/Button";
import Link from "next/link";
import {authSchema} from "@utils/schemas/auth";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";

// Email, username, password

const RegisterSchema = z.object({
    email: authSchema.email,
    username: authSchema.username,
    password1: authSchema.password,
    password2: authSchema.password,
}).superRefine(({password2, password1}, ctx) => {
    if (password1 !== password2){
        ctx.addIssue({
            code: "custom",
            message: "Passwords don't match",
            path: ["password2"],
        })
    }
})

type RegisterFormData = z.infer<typeof RegisterSchema>;

function RegisterForm() {
    const router = useRouter();
    const { user, login, refreshUser } = useAuth();

    // Redirect if user is already logged in
    useEffect(() => {
        if (user) {
            router.push('/profile');
        }
    }, [user, router]);

    const defaultValues = useState<RegisterFormData>({
        email: "",
        username: "",
        password1: "",
        password2: "",
    })[0];

    const [formError, setFormError] = useState<string | null>(null);

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema),
        defaultValues,
    });

    const onSubmit = async (data: RegisterFormData) => {
        setFormError(null);

        try {
            const res = await fetch('/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (res.status === 401) {
                setFormError("Incorrect username, email or password.");
                return;
            }

            if (!res.ok) {
                const errorData = await res.json().catch(() => null);
                setFormError(errorData?.message || "An unexpected error occurred. Please try again.");
                return;
            }

            // After successful registration, log the user in
            const loginResult = await login(data.email, data.password1);

            if (!loginResult.success) {
                setFormError("Registration successful, but failed to log in automatically. Please login manually.");
                router.push('/auth/login');
                return;
            }

            // If login is successful, refresh the user state and redirect to profile
            await refreshUser();
            router.push('/profile');

        } catch (err) {
            setFormError("Failed to connect to server. Please try again later.");
            console.error(err);
        }
    }

    return (
        <FormContainer topic={'Registration'}>
            <form className={`space-y-4`} name={'RegisterForm'} onSubmit={handleSubmit(onSubmit)}>
                <FieldContainer label={'Username'} errorMessage={errors.username?.message}>
                    <Controller
                        name='username'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                type={'text'}
                                placeholder={'Type your username'}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </FieldContainer>

                <FieldContainer label={'Email'} errorMessage={errors.email?.message}>
                    <Controller
                        name='email'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                type={'email'}
                                placeholder={'Type your email'}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </FieldContainer>

                <FieldContainer label={'Password'} errorMessage={errors.password1?.message}>
                    <Controller
                        name='password1'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                type={'password'}
                                placeholder={'Type your password'}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </FieldContainer>

                <FieldContainer label={'Confirm Password'} errorMessage={errors.password2?.message}>
                    <Controller
                        name='password2'
                        control={control}
                        render={({ field: { onChange, value } }) => (
                            <Input
                                type={'password'}
                                placeholder={'Confirm your password'}
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </FieldContainer>

                {formError && (
                    <div className="text-sm text-red-600 text-center">{formError}</div>
                )}

                <Button type="submit" className="w-full">Register</Button>
            </form>

            <div className={'flex justify-between py-2'}>
                <p>Already have an account?</p>
                <Link href={'login'} className={'text-primary hover:text-primary-hover'}>Login</Link>
            </div>
        </FormContainer>
    );
}

export default RegisterForm;