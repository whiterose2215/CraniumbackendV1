const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");

// Don't mind this it's bad
const config = JSON.parse(fs.readFileSync("config.json", "utf8"));
const token = config.discord_bot_token;

const client = new Client({
    intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent],
});

client.once("ready", () => {
    console.log(`Logged in as ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    if (message.content.startsWith("!createaccount")) {
        message.reply("Creating account...");
    }

    if (message.content.startsWith("!addskins")) {
        message.reply("Adding Full locker(Placeholder)");
    }
});

client.login(token);
