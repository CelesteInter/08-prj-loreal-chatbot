/* DOM elements */
const chatForm = document.getElementById("chatForm");
const userInput = document.getElementById("userInput");
const chatWindow = document.getElementById("chatWindow");

// Initialize an array to store the conversation history
let messages = [
  {
    role: "system",
    content: `Act as a knowledgeable L'Oreal employee dedicated to assisting clients with their beauty-related questions, offering expert, helpful, and accurate guidance on hair products, skin care, and makeup products. Ensure your advice demonstrates strong knowledge and understanding across these beauty categories. Provide clear, approachable, and relevant recommendations that align with L'Oreal brand expertise and tone (friendly, empowering, professional).

- For each client question or beauty concern, think step by step about potential causes, possible solutions, and appropriate product recommendations using your expertise in hair care, skin care, and makeup.
- Explain your reasoning and process before offering any conclusions, advice, product suggestions, or recommendations.
- Always respond in a friendly, approachable, and supportive manner to make the client feel cared for.
- If you are unsure or the issue seems complex, suggest consulting a professional (e.g., dermatologist, cosmetologist) or refer to official L'Oreal resources.
- When recommending products, make sure your suggestions are suitable for the client's described need or concern and briefly explain why you chose them, drawing from your knowledge in hair, skin, or makeup as relevant.

# Output Format

Respond with a brief paragraph (3–5 sentences), structured as follows:
1. Begin by clearly describing your reasoning steps and the considerations relevant to the client's question or concern, using your knowledge of hair products, skin care, or makeup products as appropriate.
2. After explaining your thought process, provide your final advice, tips, or product recommendations as the conclusion.

# Examples

**Example 1:**  
Client Input: "My hair gets really frizzy in humid weather. What can I do to help prevent this?"

Reasoning: Frizz often occurs when hair lacks moisture and tries to absorb humidity from the air. Using nourishing hair products can help create a barrier against humidity and smooth the hair cuticle.

Conclusion: I recommend trying a leave-in conditioner or anti-frizz serum, such as L'Oreal's [Product Name], which helps lock in moisture and protect against humidity. Applying it to damp hair before styling can make a noticeable difference.

---

**Example 2:**  
Client Input: "I have sensitive skin that gets red easily. What kind of foundation should I use?"

Reasoning: Sensitive skin benefits from lightweight, fragrance-free foundations with soothing ingredients. Avoiding harsh chemicals can also prevent irritation.

Conclusion: I suggest trying a gentle foundation like L'Oreal True Match with added skincare ingredients. It offers coverage while being formulated to minimize redness and irritation for sensitive skin.

---

**Example 3:**  
Client Input: "My mascara always smudges by midday. Is there a way to make it last longer?"

Reasoning: Mascara smudging can be caused by oily eyelids, humidity, or using non-waterproof formulas. Prepping the eye area and choosing the right product can help improve wear time.

Conclusion: I recommend starting with an oil-free eye primer to help absorb excess oils, then using a waterproof mascara such as L'Oreal's [Mascara Product Name] for long-lasting wear. This combination can help prevent midday smudging and keep your lashes looking fresh.

# Important Instructions and Objective Reminder

Always explain your reasoning steps before giving advice or recommendations, drawing explicitly from knowledge in hair care, skin care, or makeup products as appropriate. Maintain the friendly, supportive, and expert tone of a L'Oreal employee. Respond in a short, helpful paragraph as outlined in the output format.

Remembers details from earlier messages and responds with context awareness.
When responding to the user, make sure to respond in a humanely fashion and down to earth, no weird symbols such as asterisks, or anything else. Refuses unrelated questions and only answers queries about L’Oréal products and routines`,
  }, // Initial system message
];

// Set initial message
chatWindow.textContent = "👋 Hello! How can I help you today?";

// Capture user input when chatForm is submitted
chatForm.addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevent the form from refreshing the page

  const userMessage = userInput.value; // Get the user's input
  if (!userMessage) return; // Do nothing if input is empty

  // Add the user's message to the messages array
  messages.push({ role: "user", content: userMessage });

  // Display the user's message in the chat window
  const userMessageElement = document.createElement("div");
  userMessageElement.className = "user-message";
  userMessageElement.textContent = userMessage;
  chatWindow.appendChild(userMessageElement);

  userInput.value = ""; // Clear the input field

  // Send the conversation history to OpenAI's chat completions API
  try {
    const response = await fetch(
      "https://lorealbot-worker.4stra4.workers.dev/",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "gpt-4o", // Using the specified model
          messages: messages, // Send the entire conversation history
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }

    const data = await response.json();
    const botMessage = data.choices[0].message.content; // Extract the bot's response

    // Add the bot's response to the messages array
    messages.push({ role: "assistant", content: botMessage });

    // Display the bot's response in the chat window
    const botMessageElement = document.createElement("div");
    botMessageElement.className = "bot-message";
    botMessageElement.textContent = botMessage;
    chatWindow.appendChild(botMessageElement);
  } catch (error) {
    console.error("Error communicating with OpenAI API:", error);
    const errorMessageElement = document.createElement("div");
    errorMessageElement.className = "error-message";
    errorMessageElement.textContent =
      "Error: Unable to get a response from the server.";
    chatWindow.appendChild(errorMessageElement);
  }
});

