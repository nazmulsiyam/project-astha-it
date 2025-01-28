<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { writable } from 'svelte/store';
  
    let castDetails = writable([]);
    let loading = writable(true);
    let error = writable(null);
  
    onMount(() => {
      const unsubscribe = page.subscribe(async ($page) => {
        const { id } = $page.params; // Destructure religion ID from the route
        try {
          const response = await fetch(`http://localhost:3000/api/v2/cast/religion/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch cast details');
          }
          const data = await response.json();
          castDetails.set(data.data); // Set fetched data into the store
        } catch (error) {
          console.log(error);
        } finally {
          loading.set(false);
        }
      });
  
      // Cleanup function
      return () => {
        unsubscribe();
      };
    });
  </script>
  
  <div class="container mx-auto p-4">
    <h1 class="text-2xl font-bold mb-4">Cast Details</h1>
    {#if $loading}
      <p>Loading...</p>
    {:else if $error}
      <p class="text-red-500">{$error}</p>
    {:else if $castDetails.length === 0}
      <p>No casts found for this religion.</p>
    {:else}
      {#each $castDetails as cast}
        <div class="p-4 border rounded shadow mb-4">
          <h2 class="text-xl font-bold">{cast.name}</h2>
          <p>{cast.description}</p>
          <div class="text-sm text-gray-600">
            <strong>Religion:</strong> {cast.religionId.name}
          </div>
          <p class="text-sm text-gray-600">{cast.religionId.description}</p>
        </div>
      {/each}
    {/if}
  </div>
  