import * as readline from "readline";
import { v4 as uuidv4 } from "uuid";
import { agent } from "./agents";

// Generate a unique session ID for this chat session
const sessionId = uuidv4();

// Create readline interface for CLI input/output
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// ANSI color codes for better CLI experience
const colors = {
  reset: "\x1b[0m",
  bright: "\x1b[1m",
  dim: "\x1b[2m",
  red: "\x1b[31m",
  green: "\x1b[32m",
  yellow: "\x1b[33m",
  blue: "\x1b[34m",
  magenta: "\x1b[35m",
  cyan: "\x1b[36m",
  white: "\x1b[37m",
};

// Function to format and display messages
function displayMessage(
  role: "user" | "assistant" | "system",
  message: string
) {
  const timestamp = new Date().toLocaleTimeString();

  switch (role) {
    case "user":
      console.log(
        `${colors.cyan}[${timestamp}] You:${colors.reset} ${message}`
      );
      break;
    case "assistant":
      console.log(
        `${colors.green}[${timestamp}] Cortex:${colors.reset} ${message}`
      );
      break;
    case "system":
      console.log(
        `${colors.dim}[${timestamp}] System: ${message}${colors.reset}`
      );
      break;
  }
}

// Function to display welcome message
function displayWelcome() {
  console.clear();
  console.log(`${colors.bright}${colors.magenta}
╔══════════════════════════════════════╗
║            CORTEX CLI CHAT           ║
║        AI Assistant Interface        ║
╚══════════════════════════════════════╝${colors.reset}
`);
  console.log(`${colors.yellow}Welcome to Cortex CLI Chat!${colors.reset}`);
  console.log(`${colors.dim}Session ID: ${sessionId}${colors.reset}`);
  console.log(
    `${colors.dim}🔍 LangSmith Tracking: ${process.env.LANGCHAIN_TRACING_V2 === "true" ? "Enabled" : "Disabled"}${colors.reset}`
  );
  console.log(
    `${colors.dim}Type your message and press Enter to chat.${colors.reset}`
  );
  console.log(
    `${colors.dim}Commands: /help, /clear, /debug, /langsmith, /exit${colors.reset}\n`
  );
}

// Function to display help
function displayHelp() {
  console.log(`${colors.yellow}Available Commands:${colors.reset}`);
  console.log(`${colors.cyan}/help${colors.reset}   - Show this help message`);
  console.log(`${colors.cyan}/clear${colors.reset}  - Clear the screen`);
  console.log(
    `${colors.cyan}/debug${colors.reset}  - Toggle debug mode (shows all messages)`
  );
  console.log(
    `${colors.cyan}/langsmith${colors.reset} - Show LangSmith dashboard URL`
  );
  console.log(`${colors.cyan}/exit${colors.reset}   - Exit the chat\n`);
}

// Function to pretty print all messages (similar to Python m.pretty_print())
function prettyPrintMessages(messages: any[]) {
  console.log(`${colors.blue}=== DEBUG: All Messages ===${colors.reset}`);
  messages.forEach((msg, index) => {
    const role = msg.role || "unknown";
    const content =
      typeof msg.content === "string"
        ? msg.content
        : JSON.stringify(msg.content, null, 2);
    const toolCalls = msg.tool_calls
      ? JSON.stringify(msg.tool_calls, null, 2)
      : null;

    console.log(
      `${colors.magenta}[${index}] ${role.toUpperCase()}:${colors.reset}`
    );
    console.log(`${colors.white}Content: ${content}${colors.reset}`);

    if (toolCalls) {
      console.log(`${colors.yellow}Tool Calls: ${toolCalls}${colors.reset}`);
    }

    console.log(`${colors.dim}${"─".repeat(50)}${colors.reset}`);
  });
  console.log(`${colors.blue}=== End Debug Messages ===${colors.reset}\n`);
}

// Main chat function
async function startChat() {
  displayWelcome();

  let debugMode = false; // Track debug mode state

  const askQuestion = () => {
    rl.question(`${colors.bright}> ${colors.reset}`, async (input) => {
      const message = input.trim();

      // Handle commands
      if (message.startsWith("/")) {
        switch (message.toLowerCase()) {
          case "/help":
            displayHelp();
            break;
          case "/clear":
            console.clear();
            displayWelcome();
            break;
          case "/debug":
            debugMode = !debugMode;
            displayMessage(
              "system",
              `Debug mode ${debugMode ? "enabled" : "disabled"}. ${debugMode ? "All messages will be shown." : "Only final responses will be shown."}`
            );
            break;
          case "/langsmith":
            const projectName =
              process.env.LANGCHAIN_PROJECT || "cortex-cli-chat";
            displayMessage(
              "system",
              `🔍 LangSmith Dashboard: https://smith.langchain.com/projects/p/${projectName}\n📊 Session ID: ${sessionId}\n💡 View your conversation traces and agent performance metrics.`
            );
            break;
          case "/exit":
            displayMessage(
              "system",
              "Goodbye! Thanks for using Cortex CLI Chat."
            );
            rl.close();
            return;
          default:
            displayMessage(
              "system",
              `Unknown command: ${message}. Type /help for available commands.`
            );
        }
        askQuestion();
        return;
      }

      // Handle empty input
      if (!message) {
        askQuestion();
        return;
      }

      // Display user message
      displayMessage("user", message);

      try {
        // Show thinking indicator
        process.stdout.write(
          `${colors.dim}Cortex is thinking...${colors.reset}`
        );

        // Create a simple spinner
        const spinner = ["⠋", "⠙", "⠹", "⠸", "⠼", "⠴", "⠦", "⠧", "⠇", "⠏"];
        let spinnerIndex = 0;
        const spinnerInterval = setInterval(() => {
          process.stdout.write(
            `\r${colors.dim}Cortex is thinking ${spinner[spinnerIndex]}${colors.reset}`
          );
          spinnerIndex = (spinnerIndex + 1) % spinner.length;
        }, 100);

        // Invoke the agent with LangSmith tracking
        const response = await agent.invoke(
          {
            messages: [{ role: "human", content: message }],
          },
          {
            configurable: {
              session_id: sessionId,
            },
            metadata: {
              session_id: sessionId,
              user_message: message,
              timestamp: new Date().toISOString(),
              interface: "cli-chat",
            },
            tags: ["cortex-cli", "interactive-chat"],
          }
        );

        // Clear spinner
        clearInterval(spinnerInterval);
        process.stdout.write("\r" + " ".repeat(30) + "\r");

        // Show debug info if enabled
        if (debugMode) {
          prettyPrintMessages(response.messages);
        }

        // Extract the response message
        const lastMessage = response.messages[response.messages.length - 1];
        const responseMessage =
          typeof lastMessage.content === "string"
            ? lastMessage.content
            : JSON.stringify(lastMessage.content);
        displayMessage("assistant", responseMessage);
      } catch (error) {
        // Clear spinner on error
        process.stdout.write("\r" + " ".repeat(30) + "\r");
        displayMessage(
          "system",
          `Error: ${error instanceof Error ? error.message : "Unknown error occurred"}`
        );
      }

      console.log(); // Add spacing
      askQuestion();
    });
  };

  askQuestion();
}

// Handle graceful shutdown
process.on("SIGINT", () => {
  console.log(
    `\n${colors.yellow}Received interrupt signal. Exiting gracefully...${colors.reset}`
  );
  rl.close();
  process.exit(0);
});

// Start the chat
if (require.main === module) {
  startChat().catch((error) => {
    console.error(`${colors.red}Failed to start chat:${colors.reset}`, error);
    process.exit(1);
  });
}

export { startChat };
