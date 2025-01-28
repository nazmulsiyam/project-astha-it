<script>
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation'; // Correct import for goto in SvelteKit

  let religions = writable([]);
  let loading = writable(true);

  const fetchReligions = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/v1/religion');
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      const data = await response.json();
      religions.set(data);
    } catch (error) {
      console.error('Error fetching religions:', error);
      religions.set([]);
    } finally {
      loading.set(false);
    }
  };

  onMount(() => {
    fetchReligions();
  });

  const handleEdit = (_id) => {
    console.log('Edit:', _id);
    // Add logic to edit religion by _id
  };

  const handleDelete = (_id) => {
    religions.update(current => current.filter(religion => religion._id !== _id));
  };

  const handleCast = (_id) => {
    goto(`/cast/${_id}`); // Navigate to the cast details page
  };

  const handleCreate = () => {
    console.log('Create new religion');
    // Add logic to handle creating a new religion
  };
</script>

<style>
  /* Tailwind's classes handle most of the styling. */
</style>

<div class="container mx-auto p-4">
  <h1 class="text-2xl font-bold mb-4">Religions</h1>
  <div class="flex justify-end mb-2">
    <a href="/cast" class="bg-green-500 text-white cursor-pointer px-4 py-2 rounded" on:click={handleCreate}>Create</a>
  </div>
  <div class="overflow-x-auto">
    <table class="table-auto w-full border border-gray-200">
      <thead>
        <tr class="bg-gray-100 text-left">
          <th class="p-2 border">Name</th>
          <th class="p-2 border">Description</th>
          <th class="p-2 border">Is Active</th>
          <th class="p-2 border">Actions</th>
        </tr>
      </thead>
      <tbody>
        {#if $loading}
          <tr>
            <td class="p-2 border text-center" colspan="4">Loading...</td>
          </tr>
        {:else if $religions.length === 0}
          <tr>
            <td class="p-2 border text-center" colspan="4">No data found</td>
          </tr>
        {:else}
          {#each $religions as religion}
            <tr class="hover:bg-gray-50">
              <td class="p-2 border">{religion.name}</td>
              <td class="p-2 border">{religion.description}</td>
              <td class="p-2 border text-center">
                {#if religion.isActive}
                  <span class="text-green-600">Yes</span>
                {:else}
                  <span class="text-red-600">No</span>
                {/if}
              </td>
              <td class="p-2 border text-center">
                <button class="bg-blue-500 text-white px-3 py-1 rounded mr-2" on:click={() => handleCast(religion._id)}>Cast</button>
                <button class="bg-yellow-500 text-white px-3 py-1 rounded mr-2" on:click={() => handleEdit(religion._id)}>Edit</button>
                <button class="bg-red-500 text-white px-3 py-1 rounded mr-2" on:click={() => handleDelete(religion._id)}>Delete</button>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>
