import { z } from 'zod'

const model = "llama3.2"
const inputText = process.argv.slice(2).join(' ') || "Jane, age 29, Toronto, likes hiking and cooking."

const personSchema = z.object({
    name: z.string().min(1),
    age: z.number().int().min(0).max(150),
    city: z.string().min(1),
    hobbies: z.array(z.string().min(1)).max(5)
})

const prompt = `Take the following text and extract a person profile. Return ONLY valid JSON with no additional text before or after, use this exact template:
{
    "name": <string>,
    "age": <number>,
    "city": <string>,
    "hobbies": <list of strings>,
}

Remember that age could potentially be given by the use in months, but should always be stored in the JSON object as years (rounded if necessary).

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

    try {
        const validatedPerson = personSchema.parse(parsed)
        console.log(validatedPerson)
    } catch {
        console.log("I wasn't able to create a person record, I'm missing some information.")
    }
    
}

runQuery()