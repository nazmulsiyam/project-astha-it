<script>
  // @ts-nocheck
  import { onMount } from 'svelte';
  import { writable } from 'svelte/store';
  import { goto } from '$app/navigation';
  import toast, { Toaster } from 'svelte-french-toast';
  import EditReligionModal from './EditReligionModal.svelte'; // Import the Edit modal component
  
  let religions = writable([]);
  let loading = writable(true);
  let showCreateModal = writable(false);  // State for create modal
  let showEditModal = writable(false);    // State for edit modal
  let religionToDelete = writable(null);
  let newReligion = writable({ name: '', description: '', isActive: true });
  let religionToEdit = writable(null);    // Store for the religion to edit
  let showDeleteModal = writable(false); // To control visibility of delete modal

  const fetchReligions = async () => {
    try {
      const response = await fetch('https://projectasthaapi.vercel.app/api/v1/religion');
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

  const handleCreate = () => {
    // Open the create modal and close the edit modal
    showCreateModal.set(true);
    showEditModal.set(false); // Ensure the edit modal is closed
  };

  const saveReligion = async () => {
    try {
      const response = await fetch('https://projectasthaapi.vercel.app/api/v1/religion', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify($newReligion),
      });

      if (!response.ok) {
        throw new Error('Failed to create religion');
      }

      const newData = await response.json();
      religions.update((current) => [...current, newData]);
      toast.success('Religion created successfully!');
      goto(window.location.pathname);
      showCreateModal.set(false);  // Close the create modal

    } catch (error) {
      console.error('Error saving religion:', error);
      toast.error('Failed to create religion!');
    }
  };

  const handleCast = (_id) => {
    goto(`/cast/${_id}`);
  };

  const handleEdit = (_id) => {
    const religion = $religions.find((r) => r._id === _id); // Use $religions to access the array
    if (religion) {
      religionToEdit.set(religion); // Set the religion to edit
      showCreateModal.set(false);   // Close the create modal if open
      showEditModal.set(true);      // Open the edit modal
    } else {
      console.error("Religion not found");
    }
  };

  const handleDelete = (religion) => {
    religionToDelete.set(religion); // Set the religion to delete
    showDeleteModal.set(true); // Open the delete modal
  };

  const handleConfirmDelete = async () => {
    const religion = $religionToDelete;

    try {
      const response = await fetch(`https://projectasthaapi.vercel.app/api/v1/religion/${religion._id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete religion');
      }

      religions.update((current) => current.filter((r) => r._id !== religion._id)); 
      toast.success('Religion deleted successfully!');
      showDeleteModal.set(false); // Close the delete modal
    } catch (error) {
      console.error('Error deleting religion:', error);
      toast.error('Failed to delete religion!');
    }
  };

  const handleCancelDelete = () => {
    showDeleteModal.set(false); // Close the delete modal
  };
</script>

<EditReligionModal bind:religionToEdit={religionToEdit} bind:showModal={showEditModal} />


<div class="container mx-auto p-4">
  <Toaster />
  <h1 class="text-2xl font-bold mb-4">Religions</h1>
  <div class="flex justify-end mb-2">
    <button
      class="bg-green-500 text-white cursor-pointer px-4 py-2 rounded"
      on:click={handleCreate}
    >
      Create +
    </button>
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
                <button
                  class="bg-blue-500 text-white px-3 py-1 rounded mr-2"
                  on:click={() => handleCast(religion._id)}
                >
                  Cast
                </button>
                <button
                  class="bg-yellow-500 text-white px-3 py-1 rounded mr-2"
                  on:click={() => handleEdit(religion._id)}
                >
                  Edit
                </button>
                <button
                  class="bg-red-500 text-white px-3 py-1 rounded mr-2"
                  on:click={() => handleDelete(religion)}
                >
                  Delete
                </button>
              </td>
            </tr>
          {/each}
        {/if}
      </tbody>
    </table>
  </div>
</div>

<!-- Create Religion Modal -->
{#if $showCreateModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/3">
      <h2 class="text-xl font-bold mb-4">Create New Religion</h2>
      <label class="block mb-2">
        Name:
        <input
          type="text"
          class="block w-full border p-2 rounded"
          required
          bind:value={$newReligion.name}
        />
      </label>
      <label class="block mb-2">
        Description:
        <textarea
          class="block w-full border p-2 rounded"
          bind:value={$newReligion.description}
          required
        ></textarea>
      </label>
      <label class="block mb-4">
        Is Active:
        <select
          class="block w-full border p-2 rounded"
          bind:value={$newReligion.isActive}
        >
          <option value={true}>Yes</option>
          <option value={false}>No</option>
        </select>
      </label>
      <div class="flex justify-end space-x-2">
        <button
          class="bg-gray-300 px-4 py-2 rounded"
          on:click={() => showCreateModal.set(false)}
        >
          Cancel
        </button>
        <button
          class="bg-blue-500 text-white px-4 py-2 rounded"
          on:click={saveReligion}
        >
          Save
        </button>
      </div>
    </div>
  </div>
{/if}

<!-- Delete Confirmation Modal -->
{#if $showDeleteModal}
  <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
    <div class="bg-white p-6 rounded shadow-lg w-1/3">
      <h2 class="text-xl font-bold mb-4">Are you sure you want to delete?</h2>
      <div class="flex justify-end space-x-2">
        <button 
          class="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
          on:click={handleCancelDelete}>
          No
        </button>
        <button 
          class="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
          on:click={handleConfirmDelete}>
          Yes
        </button>
      </div>
    </div>
  </div>
{/if}
