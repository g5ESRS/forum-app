/* eslint-disable @typescript-eslint/no-explicit-any */

import React from 'react';

import {
    ColumnDef,
    ColumnFiltersState,
    flexRender, getCoreRowModel, getFilteredRowModel, getPaginationRowModel, getSortedRowModel, Row,
    useReactTable,
} from '@tanstack/react-table';
import {fuzzyFilter} from "@/components/table/FuzzyFilterSort";
import DebouncedInput from "@/components/DebouncedInput";
import Filter from "@/components/table/Filter";
import {useRouter} from "next/navigation";

interface DataTableProps<T> {
    columns: ColumnDef<T, any>[]
    data: T[]
    rowLinkFactory?: (row: Row<T>) => string
    pageSizeOptions?: number[]
}

function FuzzyTable<T>({
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
            <div className="h-2"/>
            <table>
                <thead>
                {table.getHeaderGroups().map(headerGroup => (
                    <tr key={headerGroup.id}>
                        {headerGroup.headers.map((header) => {
                            return (
                                <th key={header.id} colSpan={header.colSpan}>
                                    {header.isPlaceholder ? null : (
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
                                                    <Filter column={header.column}/>
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
                            onClick={() => {
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
            <div className="flex items-center gap-2">
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(0)}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    {'<'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    {'>'}
                </button>
                <button
                    className="border rounded p-1"
                    onClick={() => table.setPageIndex(table.getPageCount() - 1)}
                    disabled={!table.getCanNextPage()}
                >
                    {'>>'}
                </button>
                <span className="flex items-center gap-1">
          <div>Page</div>
          <strong>
            {table.getState().pagination.pageIndex + 1} of{' '}
              {table.getPageCount()}
          </strong>
        </span>
                <span className="flex items-center gap-1">
          | Go to page:
          <input
              type="number"
              defaultValue={table.getState().pagination.pageIndex + 1}
              onChange={e => {
                  const page = e.target.value ? Number(e.target.value) - 1 : 0
                  table.setPageIndex(page)
              }}
              className="border p-1 rounded w-16"
          />
        </span>
                <select
                    value={table.getState().pagination.pageSize}
                    onChange={e => {
                        table.setPageSize(Number(e.target.value))
                    }}
                >
                    {pageSizeOptions!.map(pageSize => (
                        <option key={pageSize} value={pageSize} id={(pageSize).toString()}>
                            Show {pageSize}
                        </option>
                    ))}
                </select>
            </div>
        </div>
    );
}

export default FuzzyTable;