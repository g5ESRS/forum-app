'use client';

import React from 'react';
import {fuzzySort} from "@/components/table/FuzzyFilterSort";
import {ColumnDef} from "@tanstack/react-table";
import {BaseUser} from "@utils/types/user";
import FuzzyTable from "@/components/table/FuzzyTable";

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
        const fetchUsers = async () => {
            const response = await fetch('/api/admin/users');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            console.log(data);
            setUsers(data);
        }

        fetchUsers();
    }, []);

    return (
        <div className={'flex flex-col justify-center items-center'}>
            {FuzzyTable<BaseUser>({
                columns: columns,
                data: users,
                rowLinkFactory: (row) => `/admin/users/${row.getValue('id')}`,
            })}
        </div>
    );
}

export default AdminUserTable;