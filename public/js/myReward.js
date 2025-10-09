$(document).ready(function () {
    const token = sessionStorage.getItem('access_token');
    const userId = sessionStorage.getItem('userId');

    if (!token || !userId) {
        Swal.fire({
            icon: 'warning',
            text: 'You must be logged in to access this page.',
            showConfirmButton: true
        }).then(() => {
            window.location.href = 'login.html';
        });
        return;
    }

    // Fetch total coins only
    $.ajax({
        url: `${url}api/v1/my-rewards/${userId}`,
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`
        },
        success: function (response) {
            if (response && response.data && response.data.total_coins !== undefined) {
                $('#totalCoins').text(response.data.total_coins);
            } else {
                $('#totalCoins').text('0');
            }
        },
        error: function () {
            Swal.fire('Error', 'Failed to load rewards. Please try again.', 'error');
            $('#totalCoins').text('0');
        }
    });

// ✅ NEW: Fetch and display user's pet
  $.ajax({
    url: `${url}api/v1/pets/user/${userId}`,
    method: 'GET',
    success: function (response) {
      if (response.success && response.pet) {
        const pet = response.pet;
        const levelImages = {
          1: pet.level1_image,
          2: pet.level2_image,
          3: pet.level3_image
        };
        const currentImage = levelImages[pet.level] || pet.level1_image || 'default-pet.png'; // Fallback image if needed
        const petHtml = `
  <div class="col-md-12">
    <div class="card pet-card text-center">
      <div class="card-body">
        <img src="/images/${currentImage}" alt="${pet.pet_name}" 
             class="pet-image img-fluid rounded-circle" 
             style="width: 150px; height: 150px; object-fit: cover;">
        <h3>${pet.pet_name}</h3>
        <p><i class="fa-solid fa-paw"></i> Level: ${pet.level}</p>

        <!-- XP progress bar -->
        <div class="pet-progress">
          <div class="pet-progress-bar" id="xpBar" style="width: ${pet.xp_progress || 0}%;"></div>
        </div>

        <p class="text-muted">Last Fed: ${pet.last_fed ? new Date(pet.last_fed).toLocaleString() : 'Never'}</p>
        <p>Use your earned coins to level up and care for ${pet.pet_name}!</p>

        <button class="pet-action-btn mt-2"><i class="fa-solid fa-bone"></i> Feed ${pet.pet_name}</button>
      </div>
    </div>
  </div>
`;
        $('#petSection').html(petHtml);
      } else {
        // No pet: Show message with link to create
        const noPetHtml = `
          <div class="col-md-12">
            <div class="alert alert-info text-center">
              <i class="fa-solid fa-heart fa-2x mb-3"></i>
              <h4>No Pet Yet?</h4>
              <p>You haven't created a pet. Choose one to start earning rewards and caring for it!</p>
              <a href="choose.html" class="btn btn-primary">Create My Pet</a> <!-- Link to your pet choice page -->
            </div>
          </div>
        `;
        $('#petSection').html(noPetHtml);
      }
    },
    error: function () {
      // Fallback: Show error in pet section
      $('#petSection').html(`
        <div class="col-md-12">
          <div class="alert alert-warning text-center">
            <p>Unable to load pet information. <a href="javascript:location.reload()">Refresh</a> to try again.</p>
          </div>
        </div>
      `);
      Swal.fire('Error', 'Failed to load pet details.', 'error');
    }
  });


    
});