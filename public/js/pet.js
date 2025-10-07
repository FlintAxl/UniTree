$(document).ready(function () {
  console.log("pet.js loaded");

  const userId = sessionStorage.getItem('userId');
  if (!userId) {
    Swal.fire('Not logged in', 'Please login to choose a pet', 'warning').then(() => {
      window.location.href = 'login.html';
    });
    return;
  }

  // When a pet card is clicked
  $('.pet-choice').on('click', function () {
    const choice = $(this).data('choice');
    $('#selectedChoice').val(choice);
    $('#petNameInput').val('');
    $('#petNameModal').modal('show');
  });

  // Confirm pet creation
  $('#confirmPetBtn').on('click', function () {
    const petName = $('#petNameInput').val().trim();
    const choice = $('#selectedChoice').val();

    if (!petName) {
      Swal.fire('Please name your pet', '', 'info');
      return;
    }

    const payload = {
      user_id: parseInt(userId, 10),
      pet_name: petName,
      choice: choice
    };

    $.ajax({
      method: 'POST',
      url: 'http://localhost:3000/api/v1/pets/user',
      contentType: 'application/json',
      data: JSON.stringify(payload),
      success: function (res) {
        console.log("Pet created:", res);
        Swal.fire('Pet created!', 'Great choice — enjoy your pet.', 'success')
      },
      error: function (xhr) {
        console.error("Pet creation error:", xhr.responseText);
        Swal.fire('Error', xhr.responseJSON?.error || 'Failed to create pet', 'error');
      }
    });
  });

  $('#cancelPetBtn').on('click', function () {
    $('#petNameModal').modal('hide');
  });
});