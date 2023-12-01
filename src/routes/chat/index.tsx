import { component$, useStore } from "@builder.io/qwik";
import { server$, type DocumentHead } from "@builder.io/qwik-city";
import { MongoClient } from "mongodb";
import { useAuthSession, useAuthSignout } from "../plugin@auth";

export const getJoke = server$(async () => {
  const url = new URL("https://official-joke-api.appspot.com/random_joke");

  const resp = await fetch(url);
  const json = (await resp.json()) as {
    type: string;
    setup: string;
    punchline: string;
  };

  return json;
});

export const saveJoke = server$(async function (email: string, joke: string) {
  const uri = this.env.get("MONGO_DB") || "";
  const client = new MongoClient(uri);

  const database = client.db("qwik");
  const archive = database.collection("archive");

  archive.insertOne({ email, joke });
  client.close();
  return true;
});

export default component$(() => {
  const { submit } = useAuthSignout();
  const { value } = useAuthSession();

  const chatHistory = useStore<{
    list: { author: string; text: string }[];
  }>({
    list: [],
  });

  return (
    <div class="flex flex-col justify-between">
      <div class="my-4 max-h-[65vh] min-h-[20rem] flex-1 overflow-scroll rounded-md bg-slate-50 p-4">
        {chatHistory.list.map(({ author, text }) => (
          <div
            key={`${author}${text}`}
            class={`chat ${author === "cpu" ? "chat-start" : "chat-end"}`}
          >
            <div
              class={`chat-bubble whitespace-pre-line ${
                author === "cpu" ? "chat-bubble-primary" : "chat-bubble-accent"
              }`}
            >
              {text}
            </div>
            {author === "cpu" && (
              <div class="chat-footer opacity-50">
                <button
                  class="btn btn-link text-primary-content m-0 h-3 min-h-0 border-0 p-0"
                  onClick$={async () =>
                    await saveJoke(value?.user?.email || "", text)
                  }
                >
                  save
                </button>
              </div>
            )}
          </div>
        ))}
      </div>
      <div class="flex justify-end gap-4">
        <button
          class="btn btn-warning"
          onClick$={() => submit({ callbackUrl: "/" })}
        >
          Logout
        </button>
        <button
          class="btn btn-primary"
          onClick$={async () => {
            chatHistory.list.push({ author: "me", text: "Tell me a joke" });
            const { setup, punchline } = await getJoke();
            chatHistory.list.push({
              author: "cpu",
              text: `${setup}\n${punchline}`,
            });
          }}
        >
          Tell me a joke
        </button>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Chat",
};
