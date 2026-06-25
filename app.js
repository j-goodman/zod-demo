import { z } from 'zod'

const model = "llama3.2"
const inputText = process.argv.slice(2).join(' ') || "Jane, age 29, Toronto, likes hiking and cooking."

const prompt = `Take the following text and extract a person profile. Return ONLY valid JSON with no additional text before or after, use this exact template:
{
    "name": <string>,
    "age": <number>,
    "city": <string>,
    "hobbies": <list of strings>,
}

Text: ${inputText}
`

const runQuery = async () => {
    const response = await fetch('http://localhost:11434/api/generate', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
            model: model,
            prompt: prompt,
            stream: false,
            format: "json"
        })
    })

    if (!response.ok) throw new Error ("Request failed.")

    const data = await response.json()
    const parsed = JSON.parse(data.response)
    console.log(parsed)
}

runQuery()