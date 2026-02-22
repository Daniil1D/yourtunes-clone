import OpenAI from "openai";

export const openai = new OpenAI({
  apiKey: process.env.PROXYAPI_KEY,
  baseURL: "https://api.proxyapi.ru/openai/v1",
});
