'use client'

import React, {useEffect, useState} from 'react';
import Input from "@/components/Input";
import Button from "@/components/Button";
import {Controller, useForm} from "react-hook-form";
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import FormContainer from "@/components/FormContainer";
import FieldContainer from "@/components/FieldContainer";
import Link from "next/link";
import {authSchema} from "../../utils/schemas/auth";


const LoginSchema = z.object({
    username: authSchema.username,
    password: authSchema.password,
});

type LoginFormData = z.infer<typeof LoginSchema>;

function LoginForm() {
    const defaultValues = useState<LoginFormData>({
        username: "",
        password: "",
    })[0];

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<LoginFormData>({
        resolver: zodResolver(LoginSchema),
        defaultValues: defaultValues,
    });

    const onSubmit = (data: LoginFormData) => {
        console.log(data);
    }

    return (
        <FormContainer topic={"Login"}>
            <form className={`space-y-4`} onSubmit={handleSubmit(onSubmit)} name={"LoginForm"}>
                <FieldContainer label={"Username"} errorMessage={errors.username?.message}>
                    <Controller
                        name="email"
                        control={control}
                        render={({field: {onChange, value}}) => (
                            <Input
                                type="text"
                                placeholder="Type your username"
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