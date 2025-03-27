'use client'

import React, {useState} from 'react';
import {z} from "zod";
import FormContainer from "@/components/FormContainer";
import {authSchema} from "../../utils/schemas/auth";
import FieldContainer from "@/components/FieldContainer";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import Input from "@/components/Input";
import Button from "@/components/Button";

const PasswordRecoveryFormSchema = z.object({
    password: authSchema.password,
    cPassword: authSchema.password,
}).superRefine(({cPassword, password}, ctx) => {
    if (password !== cPassword) {
        ctx.addIssue({
            code: "custom",
            message: "Passwords don't match",
            path: ["cPassword"],
        })
    }
});

type PasswordRecoveryFormData = z.infer<typeof PasswordRecoveryFormSchema>;

function PasswordRecoveryForm() {
    const defaultValues = useState<PasswordRecoveryFormData>({
        password: "",
        cPassword: "",
    })[0];

    const {
        handleSubmit,
        formState: {errors},
        control,
    } = useForm<PasswordRecoveryFormData>({
        resolver: zodResolver(PasswordRecoveryFormSchema),
        defaultValues,
    });

    const onSubmit = (data: PasswordRecoveryFormData) => {
        console.log(data);
    }

    return (
        <FormContainer topic={"Password Recovery"}>
            <form className={`space-y-4`} name={"PasswordRecoveryForm"} onSubmit={handleSubmit(onSubmit)}>
                <FieldContainer label={"Password"} errorMessage={errors.password?.message}>
                    <Controller
                        name="password"
                        control={control}
                        render={({field: {onChange, value}}) => (
                            <Input
                                type="password"
                                placeholder="Type your new password"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />
                </FieldContainer>

                <FieldContainer label={"Confirm Password"} errorMessage={errors.cPassword?.message}>
                    <Controller
                        name="cPassword"
                        control={control}
                        render={({field: {onChange, value}}) => (
                            <Input
                                type="password"
                                placeholder="Confirm your new password"
                                value={value}
                                onChange={onChange}
                            />
                        )}
                    />

                </FieldContainer>
                <Button type={"submit"} className={"w-full"}>Change the password!</Button>
            </form>
        </FormContainer>
    );
}

export default PasswordRecoveryForm;