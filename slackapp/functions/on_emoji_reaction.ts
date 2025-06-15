// functions/on_eyes_reaction.ts
import { DefineFunction, SlackFunction } from "deno-slack-sdk/mod.ts";

export const OnEyesReaction = DefineFunction({
  callback_id: "on_eyes_reaction",
  title: "Eyes Reaction Trigger",
  source_file: "functions/on_eyes_reaction.ts",
});

const regsiter = async () => {
  const response = await fetch(
    "https://localhost.com/api/register",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
        "x-api-key": "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
      },
    },
  );
  if (!response.ok) {
    throw new Error(`HTTP error! Status: ${response.status}`);
  }
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
      await client.chat.postMessage({
        channel,
        thread_ts: ts,
        text: `👀 I see you, <@${user}>!`,
      });
    }

    return { completed: true, outputs: {} };
  },
);
