import ApiConfig from "@/services/apiconfig";
import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const body = await request.json();

  try {
    const res = await axios.post(ApiConfig.verify, body, {
      withCredentials: true,
    });

    const response = NextResponse.json(res.data);

    const setCookie = res.headers['set-cookie'];
    if (setCookie) {
      if (Array.isArray(setCookie)) {
        setCookie.forEach((cookie) =>
          response.headers.append('set-cookie', cookie)
        );
      } else {
        response.headers.set('set-cookie', setCookie);
      }
    }

    return response;
  } catch (error: any) {
    const status = error.response?.status || 500;
    const errorMsg = error.response?.data || { error: "Internal Server Error" };
    return NextResponse.json(errorMsg, { status });
  }
}
