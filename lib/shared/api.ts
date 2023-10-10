import axios from "axios";
import Logger from "@dazn/lambda-powertools-logger";

type Config = {
  ApiUrl: string;
  ApiKey: string;
  ApiSecureCalls: string;
  TenantId: string;
};

export interface ApiResponse {
  success: boolean;
}

export const api = async (payload: any, config: Config): Promise<any> => {
  const BaseURL = config.ApiUrl.endsWith(":id")
    ? config.ApiUrl.replace(":id", config.TenantId)
    : config.ApiUrl;
  const axiosInstance = axios.create({
    baseURL: BaseURL,
    headers: {
      "Content-Type": "application/json",
      "X-Minerva-Api-Key": config.ApiKey,
      "Content-Length": payload.length,
    },
    httpsAgent: new (require("https").Agent)({
      rejectUnauthorized: config.ApiSecureCalls,
    }),
  });

  try {
    const response = await axiosInstance.post("", payload);
    if (response.status === 200) {
      return response.data;
    } else {
      Logger.info("Unexpected API server response", [
        response.headers,
        response.data,
      ]);
      throw new Error(`Unexpected API server response: ${response.status}`);
    }
  } catch (error) {
    console.error("Unexpected error while communicating with API", error);
    throw error;
  }
};
