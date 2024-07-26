# DiscordRoundEnded Plugin

The `DiscordRoundEnded` plugin, developed by HD, is designed to integrate Discord with your game server, providing notifications for round endings and other events. This plugin ensures that your Discord community stays updated with real-time game stats and game ends.

## Features

- Sends round end notifications to a specified Discord channel.
- Configurable embed color.
- Customizable webhook username and avatar URL.
- Automatically formats messages to include match details and statistics.

### Prerequisites

- Node.js installed on your server.
- A Discord webhook URL.
- DBLog is required to get information to this plugin.

### Configuration

Below is the configuration required for the `DiscordRoundEnded` plugin. Make sure to replace the placeholder values with your actual data.

```json
{
    "plugin": "DiscordRoundEndedv2",
    "enabled": true,
    "channelWebhookLink": "https://discord.com/api/webhooks/your_webhook_url",
    "avatar_url": "https://i.imgur.com/yourAvatarImage.png",
    "username": "Your Username For the Embed",
    "color": 4214509
}
```

### Obtaining the Discord Webhook URL

To get a Discord webhook URL:

1. Go to your Discord server and select the channel you want to use.
2. Click on the settings for the channel.
3. Under "Integrations," select "Webhooks."
4. Click "Create Webhook" and set up the details.
5. Copy the webhook URL and use it in your `config.json`.

### Usage

Once the plugin is configured and running, it will automatically send notifications to the specified Discord channel whenever a round ends. The notifications will include details such as the winning team, tickets remaining, and match statistics.

### Example Notification

A typical notification sent by the plugin will look like this:

![Example Output](https://i.imgur.com/a6mUXG1.png)

### License

This project is licensed under the GNU General Public License - see the [LICENSE](LICENSE) file for details.

## Contributing

Contributions are welcome! Please submit a pull request or open an issue to discuss any changes.

## Acknowledgements

- [Discord.js](https://discord.js.org/)
- [Node.js](https://nodejs.org/)
- [MySquadStats](https://mysquadstats.com/)
