import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

export const generateTemplate = async (
  businessType: string,
  description: string
) => {
  console.log("Generating at chatGPT function:", businessType, description);

  const prompt = `
    I need a template for a new business. The business type is "${businessType}", and here is a brief description: "${description}". 
    Please provide a structured JSON response with categories and tasks. Each task should have a name and description. 
    Example:
    {
      "categories": [
        {
          "name": "Frontend",
          "tasks": [
            {
              "name": "example task",
              "description": "some description"
            },
            {
              "name": "another task",
              "description": "some description"
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
          content: `You are a professional business consultant who is creating a business plan for a new business. The business type is "${businessType}", and the description is "${description}".`,
        },
        {
          role: "user",
          content: prompt,
        },
      ],
    });
    // console.log(response.choices[0].message.content);

    // console.log("token count: ", response.usage?.total_tokens);

    // const template = response.choices[0].message.content?.trim();
    // return template;

    const responseText = response.choices[0].message.content?.trim();
    console.log("Response from ChatGPT:", responseText);

    // Use a regular expression to extract the JSON part of the response
    const jsonResponseMatch = responseText?.match(/\{[\s\S]*\}/);
    if (jsonResponseMatch) {
      const jsonResponse = jsonResponseMatch[0];
      return JSON.parse(jsonResponse); // Parse the JSON directly here
    } else {
      throw new Error("No JSON response found");
    }
  } catch (error) {
    console.error("Error generating template: ", error);
    throw error;
  }
};
