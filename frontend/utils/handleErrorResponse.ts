'use server'

import { NextResponse } from "next/server";

export async function handleErrorResponse(res: Response, errorResponse: any) {
    if (errorResponse.code === "token_not_valid") {
        const message =
            errorResponse.messages?.[0]?.message ||
            errorResponse.detail ||
            "Token not valid";
        return NextResponse.json({ error: message }, { status: res.status });
    }

    if (errorResponse.non_field_errors) {
        return NextResponse.json({ error: errorResponse.non_field_errors[0] }, { status: res.status });
    }

    if (errorResponse.username) {
        return NextResponse.json({ error: errorResponse.username[0] }, { status: res.status });
    }

    if (errorResponse.email) {
        return NextResponse.json({ error: errorResponse.email[0] }, { status: res.status });
    }

    if (errorResponse.password) {
        return NextResponse.json({ error: errorResponse.password[0] }, { status: res.status });
    }

    if (errorResponse.refresh) {
        return NextResponse.json({ error: errorResponse.refresh[0] }, { status: res.status });
    }

    if (errorResponse.topic) {
        return NextResponse.json({ error: errorResponse.topic[0] }, { status: res.status });
    }

    if (errorResponse.content) {
        return NextResponse.json({ error: errorResponse.content[0] }, { status: res.status });
    }

    if (errorResponse.category_ref){
        return NextResponse.json({ error: errorResponse.category_ref[0] }, { status: res.status });
    }

    if (errorResponse.name){
        return NextResponse.json({ error: errorResponse.name[0] }, { status: res.status });
    }

    if (errorResponse.slug){
        return NextResponse.json({ error: errorResponse.slug[0] }, { status: res.status });
    }

    if (errorResponse.description){
        return NextResponse.json({ error: errorResponse.description[0] }, { status: res.status });
    }

    if (errorResponse.detail) {
        return NextResponse.json({ error: errorResponse.detail }, { status: res.status });
    }

    // groups, user_permissions, permissions

    if (errorResponse.groups) {
        return NextResponse.json({ error: errorResponse.groups[0] }, { status: res.status });
    }
    if (errorResponse.user_permissions) {
        return NextResponse.json({ error: errorResponse.user_permissions[0] }, { status: res.status });
    }

    if (errorResponse.permissions) {
        return NextResponse.json({ error: errorResponse.permissions[0] }, { status: res.status });
    }

    return NextResponse.json({ error: "Unknown error occurred" }, { status: res.status });
}