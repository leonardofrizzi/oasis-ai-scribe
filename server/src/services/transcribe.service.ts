import fetch from "node-fetch";
import FormData from "form-data";

const OPENAI_URL = "https://api.openai.com/v1/audio/transcriptions";
const API_KEY = process.env.OPENAI_API_KEY!;

export async function transcribeAudio(
  audioBuffer: Buffer,
  filename: string,
  mimetype: string
): Promise<string> {
  const form = new FormData();
  form.append("file", audioBuffer, { filename, contentType: mimetype });
  form.append("model", "whisper-1");

  const res = await fetch(OPENAI_URL, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${API_KEY}`,
    },
    body: form as any,
  });

  if (!res.ok) {
    const err = await res.text();
    throw new Error(`Whisper failed: ${res.status} ${err}`);
  }
  const data = await res.json();
  return data.text as string;
}