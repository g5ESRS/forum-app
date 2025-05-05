'use client'

import React, {useEffect, useState} from 'react';
import {z} from "zod";
import {topicCreateSchema} from "@utils/schemas/forum";
import {zodResolver} from "@hookform/resolvers/zod";
import {Controller, useForm} from "react-hook-form";
import FormContainer from "@/components/FormContainer";
import FieldContainer from "@/components/FieldContainer";
import Input from "@/components/Input";
import {BASE_URL} from "@utils/constants";
import {Category} from "@utils/types/forum";
import DropDownSelect from "@/components/DropDownSelect";
import Button from "@/components/Button";
import AutoResizeTextarea from "@/components/AutoResizeTextarea";
import {useRouter} from "next/navigation";
import {useAuth} from "@/context/AuthContext";
import {LoginLinkFactory} from "@utils/linkFactories/forum";

const TopicCreateSchema = z.object({
    category_ref: topicCreateSchema.category_ref,
    title: topicCreateSchema.title,
    content: topicCreateSchema.content,
}).required();

type TopicCreateSchemaType = z.infer<typeof TopicCreateSchema>;

interface CreateTopicPageProps {
    categoryId?: string;
}

function CreateTopicPage({categoryId}: CreateTopicPageProps) {
    const {user, loading} = useAuth();

    const router = useRouter();

    useEffect(() => {
        if (!user && !loading) {
            router.push(`${LoginLinkFactory()}`);
        }
    }, [router, user, loading]);

    const defaultValues = useState<TopicCreateSchemaType>({
        category_ref: categoryId ?? "",
        title: "",
        content: "",
    })[0];

    const {
        handleSubmit,
        formState: { errors },
        control,
    } = useForm<TopicCreateSchemaType>({
        resolver: zodResolver(TopicCreateSchema),
        defaultValues,
    });

    const [error, setError] = useState<string | null>(null);

    const onSubmit = async (data: TopicCreateSchemaType) => {
        setError(null);

        const response = await fetch(`${BASE_URL}/api/forum/topics/create`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!response.ok) {
            setError('Error in creating topic, try again later');
            return;
        }

        const responseData = await response.json()

        router.push(`/topics/${responseData.id}`);
    }

    const [categories, setCategories] = useState<Category[]>([]);


    useEffect(() => {
        const fetchCategories = async () => {
            const categories = await fetch(`${BASE_URL}/api/forum/categories`, {
                method: 'GET',
                headers: { 'Content-Type': 'application/json' },
            });
            const categoriesData: Category[] = await categories.json();
            setCategories(categoriesData);
        }

        fetchCategories().catch(() => {
            setError('Error fetching categories, try again later');
        });
    }, []);



    return (
        <div className={'w-full'}>
            <FormContainer topic={"Create Topic"} className={'max-w-2xl'}>
                <form className={`space-y-4 w-full`} onSubmit={handleSubmit(onSubmit)} name={"CreateTopicForm"}>
                    <FieldContainer label={"Title"} errorMessage={errors.title?.message}>
                        <Controller
                            control={control}
                            render={({field: {onChange, value}}) => (
                                <Input
                                    type="text"
                                    placeholder="Type your title"
                                    value={value}
                                    onChange={onChange}
                                    className={'h-auto bg-white'}
                                />
                            )}
                            name='title'/>
                    </FieldContainer>
                    <FieldContainer label={"Description"} errorMessage={errors.content?.message}>
                        <Controller
                            control={control}
                            render={({field: {onChange, value}}) => (
                                <AutoResizeTextarea value={value} onChange={onChange} placeholder={"Type your description"}/>
                            )}
                            name='content'
                        />
                    </FieldContainer>

                    <FieldContainer label={"Category"} errorMessage={errors.category_ref?.message}>
                        <Controller
                            control={control}
                            render={({field: {onChange, value}}) => (
                                <DropDownSelect
                                    options={categories}
                                    value={value}
                                    onChange={onChange}/>
                            )}
                            name='category_ref'/>
                    </FieldContainer>
                    {error && (
                        <div className="text-sm text-red-600 text-center">{error}</div>
                    )}

                    <div className="flex items-center justify-end">
                        <Button type="submit" className={"w-full"}>
                            Create Topic
                        </Button>
                    </div>
                </form>
            </FormContainer>
        </div>
    );
}

export default CreateTopicPage;