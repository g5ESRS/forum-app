/* eslint-disable @typescript-eslint/no-explicit-any */
// code from the documentation, that is why we ignore eslint rules

import React from 'react';
import DebouncedInput from "@/components/DebouncedInput";

const Filter = ({ column }: { column: any }) => {
    const columnFilterValue = column.getFilterValue();
    return (
        <DebouncedInput
            type="text"
            value={(columnFilterValue ?? '') as string}
            onChange={value => column.setFilterValue(value)}
            placeholder="Filter..."
            className="filter-input"
            debounce={500} // Указываем значение debounce
        />
    );
};

export default Filter;