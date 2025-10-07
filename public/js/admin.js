

$(document).ready(function () {
  initUsersTable();
  initPetsTable();
  initOrdersTable();
  initReviewsTable();
  initSellersTable(); 
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


// ===================
// ORDERS TABLE
// ===================

function initOrdersTable() {
  $('#ordersTable').DataTable({
    ajax: {
      url: `${url}admin/orders/all`,
      dataSrc: 'data',
      headers: {
        Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
      }
    },
    columns: [
      { data: 'order_id' },
      { data: 'customer_name' },
      { data: 'items' },
      { 
        data: 'total_amount', 
        render: amount => amount ? `₱${parseFloat(amount).toFixed(2)}` : '₱0.00' 
      },
      { 
        data: 'date_placed', 
        render: date => new Date(date).toLocaleString() 
      },
      { data: 'status' },
      {
        data: null,
        render: function (data) {
          const isFinal = ['cancelled', 'received'].includes(data.status);
          const isShipped = data.status === 'shipped';

          let buttons = '';
          if (!isFinal && !isShipped) {
            buttons += `<button class="btn btn-sm btn-danger me-1" onclick="updateOrderStatus(${data.order_id}, 'cancelled')">Cancel</button>`;
          }
          if (data.status === 'pending') {
            buttons += `<button class="btn btn-sm btn-primary" onclick="updateOrderStatus(${data.order_id}, 'shipped')">Mark as Shipped</button>`;
          }
          return buttons || '-';
        }
      }
    ]
  });
}

function updateOrderStatus(orderId, newStatus) {
  $.ajax({
    url: `${url}admin/orders/update-status`,
    method: 'PATCH',
    contentType: 'application/json',
    headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token')
    },
    data: JSON.stringify({ order_id: orderId, status: newStatus }),
    success: () => {
      Swal.fire('Updated', 'Order status updated', 'success');
      $('#ordersTable').DataTable().ajax.reload();
    },
    error: () => {
      Swal.fire('Error', 'Failed to update order status', 'error');
      $('#ordersTable').DataTable().ajax.reload();
    }
  });
}



function initReviewsTable() {
  $('#reviewsTable').DataTable({
    ajax: {
      url: `${url}api/v1/reviews/all`,
      dataSrc: 'data',
      headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') // 👈 ADD THIS
    },
    },
    columns: [
      { data: 'review_id' },
      { data: 'user_name' },
      { data: 'product_name' },
      { data: 'order_id' },
      { data: 'rating' },
      { data: 'comment' },
      { data: 'created_at', render: date => new Date(date).toLocaleString() },
      {
        data: null,
        render: function (data) {
          return `<button class="btn btn-sm btn-danger" onclick="deleteReview(${data.review_id})">
                    <i class="fas fa-trash"></i> Delete
                  </button>`;
        }
      }
    ]
  });
}

// Delete review function
function deleteReview(id) {
  Swal.fire({
    title: 'Delete this review?',
    text: 'This action cannot be undone!',
    icon: 'warning',
    showCancelButton: true,
    confirmButtonText: 'Yes, delete it'
  }).then(result => {
    if (result.isConfirmed) {
      $.ajax({
        url: `${url}api/v1/reviews/${id}`,
        headers: {
      Authorization: 'Bearer ' + sessionStorage.getItem('access_token') // 👈 ADD THIS
    },
        method: 'DELETE',
        success: function () {
          Swal.fire('Deleted!', 'Review has been deleted.', 'success');
          $('#reviewsTable').DataTable().ajax.reload();
        },
        error: function () {
          Swal.fire('Error', 'Failed to delete review.', 'error');
        }
      });
    }
  });
}


// ===================
// SELLERS TABLE
// ===================
function initSellersTable() {
  loadPendingSellers();

  function loadPendingSellers() {
    $.ajax({
      url: `${url}admin/pending-sellers`,
      method: "GET",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("access_token")
      },
      success: function (res) {
        const tbody = $("#sellerRequests tbody");
        tbody.empty();

        if (res.length === 0) {
          tbody.append(`<tr><td colspan="5" class="text-center">No pending sellers</td></tr>`);
          return;
        }

        res.forEach(seller => {
          tbody.append(`
            <tr>
              <td>${seller.user_id}</td>
              <td>${seller.username}</td>
              <td>${seller.email}</td>
              <td>${seller.status}</td>
              <td>
                <button class="approve-btn btn btn-success btn-sm" data-id="${seller.user_id}">Approve</button>
                <button class="reject-btn btn btn-danger btn-sm" data-id="${seller.user_id}">Reject</button>
              </td>
            </tr>
          `);
        });
      },
      error: function () {
        Swal.fire("Error", "Failed to load pending sellers", "error");
      }
    });
  }

  // ✅ Approve seller
  $(document).on("click", ".approve-btn", function () {
    const userId = $(this).data("id");
    $.ajax({
      url: `${url}admin/approve-seller/${userId}`,
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("access_token")
      },
      success: function () {
        Swal.fire("Approved!", "Seller has been approved.", "success");
        loadPendingSellers();
      },
      error: function () {
        Swal.fire("Error", "Failed to approve seller", "error");
      }
    });
  });

  // ✅ Reject seller
  $(document).on("click", ".reject-btn", function () {
    const userId = $(this).data("id");
    $.ajax({
      url: `${url}admin/reject-seller/${userId}`,
      method: "POST",
      headers: {
        Authorization: "Bearer " + sessionStorage.getItem("access_token")
      },
      success: function () {
        Swal.fire("Rejected!", "Seller request has been rejected.", "info");
        loadPendingSellers();
      },
      error: function () {
        Swal.fire("Error", "Failed to reject seller", "error");
      }
    });
  });
}
