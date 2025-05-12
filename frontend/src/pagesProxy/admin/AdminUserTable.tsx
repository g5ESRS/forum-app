/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';

import React from 'react';
import {fuzzySort} from "@/components/table/FuzzyFilterSort";
import {ColumnDef} from "@tanstack/react-table";
import {BaseUser, UserDetails} from "@utils/types/user";
import FuzzyTable from "@/components/table/FuzzyTable";
import Link from "next/link";

function AdminUserTable() {
    const columns = React.useMemo<ColumnDef<BaseUser, any>[]>(
        () => [
            {
                accessorFn: row => row.id,
                id: 'id',
                cell: info => info.getValue(),
                filterFn: 'equalsString', //note: normal non-fuzzy filter column - exact match required
            },
            {
                accessorFn: row => row.username,
                id: 'username',
                cell: info => info.getValue(),
                header: () => <span>Username</span>,
                filterFn: 'fuzzy', //using our custom fuzzy filter function
                // filterFn: fuzzyFilter, //or just define with the function
                sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
            },
            {
                accessorFn: row => row.email,
                id: 'email',
                cell: info => info.getValue(),
                header: () => <span>Email</span>,
                filterFn: 'fuzzy', //using our custom fuzzy filter function
                // filterFn: fuzzyFilter, //or just define with the function
                sortingFn: fuzzySort, //sort by fuzzy rank (falls back to alphanumeric)
            },
        ],
        []
    )

    const [users, setUsers] = React.useState<BaseUser[]>([]);

    React.useEffect(() => {
        const fetchUsers = async ():Promise<undefined> => {
            const response = await fetch('/api/admin/users',{
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
                credentials: 'include',
            });
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data:UserDetails[] = await response.json();
            console.log(data);
            setUsers(data);
        }

        fetchUsers();
    }, []);

    return (
        <div className={'flex flex-col justify-center items-center'}>
            <h1 className={'text-2xl font-semibold text-foreground mb-6'}>Users</h1>
            <div className={'flex items-center w-full max-w-2xl'}>
                <Link
                    href={'/admin/categories'}>
                    <button className={'bg-primary-active text-white px-4 py-2 rounded-md hover:bg-blue-600'}>
                        Categories
                    </button>
                </Link>
                <Link
                    href={'/admin/groups'}>
                    <button className={'bg-primary-active text-white px-4 py-2 rounded-md hover:bg-blue-600 ml-4'}>
                        Groups
                    </button>
                </Link>

            </div>
            {FuzzyTable<BaseUser>({
                columns: columns,
                data: users,
                rowLinkFactory: (row) => `/admin/users/${row.getValue('id')}`,
            })}
        </div>
    );
}

export default AdminUserTable;