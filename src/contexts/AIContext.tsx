import React, { createContext, useContext, useState, ReactNode } from "react";
import { GoogleGenAI } from "@google/genai";

interface Message {
    role: "user" | "model";
    content: string;
}

interface AIContextType {
    messages: Message[];
    sendMessage: (message: string) => Promise<void>;
    generateContent: (prompt: string) => Promise<string>;
    isThinking: boolean;
    clearHistory: () => void;
}

const AIContext = createContext<AIContextType | undefined>(undefined);

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY || "";
const ai = new GoogleGenAI({ apiKey: API_KEY });

export const AIProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [isThinking, setIsThinking] = useState(false);

    const sendMessage = async (content: string) => {
        if (!API_KEY) {
            console.error("Gemini API key is missing. Please add VITE_GEMINI_API_KEY to your .env file.");
            return;
        }

        try {
            setIsThinking(true);
            const newUserMessage: Message = { role: "user", content };
            // Update local state immediately for UI responsiveness
            const newHistory = [...messages, newUserMessage];
            setMessages(newHistory);

            // Construct conversation history for the API
            const formattedHistory = newHistory.map(m => ({
                role: m.role,
                parts: [{ text: m.content }]
            }));

            // Add system instruction as the first message or configure it if the SDK supports it differently. 
            // For this SDK/model combination, we'll try passing it as config if possible, 
            // but for now, let's stick to the user's generateContent pattern. 
            // Note: detailed chat history management with the new SDK might differ. 
            // We will pass the full history as 'contents'.

            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                config: {
                    systemInstruction: "You are the TaskFlow Agent, a highly efficient AI assistant for project management. You help users manage projects, tasks, and teams. You are proactive, professional, and friendly. When asked to generate visual items (charts, task lists), ALWAYS output them as a single code block with the language tag 'c1' (e.g., ```c1 ... ```). Use the Thesys C1 DSL format for these blocks."
                },
                contents: formattedHistory
            });

            const responseText = response.text;

            if (responseText) {
                const newModelMessage: Message = { role: "model", content: responseText };
                setMessages((prev) => [...prev, newModelMessage]);
            }
        } catch (error) {
            console.error("Error sending message to Gemini:", error);
            // Fallback: try with gemini-2.0-flash-exp if 3 fails? 
            // The user code snippet showed "gemini-2.0-flash-exp" is common for these newer SDKs, 
            // but the text said "gemini-3-flash-preview". 
            // I will strictly follow the user's text instruction: "gemini-3-flash-preview".
            // WAIT - I see the user request "Use the gemini-3-flash-preview model". 
            // I will use THAT.
        } finally {
            setIsThinking(false);
        }
    };

    const generateContent = async (prompt: string): Promise<string> => {
        if (!API_KEY) {
            console.error("Gemini API key is missing.");
            return "";
        }
        try {
            const response = await ai.models.generateContent({
                model: "gemini-3-flash-preview",
                contents: prompt,
            });
            return response.text || "";
        } catch (error) {
            console.error("Error generating content:", error);
            return "";
        }
    };

    const clearHistory = () => {
        setMessages([]);
    };

    return (
        <AIContext.Provider value={{ messages, sendMessage, generateContent, isThinking, clearHistory }}>
            {children}
        </AIContext.Provider>
    );
};

export const useAI = () => {
    const context = useContext(AIContext);
    if (context === undefined) {
        throw new Error("useAI must be used within an AIProvider");
    }
    return context;
};
