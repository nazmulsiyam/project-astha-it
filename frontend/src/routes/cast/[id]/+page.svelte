<script>
    import { onMount } from 'svelte';
    import { page } from '$app/stores';
    import { writable } from 'svelte/store';
    import Icon from '@iconify/svelte';
    import pencilIcon from '@iconify/icons-mdi/pencil';
    import deleteIcon from '@iconify/icons-mdi/delete';
    import toast, { Toaster } from 'svelte-french-toast';
  
    let castDetails = writable([]);
    let loading = writable(true);
    let error = writable(null);
    let showEditModal = writable(false);
    let showDeleteModal = writable(false);
    let showCreateModal = writable(false);
    let selectedCast = writable(null);
    let deleteId = writable(null);
  
    let newCast = { name: '', description: '' };
  
    // Fetch cast details based on religion ID
    onMount(() => {
      const unsubscribe = page.subscribe(async ($page) => {
        const { id } = $page.params;
        try {
          const response = await fetch(`https://projectasthaapi.vercel.app/api/v2/cast/religion/${id}`);
          if (!response.ok) {
            throw new Error('Failed to fetch cast details');
          }
          const data = await response.json();
          castDetails.set(data.data);
        } catch (error) {
          console.log(error);
          error.set('Failed to fetch cast details.');
        } finally {
          loading.set(false);
        }
      });
  
      return () => {
        unsubscribe();
      };
    });
  
    const deleteCast = async () => {
      try {
        const response = await fetch(`https://projectasthaapi.vercel.app/api/v2/cast/${$deleteId}`, {
          method: 'DELETE',
        });
        if (!response.ok) {
          throw new Error('Failed to delete cast');
        }
        castDetails.update((current) => current.filter((cast) => cast._id !== $deleteId));
        showDeleteModal.set(false);
        toast.success('Cast deleted successfully!');
      } catch (error) {
        console.log(error);
        toast.error('Failed to delete cast.');
      }
    };
  
    const openEditModal = (cast) => {
      selectedCast.set(cast);
      showEditModal.set(true);
    };
  
    const openDeleteModal = (id) => {
      deleteId.set(id);
      showDeleteModal.set(true);
    };
  
    const saveEdit = async () => {
      try {
        const updatedCast = $selectedCast;
        const response = await fetch(`https://projectasthaapi.vercel.app/api/v2/cast/${updatedCast._id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(updatedCast),
        });
        if (!response.ok) {
          throw new Error('Failed to update cast');
        }
        const updatedData = await response.json();
        castDetails.update((current) =>
          current.map((cast) => (cast._id === updatedData.data._id ? updatedData.data : cast))
        );
        showEditModal.set(false);
        toast.success('Cast updated successfully!');
      } catch (error) {
        console.log(error);
        toast.error('Failed to update cast.');
      }
    };
  
    const createCast = async () => {
      const { id } = $page.params;
      try {
        const response = await fetch('https://projectasthaapi.vercel.app/api/v2/cast', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ ...newCast, religionId: id }),
        });
        if (!response.ok) {
          throw new Error('Failed to create cast');
        }
        const createdCast = await response.json();
        castDetails.update((current) => [...current, createdCast.data]);
        showCreateModal.set(false);
        newCast = { name: '', description: '' };
        toast.success('Cast created successfully!');
      } catch (error) {
        console.log(error);
        toast.error('Failed to create cast.');
      }
    };
  </script>
  
  <style>
    .grid-container {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 1rem;
    }
  </style>
  
  <div class="container mx-auto p-4">
    <Toaster />
    <div class="flex justify-between">
      <h1 class="text-2xl font-bold mb-4">Cast Details</h1>
      <button
        type="button"
        class="text-white bg-gradient-to-br from-pink-500 to-orange-400 hover:bg-gradient-to-bl focus:outline-none font-medium rounded-lg text-sm px-5 py-2.5 text-center me-2 mb-2"
        on:click={() => showCreateModal.set(true)}>
        Create +
      </button>
    </div>
    {#if $loading}
      <p>Loading...</p>
    {:else if $error}
      <p class="text-red-500">{$error}</p>
    {:else if $castDetails.length === 0}
      <p>No casts found for this religion.</p>
    {:else}
      <div class="grid-container">
        {#each $castDetails as cast}
          <div class="p-4 border rounded shadow">
            <div class="flex justify-end">
              <button
                class="px-4 py-2 flex items-center space-x-2"
                on:click={() => openEditModal(cast)}>
                <Icon icon={pencilIcon} class="text-green-600 w-7 h-7" />
              </button>
              <button
                class="flex items-center space-x-2"
                on:click={() => openDeleteModal(cast._id)}>
                <Icon icon={deleteIcon} class="text-red-700 w-7 h-7" />
              </button>
            </div>
            <h2 class="text-xl font-bold">{cast.name}</h2>
            <p>{cast.description}</p>
          </div>
        {/each}
      </div>
    {/if}
  
    {#if $showEditModal}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow-lg w-1/3">
          <h2 class="text-xl font-bold mb-4">Edit Cast</h2>
          <label class="block mb-2">
            <span class="text-gray-700">Name</span>
            <input type="text" bind:value={$selectedCast.name} class="block w-full mt-1 p-2 border rounded" />
          </label>
          <label class="block mb-4">
            <span class="text-gray-700">Description</span>
            <textarea bind:value={$selectedCast.description} class="block w-full mt-1 p-2 border rounded"></textarea>
          </label>
          <div class="flex justify-end space-x-2">
            <button
              class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              on:click={() => showEditModal.set(false)}>
              Cancel
            </button>
            <button
              class="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
              on:click={saveEdit}>
              Save
            </button>
          </div>
        </div>
      </div>
    {/if}
  
    {#if $showDeleteModal}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow-lg w-1/3">
          <h2 class="text-xl font-bold mb-4">Are you sure you want to delete?</h2>
          <div class="flex justify-end space-x-2">
            <button
              class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              on:click={() => showDeleteModal.set(false)}>
              No
            </button>
            <button
              class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
              on:click={deleteCast}>
              Yes
            </button>
          </div>
        </div>
      </div>
    {/if}
  
    {#if $showCreateModal}
      <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div class="bg-white p-6 rounded shadow-lg w-1/3">
          <h2 class="text-xl font-bold mb-4">Create Cast</h2>
          <label class="block mb-2">
            <span class="text-gray-700">Name</span>
            <input type="text" bind:value={newCast.name} class="block w-full mt-1 p-2 border rounded" />
          </label>
          <label class="block mb-4">
            <span class="text-gray-700">Description</span>
            <textarea bind:value={newCast.description} class="block w-full mt-1 p-2 border rounded"></textarea>
          </label>
          <div class="flex justify-end space-x-2">
            <button
              class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
              on:click={() => showCreateModal.set(false)}>
              Cancel
            </button>
            <button
              class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
              on:click={createCast}>
              Create
            </button>
          </div>
        </div>
      </div>
    {/if}
  </div>
  