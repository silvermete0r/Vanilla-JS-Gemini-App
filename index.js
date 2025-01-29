import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "./config.js";

const sendMessage = document.querySelector(".chat-input span");
const chatInput = document.querySelector(".chat-input textarea");
const chatbox = document.querySelector(".chatbox");
const chatbotToggler = document.querySelector(".chatbot-toggler");

let userMessage;

// Gemini API Configuration
const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

const chat = model.startChat({
  history: [],
  generationConfig: {
    maxOutputTokens: 100, // Increased token limit for longer responses
    temperature: 0.7,     // Added temperature for more creative responses
  },
});

const createChatLi = (message, className) => {
  const chatLi = document.createElement("li");
  chatLi.classList.add("chat", className);
  let chatContent = className == "incoming" ? `<span class="material-symbols-outlined">smart_toy</span><p>${message}</p>` : `<p>${message}</p>`;
  chatLi.innerHTML = chatContent;
  return chatLi;
};

const generateResponse = async (chatLi) => {
  try {
    const result = await chat.sendMessage(userMessage);
    const msg = result.response.candidates[0].content.parts[0].text;
    chatLi.innerHTML = `<span class="material-symbols-outlined">smart_toy</span><p>${msg}</p>`;
  } catch (error) {
    chatLi.innerHTML = `<span class="material-symbols-outlined">error</span><p>Oops! Something went wrong. Please try again.</p>`;
    console.error("Error:", error);
  }
};

const handleChat = () => {
  userMessage = chatInput.value.trim();
  if (!userMessage) return;

  chatInput.value = "";
  chatbox.appendChild(createChatLi(userMessage, "outgoing"));
  chatbox.scrollTo(0, chatbox.scrollHeight);

  setTimeout(() => {
    const incomingChatLi = createChatLi("Thinking...", "incoming");
    chatbox.appendChild(incomingChatLi);
    chatbox.scrollTo(0, chatbox.scrollHeight);
    generateResponse(incomingChatLi);
  }, 600);
};

chatInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    handleChat();
  }
});

sendMessage.addEventListener("click", handleChat);
chatbotToggler.addEventListener("click", () =>
  document.body.classList.toggle("show-chatbot")
);
