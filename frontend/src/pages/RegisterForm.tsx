'use client'

import React from 'react';
import {z} from "zod";
import {useState} from "react";

import FormContainer from "@/components/FormContainer";
import {zodResolver} from "@hookform/resolvers/zod";
import FieldContainer from "@/components/FieldContainer";
import Input from "@/components/Input";
import {Controller, useForm} from "react-hook-form";
import Button from "@/components/Button";
import Link from "next/link";
import {authSchema} from "../../utils/schemas/auth";

// Email, username, password

const RegisterSchema = z.object({
    email: authSchema.email,
    username: authSchema.username,
    password: authSchema.password,
    cPassword: authSchema.password,
}).superRefine(({cPassword, password}, ctx) => {
    if (password !== cPassword){
        ctx.addIssue({
            code: "custom",
            message: "Passwords don't match",
            path: ["cPassword"],
        })
    }
})

type RegisterFormData = z.infer<typeof RegisterSchema>;

function RegisterForm() {
    const defaultValues = useState<RegisterFormData>({
        email: "",
        username: "",
        password: "",
        cPassword: "",
    })[0];

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<RegisterFormData>({
        resolver: zodResolver(RegisterSchema),
        defaultValues,
    });

    const onSubmit = (data: RegisterFormData) => {
        console.log(data);
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

                <FieldContainer label={'Password'} errorMessage={errors.password?.message}>
                    <Controller
                        name='password'
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

                <FieldContainer label={'Confirm Password'} errorMessage={errors.cPassword?.message}>
                    <Controller
                        name='cPassword'
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
                <Button type={"submit"} className={"w-full"}>Register</Button>
            </form>
            <div className={'flex justify-between py-2'}>
                <p>Already have an account?</p>
                <Link href={'login'} className={'text-primary hover:text-primary-hover'}>Login</Link>
            </div>
        </FormContainer>
    );
}

export default RegisterForm;