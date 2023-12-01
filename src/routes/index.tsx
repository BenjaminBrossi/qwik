import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuthSignin } from "./plugin@auth";

export default component$(() => {
  const { submit } = useAuthSignin();
  return (
    <div class="h-screen max-h-screen overflow-hidden py-10">
      <div class="prose mx-auto flex max-h-full flex-col rounded-md bg-amber-100  p-4">
        <div class="flex justify-between">
          <h1 class="">Joke-Chat</h1>
        </div>
        <p class="text-center">Please sign in</p>
        <div class="flex justify-end">
          <button
            class="btn btn-primary"
            onClick$={() => submit({ providerId: "google" })}
          >
            Signin
          </button>
        </div>
      </div>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Qwik demo",
};
