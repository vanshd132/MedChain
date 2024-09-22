import { GoogleGenerativeAI } from '@google/generative-ai';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

export const PresController = async (req, res) => {
  const { userInput } = req.body;

  try {
    const model = await genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const promptWithContext = `
      You are an AI analyzing medical reports from OCR-processed images.
      The text may include irrelevant data like headers or footers, so focus on the key medical details.
      try to keep ur summary short. but useful, in a way that its easy for a common man to understand.whats in report in detail
      Here is the report text: ${userInput}
    `;

    const result = await model.generateContent(promptWithContext);
    const aiResponse = result.response.text();

    // Send AI response
    res.json({ ai: aiResponse });
  } catch (error) {
    console.error('Error generating content:', error);
    res.status(500).send('Error generating content.');
  }
};


