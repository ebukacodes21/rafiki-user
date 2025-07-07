import axios from "axios";
import { format } from "date-fns";
import { fromZonedTime, toZonedTime } from "date-fns-tz";

export const apiCall = async (url: string, method: string, data?: object) => {
  try {
    const isGetRequest = method.toUpperCase() === "GET";
    const config: any = { url, method };
    isGetRequest ? (config.params = data) : (config.data = data);

    const res = await axios(config);
    return res.data;
  } catch (error) {
    return error;
  }
};

export const fileUploader = async (url: string, formData: FormData) => {
  try {
    const response = await axios.post(url, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;  
  } catch (error) {
    return error;  // return the error to handle it in the frontend
  }
};

export const formatError = (err: any) => {
  const errObj = err?.response?.data?.error;
  const issues = err?.response?.data?.error?.issues;
  const auth = err?.response?.data?.message;

  if (Array.isArray(issues) && issues.length > 0) {
    return issues.map((issue: any) => issue.message).join(", ");
  }

  if (typeof errObj === "object" && errObj !== null) {
    return errObj.message;
  }

  if (auth) {
    return auth;
  }

  return "An error occurred. Make sure you're connected to the internet or contact support.";
};

export const formatNumberWithCommas = (value: number): string => {
  return value.toLocaleString("en-US");
};

export function generateTimeSlots(open: string, close: string, intervalMinutes = 30): string[] {
  const slots: string[] = [];
  const [openHour, openMin] = open.split(":").map(Number);
  const [closeHour, closeMin] = close.split(":").map(Number);

  let current = new Date();
  current.setHours(openHour, openMin, 0, 0);

  const end = new Date();
  end.setHours(closeHour, closeMin, 0, 0);

  while (current < end) {
    const timeStr = current.toTimeString().slice(0, 5); // "HH:mm"
    slots.push(timeStr);
    current = new Date(current.getTime() + intervalMinutes * 60000);
  }

  return slots;
}

export function timeStringToMinutes(time: string) {
  const [h, m] = time.split(":").map(Number);
  return h * 60 + m;
}

export function minutesToTimeString(mins: number) {
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`;
}

export function firmToClientTime(
  date: Date,
  timeStr: string,
  firmTZ: string,
  clientTZ: string
): string {
  const [hour, minute] = timeStr.split(":").map(Number);
  const firmLocal = new Date(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute);
  const utc = fromZonedTime(firmLocal, firmTZ);
  const clientTime = toZonedTime(utc, clientTZ);
  return format(clientTime, "HH:mm");
}

export function clientToFirmDate(
  date: Date,
  timeStr: string,
  clientTZ: string,
  firmTZ: string
): Date {
  const [hour, minute] = timeStr.split(":").map(Number);
  const clientLocal = new Date(Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), hour, minute));
  const utc = fromZonedTime(clientLocal, clientTZ);     
  const firmLocal = toZonedTime(utc, firmTZ);        
  return firmLocal;
}