
$(document).ready(function () {
  initUsersTable();
  initPetsTable();
});

// ===================
// USERS TABLE
// ===================
function initUsersTable() {
  $('#usersTable').DataTable({
    ajax: {
      url: `${url}admin/users`,
      dataSrc: 'data',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
      }
    },
    columns: [
      { data: 'user_id' },
      { data: 'username' },
      { data: 'email' },
      { data: 'role' },
      { data: 'created_at', render: d => new Date(d).toLocaleString() },
      {
        data: null,
        render: function (data) {
          return `
            <button class="btn btn-sm btn-primary" onclick="openEditUser(${data.user_id})">Edit</button>
            <button class="btn btn-sm btn-danger" onclick="deleteUser(${data.user_id})">Delete</button>
          `;
        }
      }
    ]
  });
}

// ===================
// USER ACTIONS
// ===================

// Create user
function createUser() {
  const userData = {
    username: $('#createUsername').val(),
    email: $('#createEmail').val(),
    password: $('#createPassword').val(),
    role: $('#createRole').val()
  };

  $.ajax({
    method: 'POST',
    url: `${url}admin/users`,
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
    },
    contentType: 'application/json',
    data: JSON.stringify(userData),
    success: function () {
      Swal.fire('Success', 'User created successfully', 'success');
      $('#usersTable').DataTable().ajax.reload();
      $('#createUserModal').modal('hide');
    },
    error: function () {
      Swal.fire('Error', 'Failed to create user', 'error');
    }
  });
}

// Open edit modal
function openEditUser(userId) {
  $.ajax({
    method: 'GET',
    url: `${url}admin/users/${userId}`,
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
    },
    success: function (res) {
      const user = res.user;
      $('#editUserId').val(user.user_id);
      $('#editUsername').val(user.username);
      $('#editEmail').val(user.email);
      $('#editRole').val(user.role);
      $('#editUserModal').modal('show'); // use Bootstrap modal
    },
    error: function () {
      Swal.fire('Error', 'Failed to fetch user details', 'error');
    }
  });
}


// Update user
function updateUser() {
  const id = $('#editUserId').val();
  const updatedData = {
    username: $('#editUsername').val(),
    email: $('#editEmail').val(),
    role: $('#editRole').val()
  };

  $.ajax({
    method: 'PUT',
    url: `${url}admin/users/${id}`,
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
    },
    contentType: 'application/json',
    data: JSON.stringify(updatedData),
    success: function () {
      Swal.fire('Success', 'User updated successfully', 'success');
      $('#usersTable').DataTable().ajax.reload();
      $('#editUserModal').modal('hide');
    },
    error: function () {
      Swal.fire('Error', 'Failed to update user', 'error');
    }
  });
}

// Delete user
function deleteUser(id) {
  Swal.fire({
    title: 'Delete this user?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it'
  }).then(result => {
    if (result.isConfirmed) {
      $.ajax({
        method: 'DELETE',
        url: `${url}admin/users/${id}`,
        headers: {
          Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
        },
        success: function () {
          Swal.fire('Deleted!', 'User has been removed.', 'success');
          $('#usersTable').DataTable().ajax.reload();
        },
        error: function () {
          Swal.fire('Error', 'Failed to delete user.', 'error');
        }
      });
    }
  });
}

// ===================
// PETS TABLE
// ===================
function initPetsTable() {
  $('#petsTable').DataTable({
    ajax: {
      url: `${url}admin/pets`,
      dataSrc: 'data',
      headers: { Authorization: 'Bearer ' + sessionStorage.getItem('access_token') }
    },
    columns: [
      { data: 'pet_id', title: 'Pet ID' },
      { data: 'pet_name', title: 'Pet Name' },
      // { data: 'user_id', title: 'User ID' },   // raw ID
      { data: 'username', title: 'Username' }, // readable username
      { data: 'level', title: 'Level' },
      { data: 'coins', title: 'Coins' },
      {
        data: 'level1_image',
        render: d => d ? `<img src="images/${d}" width="50"/>` : ''
      },
      {
        data: 'level2_image',
        render: d => d ? `<img src="images/${d}" width="50"/>` : ''
      },
      {
        data: 'level3_image',
        render: d => d ? `<img src="images/${d}" width="50"/>` : ''
      },
      {
        data: null,
        render: d => `
          <button class="btn btn-sm btn-primary" onclick="openEditPet(${d.pet_id})">Edit</button>
          <button class="btn btn-sm btn-danger" onclick="deletePet(${d.pet_id})">Delete</button>
        `
      }
    ]
  });
}


// ===================
// PET ACTIONS
// ===================

// Create Pet
function createPet() {
  const formData = new FormData();
  formData.append('user_id', $('#createPetUserId').val());
  formData.append('pet_name', $('#createPetName').val());
  formData.append('level', $('#createPetLevel').val());
  formData.append('coins', $('#createPetCoins').val());
  formData.append('level1_image', $('input[name="level1_image"]')[0].files[0]);
  formData.append('level2_image', $('input[name="level2_image"]')[0].files[0]);
  formData.append('level3_image', $('input[name="level3_image"]')[0].files[0]);

  $.ajax({
    method: 'POST',
    url: `${url}admin/pets`,
    headers: { Authorization: 'Bearer ' + sessionStorage.getItem('access_token') },
    data: formData,
    processData: false,
    contentType: false,
    success: function () {
      Swal.fire('Success', 'Pet created successfully', 'success');
      $('#petsTable').DataTable().ajax.reload();
      $('#createPetModal').modal('hide');
    },
    error: function (xhr) {
  console.error(xhr.responseText);
      Swal.fire('Error', 'Failed to create pet', 'error');
    }
  });
}

// Delete Pet
function deletePet(id) {
  Swal.fire({
    title: 'Delete this pet?',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete'
  }).then(result => {
    if (result.isConfirmed) {
      $.ajax({
        method: 'DELETE',
        url: `${url}admin/pets/${id}`,
        headers: { Authorization: 'Bearer ' + sessionStorage.getItem('access_token') },
        success: function () {
          Swal.fire('Deleted!', 'Pet has been removed.', 'success');
          $('#petsTable').DataTable().ajax.reload();
        }
      });
    }
  });
}


// Load users into dropdown
function loadUsersDropdown(selector, selectedId = null) {
  $.ajax({
    method: 'GET',
    url: `${url}admin/users`,
    headers: { Authorization: 'Bearer ' + sessionStorage.getItem('access_token') },
    success: function(res) {
      const users = res.data;
      const dropdown = $(selector);
      dropdown.empty();
      users.forEach(user => {
        dropdown.append(
          `<option value="${user.user_id}" ${selectedId == user.user_id ? 'selected' : ''}>${user.username}</option>`
        );
      });
    }
  });
}

// When opening Create Pet Modal
$('#createPetModal').on('show.bs.modal', function() {
  loadUsersDropdown('#createPetUserId');
});


function openEditPet(petId) {
  $.ajax({
    method: 'GET',
    url: `${url}admin/pets/${petId}`,
    headers: { Authorization: 'Bearer ' + sessionStorage.getItem('access_token') },
    success: function(res) {
      const pet = res.pet;
      $('#editPetId').val(pet.pet_id);
      $('#editPetName').val(pet.pet_name);
      $('#editPetLevel').val(pet.level);
      $('#editPetCoins').val(pet.coins);

      // load users and pre-select correct one
      loadUsersDropdown('#editPetUserId', pet.user_id);

      $('#editPetModal').modal('show');
    }
  });
}

function updatePet() {
  const petId = $('#editPetId').val();
  const formData = new FormData();
  formData.append('user_id', $('#editPetUserId').val());
  formData.append('pet_name', $('#editPetName').val());
  formData.append('level', $('#editPetLevel').val());
  formData.append('coins', $('#editPetCoins').val());
  
  const level1 = $('input[name="level1_image"]')[1].files[0]; // second modal
  const level2 = $('input[name="level2_image"]')[1].files[0];
  const level3 = $('input[name="level3_image"]')[1].files[0];
  
  if (level1) formData.append('level1_image', level1);
  if (level2) formData.append('level2_image', level2);
  if (level3) formData.append('level3_image', level3);

  $.ajax({
    method: 'PUT',
    url: `${url}admin/pets/${petId}`,
    headers: { Authorization: 'Bearer ' + sessionStorage.getItem('access_token') },
    data: formData,
    processData: false,
    contentType: false,
    success: function() {
      Swal.fire('Success', 'Pet updated successfully', 'success');
      $('#petsTable').DataTable().ajax.reload();
      $('#editPetModal').modal('hide');
    },
    error: function() {
      Swal.fire('Error', 'Failed to update pet', 'error');
    }
  });
}

