'use server';
import { config } from "@/envConfig";

export const generate = async (prompt: string) => {
  const api_key = config.apiKey;
  
  const executePayload = JSON.stringify({
      output_type: "chat",
      input_type: "chat",
      input_value: prompt,
      session_id: crypto.randomUUID(),
  });

  const options = {
      method: 'POST',
      headers: {
          'Content-Type': 'application/json',
          'Content-Length': String(Buffer.byteLength(executePayload)),
          'x-api-key': api_key,
      },
      body: executePayload,
  };

  const response = await fetch(`${config.baseUrl}/api/v1/run/${config.flowId}`, options);
  const result = await response.json();
  console.warn(result);

  if (result === null) {
    throw new Error(`Generate failed`);
  }

  return result;
};

