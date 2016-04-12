var userListData = [];

$(document).ready(function() {
  populateTable();
  $('#userList table tbody').on('click', 'td a.linkshowuser', showUserInfo);
  $('#userList table tbody').on('click', 'td a.linkdeleteuser', deleteUser);
  $('#btnAddUser').on('click', addUser);
});

function populateTable() {
  var tableContent = '';

  // jQuery AJAX call for JSON
  $.getJSON('/users/userlist', function(data) {
    userListData = data;
    $.each(data, function() {
      tableContent += '<tr>';
      tableContent += '<td><a href="#" class="linkshowuser" rel="' + this.username + '">' + this.username + '</a></td>';
      tableContent += '<td>' + this.email + '</td>';
      tableContent += '<td><a href="#" class="linkdeleteuser" rel="' + this._id + '">delete</a></td>';
      tableContent += '</tr>';
    });

    $('#userList table tbody').html(tableContent);
  });
};

function showUserInfo(event) {
  event.preventDefault();
  
  var thisUsername = $(this).attr('rel');
  var arrayPosition = userListData.map(function(arrayItem) {
    return arrayItem.username;
  }).indexOf(thisUsername);
  
  var thisUserObject = userListData[arrayPosition];
  
  $('#userInfoName').text(thisUserObject.fullname);
  $('#userInfoAge').text(thisUserObject.age);
  $('#userInfoGender').text(thisUserObject.gender);
  $('#userInfoLocation').text(thisUserObject.location);
};

function addUser(event) {
  event.preventDefault();
  
  var errorCount = 0;
  $('#addUser input').each(function(index, val) {
    if($(this).val() === '') {
      errorCount++;
    }
  });
  
  if(errorCount === 0) {
    var newUser = {
      'username': $('#addUser fieldset input#inputUserName').val(),
      'email': $('#addUser fieldset input#inputUserEmail').val(),
      'fullname': $('#addUser fieldset input#inputUserFullname').val(),
      'age': $('#addUser fieldset input#inputUserAge').val(),
      'location': $('#addUser fieldset input#inputUserLocation').val(),
      'gender': $('#addUser fieldset input#inputUserGender').val()
    };
    
    $.ajax({
      type: 'POST',
      data: newUser,
      url: '/users/adduser',
      dataType: 'JSON'
    }).done(function(response) {
      if(response.msg === '') {
        $('#addUser fieldset input').val('');
        populateTable();
      } else {
        alert('Error: ' + response.msg);
      }
    });
  } else {
    alert('Please fill in all fields');
    return false;
  }
};

function deleteUser(event) {
  event.preventDefault();
  
  var confirmed = confirm('Are you sure? Too late!');
  if(confirmed === false) return false;
  
  $.ajax({
    type: 'DELETE',
    url: '/users/deleteuser/' + $(this).attr('rel')
  }).done(function(response) {
    if(response.msg !== '') {
      alert('Error: ' + response.msg);
    }
    
    populateTable();
  });
}