import Logger from "@dazn/lambda-powertools-logger";
import { ApiResponse, api } from "../../shared/api";

const API_URL = process.env.API_URL || "";
const TENANT_ID = process.env.TENANT_ID || "";
const API_KEY = process.env.API_KEY || "";
const API_SECURE_CALLS = process.env.API_SECURE_CALLS || "";

export async function handler(event: any): Promise<ApiResponse> {
  Logger.info("Received event from Amazon Connect " + JSON.stringify(event));

  const payload = JSON.stringify(event);

  try {
    Logger.info("Sending payload", { payload });
    const response = await api(payload, {
      ApiKey: API_KEY,
      ApiSecureCalls: API_SECURE_CALLS,
      ApiUrl: API_URL,
      TenantId: TENANT_ID,
    });
    Logger.info("Received response", response.data);
    return {
      success: true,
    };
  } catch (e: any) {
    Logger.debug("Unexpected server error", e);
    return {
      success: false,
    };
  }
}
