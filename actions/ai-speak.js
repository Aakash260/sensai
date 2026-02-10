"use server";

import { db } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { GoogleGenerativeAI } from "@google/generative-ai";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = genAI.getGenerativeModel({ model: process.env.MODEL });

export async function generateQuestionToSpeak() {
  const { userId } = await auth();
  if (!userId) throw new Error("Unauthorized");

  const user = await db.user.findUnique({
    where: { clerkUserId: userId },
    select: {
      industry: true,
      skills: true,
    },
  });

  if (!user) throw new Error("User not found");

  const prompt = `
  Generate 10 technical interview questions for a ${
    user.industry
  } professional${
    user.skills?.length ? ` with expertise in ${user.skills.join(", ")}` : ""
  }.

  Each question should require a detailed, written answer (not multiple choice).

  Return the response in this JSON format only, no additional text:
  {
    "questions": [
      {
        "question": "string",
        "answer": "string",
        "explanation": "string"
      }
    ]
  }
`;

  try {
    const result = await model.generateContent(prompt);
    const response = result.response;
    const text = response.text();

    const cleanedText = text.replace(/```(?:json)?\n?/g, "").trim();
    const quiz = JSON.parse(cleanedText);

    return quiz.questions;
  } catch (error) {
    console.error("Error generating quiz:", error);
    throw new Error("Failed to generate quiz questions");
  }
}
