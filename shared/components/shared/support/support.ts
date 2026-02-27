import axios from "axios";

export const getSupportMessages = async () => {
  try {
    const { data } = await axios.get("/api/support/messages");
    return data.messages;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      console.log("Support GET error:", error.response?.status);

      if (error.response?.status === 401) {
        return [];
      }
    }

    throw error;
  }
};

export const sendSupportMessage = async (text: string) => {
  const { data } = await axios.post("/api/support/send", {
    text,
  });

  return data;
};
