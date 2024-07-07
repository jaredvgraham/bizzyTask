const express = require("express");
const http = require("http");
const socketIo = require("socket.io");
const cors = require("cors");
const dotenv = require("dotenv");
const { OpenAI } = require("openai");

dotenv.config();

const openai = new OpenAI({ apiKey: process.env.NEXT_PUBLIC_OPENAI_API_KEY });

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "https://bizzytask.onrender.com",
    methods: ["GET", "POST"],
  },
});

app.use(cors());
app.use(express.json());

io.on("connection", (socket) => {
  console.log("A user connected");

  socket.on("ADD_TASK", (data) => {
    console.log("New task added: ", data);
    socket.broadcast.emit("TASK_ADDED", data);
  });

  socket.on("UPDATE_TASK", (data) => {
    console.log("Task updated: ", data);
    socket.broadcast.emit("TASK_UPDATED", data);
  });

  socket.on("DELETE_TASK", (data) => {
    console.log("Task deleted: ", data);
    socket.broadcast.emit("TASK_DELETED", data);
  });

  socket.on("ADD_CATEGORY", (data) => {
    console.log("New category added: ", data);
    socket.broadcast.emit("CATEGORY_ADDED", data);
  });

  socket.on("UPDATE_CATEGORY", (data) => {
    console.log("Category updated: ", data);
    socket.broadcast.emit("CATEGORY_UPDATED", data);
  });

  socket.on("DELETE_CATEGORY", (data) => {
    console.log("Category deleted: ", data);
    socket.broadcast.emit("CATEGORY_DELETED", data);
  });

  socket.on("disconnect", () => {
    console.log("User disconnected");
  });
});

const generateTemplate = async (businessType, description) => {
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

    console.log("Response text: ", responseText);
    const jsonResponseMatch = responseText?.match(/\{[\s\S]*\}/);
    if (jsonResponseMatch) {
      const jsonResponse = jsonResponseMatch[0];
      console.log("JSON response: ", jsonResponse);
      return JSON.parse(jsonResponse);
    } else {
      throw new Error("No JSON response found");
    }
  } catch (error) {
    console.error("Error generating template: ", error);
    throw error;
  }
};

app.post("/api/chatgpt", async (req, res) => {
  const { type, description } = req.body;

  try {
    const response = await generateTemplate(type, description);
    res.status(200).json(response);
  } catch (error) {
    console.error("Error generating template: ", error);
    res.status(500).json({ error: "Failed to process the request" });
  }
});

const PORT = process.env.PORT || 3003;
server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
