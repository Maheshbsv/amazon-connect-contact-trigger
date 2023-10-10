import { ConnectContactFlowEvent } from "aws-lambda";
import Logger from "@dazn/lambda-powertools-logger";
import { ApiResponse, api } from "../../shared/api";


const API_URL = process.env.API_URL || "";
const TENANT_ID = process.env.TENANT_ID || "";
const API_KEY = process.env.API_KEY || "";
const API_SECURE_CALLS = process.env.API_SECURE_CALLS || "";

export async function handler(
  event: ConnectContactFlowEvent
): Promise<ApiResponse> {
  Logger.info("Received event from Amazon Connect " + JSON.stringify(event));

  let payload = {
    streamARN: event.Details.ContactData.MediaStreams.Customer.Audio?.StreamARN,
    startFragmentNum:
      event.Details.ContactData.MediaStreams.Customer.Audio
        ?.StartFragmentNumber,
    connectContactId: event.Details.ContactData.ContactId,
    ANI: event.Details.ContactData.CustomerEndpoint?.Address,
    DNIS: event.Details.ContactData.SystemEndpoint?.Address,
    agentUsername: event.Details.ContactData.Attributes.agentUsername,
    instanceARN: event.Details.ContactData.InstanceARN,
    tenantId: TENANT_ID,
  };

  if (payload.agentUsername == null || payload.agentUsername.length <= 0) {
    payload.agentUsername = event.Details.Parameters.agentUsernameFallback;
  }

  try {
    Logger.info("Sending payload", payload);
    const response = await api(payload, {ApiKey: API_KEY, ApiSecureCalls: API_SECURE_CALLS, ApiUrl: API_URL, TenantId: ""});
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