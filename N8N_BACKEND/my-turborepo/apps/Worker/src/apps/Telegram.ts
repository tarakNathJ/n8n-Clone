import { config } from "dotenv";
import TelegramBot, { type ConstructorOptions } from "node-telegram-bot-api";
import { type AgentOptions } from "http";

config();

export async function sendMessageTelegram(
  token: string,
  chatId: string,
  message: string
): Promise<boolean> {
  try {
    if (!token) {
      throw new Error("TELEGRAM_BOT_TOKEN is not defined");
    }

    console.log(token ,chatId ,message);
    const requestOptions: ConstructorOptions["request"] = {
      agentOptions: {
        family: 4, // Force IPv4
      } as AgentOptions,
    } as any;

    // Create bot instance
    const bot = new TelegramBot(token, {
      request: requestOptions,
    });

    // Await sending the message
    await bot.sendMessage(chatId, message);

    console.log("Message sent successfully!");
    return true;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as any).response
    ) {
      console.error("Error from Telegram:", (error as any).response.body);
    } else if (error instanceof Error) {
      console.error("Network or other error:", error.message);
    } else {
      console.error("Unknown error:", error);
    }
    return false;
  }
}
