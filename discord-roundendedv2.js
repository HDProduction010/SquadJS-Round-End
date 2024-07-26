import Logger from 'core/logger';
import BasePlugin from './base-plugin.js';

export default class DiscordRoundEndedv2 extends BasePlugin {
  static get description() {
    return 'This plugin will create webhook messages on Discord: ROUND ENDED, ROUND STARTED';
  }

  static get defaultEnabled() {
    return true;
  }

  static get optionsSpecification() {
    return {
      channelWebhookLink: {
        required: true,
        description: 'The webhook link to send messages to.',
        default: ''
      },
      color: {
        required: false,
        description: 'The color of the embed.',
        default: 16761867
      },
      username: {
        required: false,
        description: 'The username to use for the webhook.',
        default: 'Show Of Force'
      },
      avatar_url: {
        required: false,
        description: 'The avatar URL to use for the webhook.',
        default: 'https://cdn.discordapp.com/attachments/1126929753102880768/1154947759921705081/show.png?ex=65157b2b&is=651429ab&hm=681d52b76349a16daca261b069e6b9ed1e407fb71f7a154a5f919fd353d99557&'
      }
    };
  }

  constructor(server, options, connectors) {
    super(server, options, connectors);

    this.deathsTeam1 = 0;
    this.deathsTeam2 = 0;
    this.revivesTeam1 = 0;
    this.revivesTeam2 = 0;
    this.downsTeam1 = 0;
    this.downsTeam2 = 0;

    this.onPlayerWound = this.onPlayerWound.bind(this);
    this.onPlayerRevived = this.onPlayerRevived.bind(this);
    this.onPlayerDeath = this.onPlayerDeath.bind(this);
    this.onRoundEnd = this.onRoundEnd.bind(this);
    this.OnNewGame = this.OnNewGame.bind(this);

    this.channelWebhookLink = options.channelWebhookLink;
    this.color = options.color;
    this.username = options.username;
    this.avatar_url = options.avatar_url;
  }

  async mount() {
    this.server.on('PLAYER_WOUNDED', this.onPlayerWound);
    this.server.on('PLAYER_REVIVED', this.onPlayerRevived);
    this.server.on('PLAYER_DIED', this.onPlayerDeath);
    this.server.on('ROUND_ENDED', this.onRoundEnd);
    this.server.on('NEW_GAME', this.OnNewGame);
  }

  async unmount() {
    this.server.removeEventListener('PLAYER_WOUNDED', this.onPlayerWound);
    this.server.removeEventListener('PLAYER_REVIVED', this.onPlayerRevived);
    this.server.removeEventListener('PLAYER_DIED', this.onPlayerDeath);
    this.server.removeEventListener('ROUND_ENDED', this.onRoundEnd);
    this.server.removeEventListener('NEW_GAME', this.OnNewGame);
  }

  async sendWebhook(link, body) {
    fetch(link, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(body)
    })
  }

  async roundEnded(info, winnerDeaths, loserDeaths, winnerRevives, loserRevives, winnerDowns, loserDowns) {
    const endTime = Math.floor(Date.now() / 1000);
    const startTime = info.startTime ? Math.floor(new Date(info.startTime).getTime() / 1000) : null;
    const duration = startTime ? ((endTime - startTime) / 60).toFixed(2) : 'Unknown';

    await this.sendWebhook(this.channelWebhookLink, {
      username: this.username,
      avatar_url: this.avatar_url,
      embeds: [{
        title: `**${info.winner.faction}** has won the match \n\`${info.winner.tickets} - ${info.loser.tickets}\``,
        description: `**Start Time:** ${startTime ? `<t:${startTime}:f>` : 'Unknown'}\n**End Time:** <t:${endTime}:f>\n**Duration:** ${duration} minutes\n——————————————————————————————————————`,
        color: this.color,
        author: {
          name: `Round Complete!    |    ${info.winner.layer}`
        },
        fields: [
          {
            name: `TEAM ${info.winner.team} - Victor`,
            inline: true,
            value: `\`\`\`${info.winner.faction}\`\`\`• **${info.winner.tickets}** tickets remaining\n• **${winnerDowns}** total incapacitations\n• **${winnerDeaths}** total give-ups\n• **${winnerRevives}** total revives`,
          },
          {
            name: `TEAM ${info.loser.team} - Loser`,
            inline: true,
            value: `\`\`\`${info.loser.faction}\`\`\`• **${info.loser.tickets}** tickets remaining\n• **${loserDowns}** total incapacitations\n• **${loserDeaths}** total give-ups\n• **${loserRevives}** total revives`,
          }
        ]
      }],
      timestamp: (new Date()).toISOString()
    })
  }

  async OnNewGame(info) {
    // Removed useless function for doing this - HS
    this.deathsTeam1 = 0;
    this.deathsTeam2 = 0;
    this.revivesTeam1 = 0;
    this.revivesTeam2 = 0;
    this.downsTeam1 = 0;
    this.downsTeam2 = 0;

    await this.server.updateLayerInformation();
    this.sendWebhook
  }

  async onPlayerRevived(info) {
    if (!info.victim || !info.reviver) return;
    if (info.victim.teamID == 1 && info.reviver.teamID == 1) {
      this.revivesTeam1++;
    }
    else if (info.victim.teamID == 2 && info.reviver.teamID == 2) {
      this.revivesTeam2++;
    }
  }

  async onPlayerWound(info) {
    if (!info.victim) return;
    if (info.victim.teamID == 1) {
      this.downsTeam1++;
    }
    else if (info.victim.teamID == 2) {
      this.downsTeam2++;
    }
  }

  async onPlayerDeath(info) {
    if (!info.victim) return;
    if (info.victim.teamID == 1) {
      this.deathsTeam1++;
    }
    else if (info.victim.teamID == 2) {
      this.deathsTeam2++;
    }
  }

  async onRoundEnd(info) {
    if (!info.winner || !info.loser) {
      await this.sendWebhook(this.channelWebhookLink, {
        username: this.username,
        avatar_url: this.avatar_url,
        embeds: [{
          author: {
            name: `Round Ended    |    Automated Trigger`
          },
          color: this.color,
        }],
        timestamp: info.time.toISOString()
      })
      return;
    }

    await this.server.updateLayerInformation();

    if (info.winner.team == 1) {  // Don't need to check losing team also, can settle with just winner.team - HS
      await this.roundEnded(info, this.deathsTeam1, this.deathsTeam2, this.revivesTeam1, this.revivesTeam2, this.downsTeam1, this.downsTeam2);
    } else if (info.winner.team == 2) {
      await this.roundEnded(info, this.deathsTeam2, this.deathsTeam1, this.revivesTeam2, this.revivesTeam1, this.downsTeam2, this.downsTeam1);
    }
  }
}
