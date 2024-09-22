import { GoogleGenerativeAI } from "@google/generative-ai";
import axios from 'axios'


const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = await genAI.getGenerativeModel({ model: "gemini-1.5-flash" });


export const chatbotController = async (req, res) => {
    const userInput = req.body.prompt;

    try {
        const response = await axios.get("http://localhost:4000/hospitals");

        // Extract relevant fields from each hospital and stringify the data
        const extractedHospitals = response.data
            .filter(hospital => hospital.hospitalname)  
            .map(hospital => ({
                hospitalname: hospital.hospitalname,
                address: hospital.address,
                doctors: hospital.doctors
            }));

        // Stringify the extracted hospital data
        const hospitalDataString = JSON.stringify(extractedHospitals);
        



        const promptWithContext = `
        You are a chatbot with access to the following hospital data. Use this data to answer questions related to hospitals
        If the user's query is unrelated to this data, respond as a general AI chatbot. Here is the hospital data:
        
        ${hospitalDataString}
        
Ventilator Beds: Total: 40, Occupied: 30

        User input: ${userInput}`;

        // Generate AI response
        const result = await model.generateContent(promptWithContext);
        const aiResponse = result.response.text();



        // Send JSON response
        res.json({ user: userInput, ai: aiResponse });
    } catch (error) {
        console.error('Error generating content:', error);
        res.status(500).send('Error generating content.');
    }
};