<script lang="ts">
  import TodoList from "$lib/TodoList.svelte";
</script>

<main class="max-w-sm mx-auto">
  <header class="mt-12 mb-8">
    <h1 class="text-6xl text-blue-500 font-bold text-center mb-4">Todo</h1>
    <h2 class="text-gray-500 text-center">
      A simple todo list created with SvelteKit + Tailwind
    </h2>
  </header>

  <TodoList />
</main>
