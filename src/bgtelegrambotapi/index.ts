import express, { type Request, type Response } from 'express';

// Ensure this environment variable is correctly set
const TG_BOT_SECRET = process.env.TG_BOT_SECRET; 
if (!TG_BOT_SECRET) {
    throw new Error("TG_BOT_SECRET environment variable is not set.");
}

const API_BASE_URL = `https://api.telegram.org/bot${TG_BOT_SECRET}`;
const bgTelegramBotServer = express.Router();

/**
 * Sends a message back to the specified chat.
 * @param chat_id The recipient's chat ID.
 * @param text The message content.
 */
const sendMessage = (chat_id: number, text: string) => {
    fetch(`${API_BASE_URL}/sendMessage`, {
        method: "POST",
        headers: {
            // FIX 1: Must include Content-Type for JSON body
            'Content-Type': 'application/json' 
        },
        body: JSON.stringify({
            chat_id,
            text
        })
    })
    // Optional: Add error logging for the fetch call
    .then(res => {
        if (!res.ok) {
            console.error(`Telegram API Error: Status ${res.status}`);
        }
    })
    .catch(error => {
        console.error("Error sending message to Telegram:", error);
    });
};

bgTelegramBotServer.post("/", express.json(), (req: Request, res: Response) => {
    const update = req.body;

    // Check if the update contains a message
    if (update && update.message) {
        const { text, chat: { id: chatId } } = update.message;
        
        console.log(`Received message from ${chatId}: ${text}`);

        // Handle the /start command
        if (text === "/start") {
            sendMessage(chatId, "Hello and welcome! I am bg telegram bot. What can I help you with?");
        } else {
            sendMessage(chatId, `You said: "${text}". I am working on a full response!`);
        }
    }
    
    // FIX 2: Send an immediate 200 OK response to Telegram
    res.status(200).send('OK'); 
});

export default bgTelegramBotServer;