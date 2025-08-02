import { transcribeAudio } from "../../src/services/transcribe.service";
import fetch from "node-fetch";
import FormData from "form-data";

jest.mock("node-fetch");
const { Response } = jest.requireActual("node-fetch");

describe("transcribeAudio", () => {
  it("should call OpenAI and return text on success", async () => {
    const fakeJson = { text: "hello world" };
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response(JSON.stringify(fakeJson), { status: 200 })
    );

    const buffer = Buffer.from("audio");
    const result = await transcribeAudio(buffer, "file.wav", "audio/wav");
    expect(result).toBe("hello world");
  });

  it("should throw if API returns non-ok", async () => {
    (fetch as jest.MockedFunction<typeof fetch>).mockResolvedValueOnce(
      new Response("error", { status: 500 })
    );

    await expect(
      transcribeAudio(Buffer.from(""), "f.wav", "audio/wav")
    ).rejects.toThrow(/Whisper API error 500/);
  });
});