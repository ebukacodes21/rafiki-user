import ApiConfig from "@/services/apiconfig";
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export async function GET(request: NextRequest) {
  const { method, url } = request;
  const object = new URL(url);
  const { searchParams } = object;

  try {
    const res = await axios({
      method: method,
      url: ApiConfig.getBookedSlots,
      params: {
        firmId: searchParams.get("firmId"),
      },
    });

    return NextResponse.json(res.data);
  } catch (error: any) {
    if (error.code === "ECONNREFUSED") {
      return NextResponse.json({ error: error.errors }, { status: 500 });
    }
    return NextResponse.json(
      { error: error.response?.data },
      { status: error.response.status }
    );
  }
}
