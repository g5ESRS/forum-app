/* eslint-disable @typescript-eslint/no-explicit-any */


'use client';

import React from 'react';
import {Group} from "@utils/types/user";
import {ColumnDef} from "@tanstack/react-table";
import FuzzyTable from "@/components/table/FuzzyTable";
import Link from "next/link";

function AdminGroupTable() {
    const [groups, setGroups] = React.useState<Group[]>([]);

    React.useEffect(() => {
        const fetchGroups = async () => {
            try {
                const res = await fetch('/api/admin/groups', {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    credentials: 'include',
                    cache: 'no-store',
                });

                let data = await res.json();

                data = typeof data === "string" ? JSON.parse(data) : data

                console.log(data)

                setGroups(data)
            } catch (err){
                console.error("Failed to fetch groups:", err);
            }
        }

        fetchGroups();
    }, []);

    const columns = React.useMemo<ColumnDef<Group, any>[]>(
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
            },
            {
                accessorFn: row => row.permissions.length,
                id: 'permissions',
                cell: info => info.getValue(),
                header: () => <span>Number of permissions</span>,
                filterFn: 'equalsString', //using our custom fuzzy filter function
            }
        ],
        []
    )

    return (
        <div className={'flex flex-col items-center min-h-screen bg-background p-6 w-full'}>
            <h1 className="text-2xl font-semibold text-foreground mb-6">Groups</h1>

            <Link href={`/admin/groups/create`} className="mb-4">

                <button className="bg-primary-active text-white px-4 py-2 rounded">
                    Create new group
                </button>

            </Link>
            {FuzzyTable<Group>({
                columns: columns,
                data: groups,
                rowLinkFactory: (row) => {
                    return `/admin/groups/${row.getValue('id')}`;
                }
            })}
        </div>
    );
}

export default AdminGroupTable;