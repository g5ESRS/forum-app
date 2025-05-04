import React, { Suspense } from 'react'
import CreateTopicClientWrapper from '@/components/CreateTopicClientWrapper'

export default function Page() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <CreateTopicClientWrapper />
        </Suspense>
    )
}