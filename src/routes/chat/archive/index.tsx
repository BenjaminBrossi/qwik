import { component$ } from "@builder.io/qwik";
import {
  routeLoader$,
  server$,
  useNavigate,
  type DocumentHead,
} from "@builder.io/qwik-city";
import { MongoClient } from "mongodb";
import { useAuthSession, useAuthSignout } from "~/routes/plugin@auth";

export const useArchive = routeLoader$<string[]>(async (requestEvent) => {
  const session = requestEvent.sharedMap.get("session");

  const uri = requestEvent.env.get("MONGO_DB") || "";
  const client = new MongoClient(uri);

  const database = client.db("qwik");
  const archive = database.collection("archive");

  const jokes = await (await archive.find({ email: session.user.email }))
    .map((joke) => joke.joke)
    .toArray();
  client.close();
  return jokes;
});

export const emptyArchive = server$(async function (email: string) {
  const uri = this.env.get("MONGO_DB") || "";
  const client = new MongoClient(uri);

  const database = client.db("qwik");
  const archive = database.collection("archive");

  archive.deleteMany({ email });
  client.close();
  return true;
});

export default component$(() => {
  const archive = useArchive();
  const { submit } = useAuthSignout();
  const { value } = useAuthSession();
  const nav = useNavigate();

  return (
    <div class="flex flex-col justify-between">
      <div class="my-4 max-h-[65vh] min-h-[20rem] flex-1 overflow-scroll rounded-md bg-slate-50 p-4">
        {archive.value.map((joke) => (
          <div key={`${joke}`} class={`chat chat-start`}>
            <div class={`chat-bubble chat-bubble-primary whitespace-pre-line`}>
              {joke}
            </div>
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
          class="btn btn-error"
          onClick$={async () => {
            emptyArchive(value?.user?.email || "");
            nav("/chat/archive", { forceReload: true });
          }}
        >
          Empty archive
        </button>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Archive",
};
