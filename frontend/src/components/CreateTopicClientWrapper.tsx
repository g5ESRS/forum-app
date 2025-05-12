'use client'

import React from 'react'
import { useSearchParams } from 'next/navigation'
import CreateTopicPage from '@/pagesProxy/CreateTopicPage'

export default function CreateTopicClientWrapper() {
    const searchParams = useSearchParams()
    const categoryId = searchParams?.get('categoryId') ?? ''

    return <CreateTopicPage categoryId={categoryId} />
}
