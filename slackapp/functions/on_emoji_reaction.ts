// deno-lint-ignore-file
// functions/on_eyes_reaction.ts
import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";

export const OnEyesReaction = DefineFunction({
  callback_id: "on_eyes_reaction",
  title: "Eyes Reaction Trigger",
  source_file: "functions/on_eyes_reaction.ts",
});

const register = async (name: string, message: string, imageFile?: { url_private: string, token?: string, name?: string }) => {
  const formData = new FormData();
  formData.append("name", name);
  formData.append("message", message);
  
  if (imageFile?.url_private) {
    // Fetch the image from Slack's URL with token if available
    try {
      const headers: HeadersInit = {};
      if (imageFile.token) {
        headers["Authorization"] = `Bearer ${imageFile.token}`;
      }
      
      const imageResponse = await fetch(imageFile.url_private, { headers });
      if (imageResponse.ok) {
        const imageBlob = await imageResponse.blob();
        const fileName = imageFile.name || "slack_image.jpg";
        formData.append("image", imageBlob, fileName);
      }
    } catch (error) {
      console.error("Failed to fetch image:", error);
    }
  }

  const response = await fetch(
    "https://localhost.com/api/v1/register",
    {
      method: "POST",
      headers: {
        "x-api-key": "api_f9a01b2c3d4e5f67890123456789abcdef1234567890abcdef1234567890abcd",
      },
      body: formData,
    },
  );
  
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
  
  return await response.json();
};

export default SlackFunction(
  OnEyesReaction,
  async ({ inputs, client }) => {
    const { user, reaction, files, item, message } = inputs;

    // Filter for the "eyes" emoji only
    if (reaction !== "eyes") {
      return { completed: true, outputs: {} }; // Ignore other reactions
    }

    // Check if there are any image files
    const imageFiles = (files ?? []).filter(
      (file: any) => file.mimetype?.startsWith("image/")
    );

    if (item.type === "message") {
      const { channel, ts } = item;
      
      try {
        // Get message content
        const messageContent = message?.text || "No message content";
        const userName = user || "anonymous";
        
        // If there's an image file, send it with the message
        if (imageFiles && imageFiles.length > 0) {
          const imageFile = imageFiles[0];
          // Get bot token for authentication
          const auth = await client.auth.test();
          const token = auth.token;
          
          await register(userName, messageContent, {
            url_private: imageFile.url_private,
            token: token,
            name: imageFile.name
          });
        } else {
          // Send just the message without an image
          await register(userName, messageContent);
        }
        
        // Reply in the thread
        await client.chat.postMessage({
          channel,
          thread_ts: ts,
          text: `👀 I see you, <@${user}>! Your message has been registered.`,
        });
      } catch (error: any) {
        console.error("Failed to register message:", error);
        await client.chat.postMessage({
          channel,
          thread_ts: ts,
          text: `Failed to register message: ${error.message}`,
        });
      }
    }

    return { completed: true, outputs: {} };
  },
);
