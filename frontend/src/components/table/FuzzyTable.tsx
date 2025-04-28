import React from 'react';

import {
    ColumnDef,
    ColumnFiltersState,
    FilterFn, flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Row,
    SortingState, useReactTable,
} from '@tanstack/react-table';
import {fuzzyFilter, fuzzySort} from "@/components/table/FuzzyFilterSort";
import DebouncedInput from "@/components/DebouncedInput";
import Filter from "@/components/table/Filter";
import {useRouter} from "next/navigation";

interface DataTableProps<T> {
    columns: ColumnDef<T, any>[]
    data: T[]
    rowLinkFactory?: (row: Row<T>) => string
    pageSizeOptions?: number[]
}

function    FuzzyTable<T>({
    columns,
    data,
    rowLinkFactory,
    pageSizeOptions = [10, 25, 50, 100],
}: DataTableProps<T>) {

    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>( [])
    const [globalFilter, setGlobalFilter] = React.useState( '')
    const router = useRouter()

    const table = useReactTable({
        data,
        columns,
        filterFns:{
            fuzzy: fuzzyFilter,
        },
        state:{
            columnFilters,
            globalFilter,
        },
        onColumnFiltersChange: setColumnFilters,
        onGlobalFilterChange: setGlobalFilter,
        globalFilterFn: 'fuzzy',
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        debugTable: true,
        debugHeaders: true,
        debugColumns: false,
    })

    return (
        <div className="p-2">
            <div className={"flex items-center py-4 justify-center"}>
                <DebouncedInput
                    value={globalFilter ?? ''}
                    onChange={value => setGlobalFilter(String(value))}
                    className="p-2 font-lg shadow border border-block"
                    placeholder="Search all columns..."
                />
            </div>
            <div className="h-2" />
            <table>
                <thead>
                    {table.getHeaderGroups().map(headerGroup => (
                        <tr key={headerGroup.id}>
                            {headerGroup.headers.map((header) => {
                                return (
                                    <th key={header.id} colSpan={header.colSpan}>
                                        {header.isPlaceholder? null : (
                                            <>
                                                <div
                                                    {...{
                                                        className: header.column.getCanSort()
                                                            ? 'cursor-pointer select-none'
                                                            : '',
                                                        onClick: header.column.getToggleSortingHandler(),
                                                    }}
                                                >
                                                    {flexRender(
                                                        header.column.columnDef.header,
                                                        header.getContext(),
                                                    )}
                                                    {{
                                                        asc: ' 🔼',
                                                        desc: ' 🔽',
                                                    }[header.column.getIsSorted() as string] ?? null}
                                                </div>
                                                {header.column.getCanSort() ? (
                                                    <div>
                                                        <Filter column={header.column} />
                                                    </div>
                                                ) : null}
                                            </>
                                        )}
                                    </th>
                                )
                            })}
                        </tr>
                    ))}
                </thead>
                <tbody>
                    {table.getRowModel().rows.map(row => {
                        return (
                            <tr key={row.id}
                                onClick={()=>{
                                    router.push(`${rowLinkFactory ? rowLinkFactory(row) : ''}`)
                                }}
                            >
                                {row.getVisibleCells().map(cell => {
                                    return (
                                        <td
                                            key={cell.id}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </td>
                                    )
                                })}
                            </tr>
                        )
                    })}
                </tbody>
            </table>
        </div>
    );
}

export default FuzzyTable;