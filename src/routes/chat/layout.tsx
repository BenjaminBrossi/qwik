import type { Session } from "@auth/core/types";
import { component$, Slot } from "@builder.io/qwik";
import { useLocation, type RequestHandler } from "@builder.io/qwik-city";
import { useAuthSession } from "../plugin@auth";

export const onRequest: RequestHandler = (event) => {
  const session: Session | null = event.sharedMap.get("session");
  if (!session || new Date(session.expires) < new Date()) {
    throw event.redirect(
      302,
      `/api/auth/signin?callbackUrl=${event.url.pathname}`,
    );
  }
};

export default component$(() => {
  const { value } = useAuthSession();

  const { url } = useLocation();

  return (
    <div class="h-screen max-h-screen overflow-hidden py-10">
      <div class="prose text-neutral-content mx-auto flex max-h-full flex-col rounded-md bg-amber-100 p-4">
        <div class="flex justify-between">
          <h1>Private</h1>
          <figcaption>{value?.user?.name}</figcaption>
        </div>
        <div role="tablist" class="tabs tabs-boxed">
          <a
            role="tab"
            href="/chat"
            class={`tab no-underline ${
              !url.pathname.includes("archive") ? "tab-active" : ""
            }`}
          >
            Chat
          </a>
          <a
            role="tab"
            href="/chat/archive"
            class={`tab no-underline ${
              url.pathname.includes("archive") ? "tab-active" : ""
            }`}
          >
            Archive
          </a>
        </div>
        <div class="max-h-full flex-auto overflow-hidden">
          <Slot />
        </div>
      </div>
    </div>
  );
});
