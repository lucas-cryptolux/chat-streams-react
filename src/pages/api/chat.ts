import { streamToResponse } from "ai";
import { type NextApiRequest, type NextApiResponse } from "next";

const fakeChat =
  "Streaming conversational text UIs (like ChatGPT) have gained massive popularity over the past few months. This section will explore the benefits and drawbacks of streaming and blocking interfaces and how to implement them using the Vercel AI SDK. Large Language Models (LLMs) are extremely powerful. However, when generating long outputs, they can be very slow compared to the latency you're likely used to. If you try to build a traditional blocking UI, your users might easily find themselves staring at loading spinners for 5, 10, even up to 40s waiting for the entire LLM response to be generated. This can lead to a poor user experience, especially in conversational applications like chatbots. Streaming UIs can help mitigate this issue by displaying parts of the response as they become available.";

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  // Create a variable to store the current character index
  let char = 0;

  const fakeStream = new ReadableStream({
    start(controller) {
      async function enqueueCharacter() {
        if (char >= fakeChat.length) {
          controller.close();
          return;
        }

        controller.enqueue(fakeChat[char]);
        char += 1;

        await new Promise((resolve) => setTimeout(resolve, 10));

        void enqueueCharacter();
      }

      void enqueueCharacter();
    },
  });

  /**
   * Converts the stream to a Node.js Response-like object
   */
  return streamToResponse(fakeStream, res);
}
