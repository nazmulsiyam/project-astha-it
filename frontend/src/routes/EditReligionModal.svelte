<script>
  // @ts-nocheck
  import { writable } from 'svelte/store';
  import toast from 'svelte-french-toast';
  
  export let religionToEdit = writable(null); // Religion to edit
  export let showModal = writable(false); // Show or hide modal
  let editedReligion = writable({ name: '', description: '', isActive: true });
  
  const handleSave = async () => {
    const religion = $religionToEdit;
  
    try {
      const response = await fetch(`https://projectasthaapi.vercel.app/api/v1/religion/${religion._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify($editedReligion),
      });
  
      if (!response.ok) {
        throw new Error('Failed to update religion');
      }
  
      const updatedReligion = await response.json();
      toast.success('Religion updated successfully!');
      showModal.set(false); // Close the modal
    } catch (error) {
      console.error('Error updating religion:', error);
      toast.error('Failed to update religion!');
    }
  };
  
  const handleCancel = () => {
    showModal.set(false); // Close the modal
  };
  
  // Watch for changes to the religionToEdit
  $: $editedReligion = $religionToEdit ? { ...$religionToEdit } : { name: '', description: '', isActive: true };
</script>

<style>
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    justify-content: center;
    align-items: center;
    z-index: 50;
  }

  .modal-content {
    background: white;
    border-radius: 8px;
    padding: 2rem;
    width: 90%;
    max-width: 500px;
  }
</style>

{#if $showModal}
  <div class="modal">
    <div class="modal-content">
      <h2 class="text-xl font-bold mb-4">Edit Religion</h2>

      <form on:submit|preventDefault={handleSave}>
        <div class="mb-4">
          <label class="block text-gray-700">Name</label>
          <input
            type="text"
            class="w-full p-2 border border-gray-300 rounded"
            bind:value={$editedReligion.name}
            required
          />
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Description</label>
          <textarea
            class="w-full p-2 border border-gray-300 rounded"
            bind:value={$editedReligion.description}
            required
          ></textarea>
        </div>

        <div class="mb-4">
          <label class="block text-gray-700">Active</label>
          <input
            type="checkbox"
            class="mr-2"
            bind:checked={$editedReligion.isActive}
          />
          <span class="text-gray-700">Is Active</span>
        </div>

        <div class="flex justify-end">
          <button
            type="button"
            class="bg-gray-300 text-black px-4 py-2 rounded mr-2"
            on:click={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            class="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Save
          </button>
        </div>
      </form>
    </div>
  </div>
{/if}
