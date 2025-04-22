

const OPENAI_API_KEY = process.env.REACT_APP_OPENAI_API_KEY;

export const getBookSummary = async (bookTitle) => {
  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions",
      {
        method: "POST",
      headers: {
        Authorization: `Bearer ${OPENAI_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "gpt-3.5-turbo",
        messages: [
          {
            role: "system",
            content: "You are a helpful assistant that summarizes books.",
          },
          {
            role: "user",
            content: `Summarize the book "${bookTitle}" in 3 sentences.`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.choices[0].message.content;
  } catch (error) {
    console.error("Error fetching summary from OpenAI:", error.message);
    return "Summary could not be generated.";
  }
};