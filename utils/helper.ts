import axios from "axios";

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
    return error;  // Return the error to handle it in the frontend
  }
};


export const formatError = (err: any) => {
  const errObj = err.response?.data?.error;
  const issues = err.response?.data?.error?.issues;
  const auth = err.response.data.message;

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
