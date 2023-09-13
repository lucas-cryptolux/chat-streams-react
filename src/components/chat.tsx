import React from "react";
import dynamic from "next/dynamic";

const Root: React.FC = () => {
  const [message, setMessage] = React.useState<string | null>(null);

  React.useEffect(() => {
    void fetch("/api/chat", {})
      .then((response) => response.body)
      .then((body) => {
        const reader = body?.getReader();
        if (reader === undefined) {
          console.log("No reader");
          return;
        }

        const decoder = new TextDecoder();

        return new ReadableStream({
          start(controller) {
            // The following function handles each data chunk
            function push() {
              void reader!.read().then(({ done, value }) => {
                // Is there no more data to read?
                if (done) {
                  controller.close();
                  return;
                }

                controller.enqueue(value);
                push();

                const text = decoder.decode(value);
                setMessage((message) =>
                  message !== null ? `${message}${text}` : text,
                );
              });
            }

            push();
          },
        });
      });
  }, []);

  return (
    <>
      <h1 className="text-white">Stream</h1>

      {message !== null && <p className="max-w-2xl text-white">{message}</p>}
    </>
  );
};

export const Chat = dynamic(() => Promise.resolve(Root), {
  ssr: false,
});
