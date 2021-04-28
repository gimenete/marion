<script lang="ts">
  import { onMount } from "svelte";
  import Loader from "$lib/Loader.svelte";
  import { fetcher } from "../fetcher";
  import type { AppState } from "../types";

  let state: AppState | null = null;
  let error: string | null = null;

  $: serializedEnvs = JSON.stringify(state?.envs ?? {}, null, 2);

  const fetchAppState = async () => {
    error = null;
    try {
      state = await fetcher("/state");
    } catch (e) {
      error = e.message;
    }
  };

  onMount(async () => {
    fetchAppState();

    // Poll app state
    setInterval(() => fetchAppState(), 5000);
  });

  let memAmountMB = "100";
  let memDuration = "2";
  let cpuDuration = "2";

  const eatMemory = async () => {
    if (!memAmountMB || !memDuration) {
      error = "Amount and duration required";
      return;
    }

    try {
      state = await fetcher("/memory", {
        method: "POST",
        body: JSON.stringify({
          amount: parseInt(memAmountMB),
          duration: parseInt(memDuration),
        }),
      });
      error = null;
    } catch (e) {
      error = e.message;
    }
  };

  const burnCPU = async () => {
    if (!cpuDuration) {
      error = "Duration required";
      return;
    }

    try {
      error = null;
      state = await fetcher("/cpu", {
        method: "POST",
        body: JSON.stringify({ duration: parseInt(cpuDuration) }),
      });
    } catch (e) {
      error = e.message;
    }
  };

  const cancelCurrentAction = async () => {
    try {
      error = null;
      state = await fetcher("/cancel", {
        method: "POST",
      });
    } catch (e) {
      error = e.message;
    }
  };
</script>

<main class="max-w-xl  mx-auto px-4 space-y-8">
  <header class="mt-12 mb-8">
    <h1 class="text-3xl font-bold text-pink-600 mb-2">Marion</h1>
    {#if state != null}
      <h2 class="text-sm text-gray-500">Started on {state.startDate}</h2>
    {/if}
  </header>

  {#if error != null}
    <div class="p-4 border-2 border-red-500 rounded  text-red-600">
      {error}
    </div>
  {/if}

  {#if state != null}
    <div class="environment-variables">
      <h3 class="font-bold text-lg mb-4 text-gray-800">
        Environment Variables
      </h3>
      <pre class="text-sm text-indigo-800">
      {serializedEnvs}
    </pre>
    </div>

    <div class="actions">
      <h3 class="font-bold text-lg mb-2 text-gray-800">Actions</h3>

      <div class="mb-4">
        <div class="flex items-center space-x-4 mb-2">
          <p class="text-gray-500 text-sm">
            Current state: <span class="text-green-600 font-medium"
              >{state.actionState.type}</span
            >
          </p>

          {#if state.actionState.type !== "idle"}
            <Loader />
          {/if}
        </div>

        {#if state.actionState.type !== "idle"}
          <button
            class="bg-gray-500 max-w-max text-sm"
            on:click={cancelCurrentAction}>Cancel Current Action</button
          >
        {/if}
      </div>

      <div class="grid gap-4 grid-cols-1 md:grid-cols-2">
        <form
          class="memory p-4 border border-blue-500 rounded-sm space-y-2"
          on:submit|preventDefault={eatMemory}
        >
          <h4 class="font-medium mb-2">Eat Memory</h4>

          <div>
            <label for="duration">Duration in seconds</label>
            <input name="duration" placeholder="2" bind:value={memDuration} />
          </div>

          <div>
            <label for="amount">MB to eat</label>
            <input name="amount" placeholder="500" bind:value={memAmountMB} />
          </div>

          <button>Eat</button>
        </form>

        <form
          class="cpu flex flex-col p-4 border border-blue-500 rounded-sm"
          on:submit|preventDefault={burnCPU}
        >
          <h4 class="font-medium mb-2">Burn CPU</h4>

          <div>
            <label for="duration">Duration in seconds</label>
            <input name="duration" placeholder="2" bind:value={cpuDuration} />
          </div>

          <button class="mt-auto">Burn</button>
        </form>
      </div>
    </div>
  {/if}
</main>
