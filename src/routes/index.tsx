import { component$ } from "@builder.io/qwik";
import type { DocumentHead } from "@builder.io/qwik-city";
import { useAuthSignin } from "./plugin@auth";

export default component$(() => {
  const { submit } = useAuthSignin();
  return (
    <div class="prose bg-accent mx-auto w-96">
      <h1 class="">Chat</h1>
      <p class="text-red-500">Please sign in</p>
      <button
        class="btn btn-primary"
        onClick$={() => submit({ providerId: "google" })}
      >
        signin
      </button>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
