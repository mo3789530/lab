import { Manifest } from "deno-slack-sdk/mod.ts";

/**
 * The app manifest contains the app's configuration. This
 * file defines attributes like app name and description.
 * https://api.slack.com/automation/manifest
 */
export default Manifest({
  name: "slackapp",
  description: "osaka lauch map",
  icon: "assets/default_new_app_icon.png",
  workflows: [],
  outgoingDomains: [],
  datastores: [],
  botScopes: [
    "commands",
    "chat:write",
    "chat:write.public",
    "datastore:read",
    "datastore:write",
    "reactions:read",
    "reactions:write",
  ],
});
