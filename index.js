const express = require("express");
const app = express();
const cors = require("cors");
const OpenAIApi = require("openai");
const { Octokit } = require("@octokit/core");
require("dotenv").config();

app.use(express.json());
app.use(cors());

app.get("/", (req, res) => {
  res.status(200).send("Welcome to Code-Converter");
});

const openai = new OpenAIApi({
  apiKey: process.env.OPENAI_API_KEY,
});

// code conversion code here
app.post("/convert", async (req, res) => {
  let { code, language } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a helpful code conversion assistant.",
        },
        {
          role: "user",
          content: `Convert the following code into ${language}: ${code}`,
        },
      ],
      temperature: 1,
      max_tokens: 300,
      top_p: 1,
      frequency_penalty: 1,
      presence_penalty: 1,
    });

    console.log(response.choices[0].message.content);
    res.status(200).send({ msg: response.choices[0].message.content });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

// debugging code here
app.post("/debug", async (req, res) => {
  let { code } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a code debugging assistant.",
        },
        {
          role: "user",
          content: `Debug the following code:\n\n${code}`,
        },
      ],
      temperature: 1,
      max_tokens: 220,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });

    res.status(200).send({ msg: response.choices[0].message.content });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

// qualitycheck code here 
app.post("/qualitycheck", async (req, res) => {
  let { code } = req.body;
  try {
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        {
          role: "system",
          content: "You are a code quality checking assistant",
        },
        {
          role: "user",
          content: `Please do the quality check of given code. Keep the reponse in given format.
            Format: 
            "
            Summary :
            
            1. Code Consistency :
            2. Code Performance : 
            3. Code Documentation :
            4. Error Handling: 
            "
            So score each criteria from out of 100 percent.

            ****

            Summary:
            refers to the overall feedback on quality check.

            Code Consistency: 
            ***
            refers to checking for indusrty level coding style such as naming conventions, duplication, code formatting.
            ###
            Code Performance:
            ***
            refers to where the code includes optimized algorithms or data structures.
            ###
            Code Documentation:
            ***
            refers to checking if the code contains proper comments/documentation or not.
            ###
            Error Handling:
            ***
            refers to check for whether the code handle errors or not.
            ###
            *Note: Provide the response in the format which I have provided with proper markdown language. Provide spaces between each criteria.*


            ###
            Code : ${code}`,
        },
      ],
      temperature: 1.3,
      max_tokens: 350,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    });
    res.setHeader("Content-Type", "text/html");
    res.status(200).send({ msg: response.choices[0].message.content });
  } catch (error) {
    res.status(400).send({ error: error });
  }
});

app.listen(3030, () => {
  console.log("Server is live at Port 3030");
});