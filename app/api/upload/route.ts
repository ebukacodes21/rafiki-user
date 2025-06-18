import { COOKIE_NAME } from "@/constants";
import ApiConfig from "@/services/apiconfig";
import axios from "axios";
import { NextResponse, NextRequest } from 'next/server';

export async function POST(request: NextRequest) {
  const { method, cookies } = request; 
  const data = await request.formData(); 
  const token = cookies.get(COOKIE_NAME)?.value || ""; 

  const file = data.get('file');
  if (!file) {
    return NextResponse.json({ message: "No file provided" }, { status: 400 });
  }

  try {
    const res = await axios({
      method,
      url: ApiConfig.upload, 
      headers: {
        Authorization: `Bearer ${token}`,  
      },
      data
    });

    return NextResponse.json(res.data);  
  } catch (error: any) {
    return NextResponse.json({ message: error.response?.data || "File upload failed" }, { status: error.response?.status || 500 });
  }
}