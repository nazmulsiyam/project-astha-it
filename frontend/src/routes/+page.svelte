<!-- <h1 class="text-red-500 text-4xl">Welcome to SvelteKit</h1>
<p>Visit <a href="https://svelte.dev/docs/kit">svelte.dev/docs/kit</a> to read the documentation</p> -->


<script>
    import { createEventDispatcher } from 'svelte';
  
    let religionName = '';
    let religionDescription = '';
    const dispatch = createEventDispatcher();
  
    const createReligion = () => {
      if (religionName.trim() && religionDescription.trim()) {
        dispatch('create', { name: religionName, description: religionDescription });
        religionName = '';
        religionDescription = '';
      }
    };
  </script>
  
  <div class="flex justify-center items-center min-h-screen bg-gray-100">
    <div class="w-full max-w-md p-6 bg-white shadow-lg rounded-2xl">
      <h1 class="text-xl font-semibold text-gray-800 mb-4">Create a New Religion</h1>
  
      <div class="mb-4">
        <label for="religionName" class="block text-sm font-medium text-gray-700">Religion Name</label>
        <input
          id="religionName"
          type="text"
          bind:value={religionName}
          placeholder="Enter religion name"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>
  
      <div class="mb-4">
        <label for="religionDescription" class="block text-sm font-medium text-gray-700">Description</label>
        <textarea
          id="religionDescription"
          bind:value={religionDescription}
          placeholder="Enter description"
          rows="4"
          class="mt-1 block w-full p-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500"
        ></textarea>
      </div>
  
      <button
        on:click={createReligion}
        class="w-full px-4 py-2 bg-blue-500 text-white font-semibold rounded-lg shadow hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
      >
        Create Religion
      </button>
    </div>
  </div>
  
  <style>
    /* Custom styling can be added here if needed */
  </style>
  