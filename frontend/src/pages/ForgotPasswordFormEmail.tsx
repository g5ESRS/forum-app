'use client';

import React, {useState} from 'react';
import {z} from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import FormContainer from "@/components/FormContainer";
import Button from "@/components/Button";
import Input from "@/components/Input";
import FieldContainer from "@/components/FieldContainer";
import {authSchema} from "../../utils/schemas/auth";

const ForgotPasswordSchema = z.object({
    email: authSchema.email,
});

type ForgotPasswordFormData = z.infer<typeof ForgotPasswordSchema>;

function ForgotPasswordFormEmail() {
    const defaultValues = useState<ForgotPasswordFormData>({
        email: "",
    })[0];

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<ForgotPasswordFormData>({
        resolver: zodResolver(ForgotPasswordSchema),
        defaultValues,
    });

    const onSubmit = (data: ForgotPasswordFormData) => {
        console.log(data);
    }

    return (
        <FormContainer topic={"Password Recovery"}>
            <form className={`space-y-4`} onSubmit={handleSubmit(onSubmit)} name={"ForgotPasswordFormEmail"}>
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
                <Button type="submit">Submit</Button>
            </form>
        </FormContainer>
    );
}

export default ForgotPasswordFormEmail;