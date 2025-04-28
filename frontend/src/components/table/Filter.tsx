/* eslint-disable @typescript-eslint/no-explicit-any */
// code from the documentation, that is why we ignore eslint rules

import React from 'react';
import {Column} from "@tanstack/react-table";
import DebouncedInput from "@/components/DebouncedInput";

interface FilterProps {
    column: Column<any, unknown>
}

function Filter({
    column
}: FilterProps) {
    const columnFilterValue = column.getFilterValue()
    return (
        <DebouncedInput
            type="text"
            value={(columnFilterValue ?? '') as string}
            onChange={value => column.setFilterValue(value)}
            placeholder={`Search...`}
            className="w-36 border shadow rounded"
        />
    );
}

export default Filter;