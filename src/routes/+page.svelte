<script lang="ts">
	import type { LayoutProps } from './$types';
	type User = { id?: number; name: string; age: number; isDone: boolean };
	type Data = { users: User[] };
	let { data }: { data: Data } = $props();
	let nameInput = $state('');
	let ageInput = $state(0);
	let selectedEditId = $state(-1);
	let isEdit = $derived(selectedEditId > 0 ? true : false);
	let usersData = $state([...data.users]);

	const addUser = async () => {
		const formData = new FormData();
		formData.append('name', nameInput);
		formData.append('age', ageInput.toString());

		const res = fetch('/api/users', {
			method: 'POST',
			body: formData
		}).then(() => {
			usersData.push({
				name: nameInput,
				age: ageInput,
				isDone: false
			});

			nameInput = '';
			ageInput = 0;
		});
	};

	const handleDoneAction = async (id: number | undefined) => {
		const formData = new FormData();
		formData.append('id', id!.toString());
		formData.append('isDone', 'true');

		const res = fetch('/api/users', {
			method: 'PATCH',
			body: formData
		}).then(() => {
			usersData = usersData.map((user) => (user.id === id ? { ...user, isDone: true } : user));
		});
	};

	const handleSelectedEdit = (id: number | undefined, name: string, age: number) => {
		if (selectedEditId === id) {
			selectedEditId = -1;
			nameInput = '';
			ageInput = 0;
		} else {
			selectedEditId = id!;
			nameInput = name;
			ageInput = age;
		}
	};

	const updateUser = async () => {
		const formData = new FormData();
		formData.append('id', selectedEditId.toString());
		formData.append('name', nameInput);
		formData.append('age', ageInput.toString());

		const res = fetch('/api/users', {
			method: 'PATCH',
			body: formData
		}).then(() => {
			usersData = usersData.map((user) =>
				user.id === selectedEditId ? { ...user, name: nameInput, age: ageInput } : user
			);

			selectedEditId = -1;
			nameInput = '';
			ageInput = 0;
		});
	};

	const deleteUser = async (id: number | undefined) => {
		const formData = new FormData();
		formData.append('id', id!.toString());

		const res = fetch('/api/users', {
			method: 'DELETE',
			body: formData
		}).then(() => {
			usersData = usersData.filter((user) => user.id !== id);
		});
	};
</script>

<div
	class="h-screen w-screen flex items-center justify-center bg-gradient-to-b from-blue-800 to-cyan-600 text-white"
>
	<table class="border-1 text-center border-separate [border-spacing:0.75rem]">
		<thead>
			<tr>
				<th>Name</th>
				<th>Age</th>
				<th>Status</th>
				<th>Actions</th>
				<th>Edit</th>
			</tr>
		</thead>
		<tbody>
			{#each usersData as user}
				<tr>
					<td>{user.name}</td>
					<td>{user.age}</td>
					<td>
						{#if user.isDone}
							<span class="bg-green-200 text-green-700 p-1 rounded-lg">Done</span>
						{:else}
							<span class="bg-yellow-600 text-white p-1 rounded-lg">On Working</span>
						{/if}
					</td>
					<td>
						{#if !user.isDone}
							<button
								class="border-1 p-1 rounded-lg hover:bg-green-300 cursor-pointer"
								onclick={() => handleDoneAction(user.id)}>Done</button
							>
						{/if}
						<button
							class="border-1 p-1 rounded-lg border-red-600 text-red-600 hover:bg-red-600 hover:text-white cursor-pointer"
							onclick={() => deleteUser(user.id)}>Delete</button
						>
					</td>
					<td>
						<button
							class={`border-1 p-1 rounded-lg cursor-pointer ${selectedEditId === user.id ? 'bg-gray-600' : 'hover:bg-gray-300'}`}
							onclick={() => handleSelectedEdit(user.id, user.name, user.age)}>Select</button
						>
					</td>
				</tr>
			{/each}
			<tr>
				<td>
					<input type="text" bind:value={nameInput} class="border-1 w-40" />
				</td>
				<td>
					<input type="text" bind:value={ageInput} class="border-1 w-10 text-center" />
				</td>
				<td></td>
				<td>
					{#if !isEdit}
						<button
							onclick={addUser}
							class="border-1 p-1 rounded-lg hover:bg-amber-300 hover:text-amber-800 cursor-pointer"
							>Add</button
						>
					{:else}
						<button
							onclick={updateUser}
							class="border-1 p-1 rounded-lg hover:bg-yellow-300 cursor-pointer">Edit</button
						>
					{/if}
				</td>
			</tr>
		</tbody>
	</table>
</div>

<style>
	table,
	th,
	td {
		padding: 10px 10px;
		border: 1px solid white;
		border-collapse: collapse;
	}
</style>
