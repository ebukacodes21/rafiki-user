import ApiConfig from "@/services/Apiconfig";
import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
    const { method } = request;
    const body = await request.json();

    try {
        const res = await axios({
            method: method,
            url: ApiConfig.reset,
            data: body,
        });

        return NextResponse.json(res.data);
    } catch (error: any) {
        if (error.code === "ECONNREFUSED"){
            return NextResponse.json({ error: error.errors}, {status: 500})
        }
        return NextResponse.json({ error: error.response?.data }, { status: error.response?.status });
    }
}