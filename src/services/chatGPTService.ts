import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export const generateTemplate = async (
  businessType: string,
  description: string
) => {
  console.log("Generating at chatGPT function:", businessType, description);

  const prompt = `
    I need a template for a new business. The business type is "${businessType}", and here is a brief description: "${description}". 
    Please provide a structured JSON response with categories and tasks. 12-18 categories, and each task should have a name and 3 descriptions. The first description should be a general description for the tasks and the rest sub-tasks. 
    Example if this was a web-app:
     {
    "categories": [
      {
        "name": "Frontend",
        "tasks": [
          {
            "name": "example task",
            "descriptions": [
              "general description",
              "sub-task 1 description",
              "sub-task 2 description"
            ]
          },
          {
            "name": "another task",
            "descriptions": [
              "general description",
              "sub-task 1 description",
              "sub-task 2 description"
            ]
          }
        ]
      },
      {
        "name": "Backend"
      }
    ]
  }
  `;

  try {
    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: `You are a professional business consultant who is creating a business plan for a new business. The business type is "${businessType}", and the description is "${description}. Do not leave out anything that could be valuable for this business".`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });

    const responseText = response.choices[0].message.content?.trim();
    console.log(response.usage?.total_tokens, "tokens used");

    const jsonResponseMatch = responseText?.match(/\{[\s\S]*\}/);
    if (jsonResponseMatch) {
      const jsonResponse = jsonResponseMatch[0];
      return JSON.parse(jsonResponse);
    } else {
      throw new Error("No JSON response found");
    }
  } catch (error) {
    console.error("Error generating template: ", error);
    throw error;
  }
};
