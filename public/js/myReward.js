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
});