/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';

import React from 'react';
import {ColumnDef} from "@tanstack/react-table";
import {Category} from "@utils/types/forum";
import FuzzyTable from "@/components/table/FuzzyTable";
import {useRouter} from "next/navigation";

function AdminCategoryTable() {

    const router = useRouter();

    const [categories, setCategories] = React.useState<Category[]>([]);

    React.useEffect(() => {
        const fetchCategories = async ():Promise<undefined> => {
            const response = await fetch('/api/forum/categories',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
                cache: 'no-store',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data:Category[] = await response.json();
            console.log(data);
            setCategories(data);
        }

        fetchCategories();
    }, []);

    const columns = React.useMemo<ColumnDef<Category, any>[]>(
        () => [
        {
            accessorFn: row => row.id,
            id: 'id',
            cell: info => info.getValue(),
            filterFn: 'equalsString', //note: normal non-fuzzy filter column - exact match required
        },
        {
            accessorFn: row => row.name,
            id: 'name',
            cell: info => info.getValue(),
            header: () => <span>Name</span>,
            filterFn: 'fuzzy', //using our custom fuzzy filter function
            // filterFn: fuzzyFilter, //or just define with the function
            sortingFn: 'alphanumeric', //sort by fuzzy rank (falls back to alphanumeric)
        },
        {
            accessorFn: row => row.description,
            id: 'description',
            cell: info => info.getValue(),
            header: () => <span>Description</span>,
            filterFn: 'fuzzy', //using our custom fuzzy filter function
        },
        {
            accessorFn: row => row.slug,
            id: 'slug',
            cell: info => info.getValue(),
            header: () => <span>Slug</span>,
            filterFn: 'fuzzy', //using our custom fuzzy filter function
        },
        {
            accessorFn: row => row.is_active ? 'Yes' : 'No',
            id: 'is_active',
            cell: info => info.getValue(),
            header: () => <span>Is Active</span>,
            filterFn: 'equalsString', //note: normal non-fuzzy filter column - exact match required
        },
        {
            accessorFn: row => {return (new Date(row.created_at)).toLocaleString()},
            id: 'created_at',
            cell: info => info.getValue(),
            header: () => <span>Created At</span>,
            filterFn: 'fuzzy', //using our custom fuzzy filter function
        },
        {
            accessorFn: row => {return (new Date(row.updated_at)).toLocaleString()},
            id: 'updated_at',
            cell: info => info.getValue(),
            header: () => <span>Updated At</span>,
            filterFn: 'fuzzy', //using our custom fuzzy filter function
        },
    ], []);

    return (
        <div className={'flex flex-col items-center min-h-screen bg-background p-6 w-full'}>
            <h1 className="text-2xl font-semibold text-foreground mb-6">Categories</h1>


            <button
                className="bg-blue-500 text-white px-4 py-2 rounded block"
                onClick={() => {
                    router.push('/admin/categories/create')
                }}
            >
                Create New Category
            </button>


            <div className="mb-4">

                {FuzzyTable<Category>({
                    columns: columns,
                    data: categories,
                    rowLinkFactory: (row) => `/admin/categories/${row.getValue('id')}`,
                })}
            </div>
        </div>
    );
}

export default AdminCategoryTable;