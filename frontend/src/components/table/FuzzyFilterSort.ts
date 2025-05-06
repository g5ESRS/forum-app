/* eslint-disable @typescript-eslint/no-explicit-any */
// code from the documentation, that is why we ignore eslint rules
import {
    FilterFn,
    SortingFn,
    sortingFns,
} from '@tanstack/react-table';

import {
    RankingInfo,
    rankItem,
    compareItems,

} from '@tanstack/match-sorter-utils'

declare module '@tanstack/react-table' {
    interface FilterFns {
        fuzzy: FilterFn<unknown>
    }
    interface FilterMeta {
        itemRank: RankingInfo
    }
}

export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
    const itemRank = rankItem(row.getValue(columnId), value)

    addMeta({
        itemRank,
    })

    return itemRank.passed
}

export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
    let dir = 0

    if (rowA.columnFiltersMeta[columnId]) {
        dir = compareItems(
            rowA.columnFiltersMeta[columnId]?.itemRank,
            rowB.columnFiltersMeta[columnId]?.itemRank,
        )
    }

    return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}
