function saveUser() {
    const userData = {
        firstName: $('#firstName').val(),
        lastName: $('#lastName').val(),
        mobileNo: $('#mobileNo').val(),
        email: $('#email').val(),
        address: {
            street: $('#street').val(),
            city: $('#city').val(),
            state: $('#state').val(),
            country: $('#country').val()
        },
        loginId: $('#loginId').val(),
        password: $('#password').val()
    };

    $.ajax({
        type: 'POST',
        url: 'https://socketio-room.onrender.com/',
        data: JSON.stringify(userData),
        contentType: 'application/json',
        success: function (response) {
            alert(response);
            $('#userForm')[0].reset();
            window.location.href = "https://socketio-room.onrender.com/users";
        },
        error: function (error) {
            console.error(error);
            alert('please provide right data');
        }
    });
}


