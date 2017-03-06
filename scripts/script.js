function showPopup() {
  document.getElementsByClassName('popup-feedback')[0].style.display = 'block';
};

function hidePopup() {
  document.getElementsByClassName('popup-feedback')[0].style.display = 'none';
  console.log('safdsfsdfsd');
};

function validateEmail(email) {
  const regex = /^(([^<>()!\[\]\\.,;:\s@"]+(\.[^<>()!\[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;
  return regex.test(email);
};

function validatePhone(phone) {
  const regex = /^\+\d{1,2}[\s.-]{0,1}\(?\d{3}\)[\s.-]{0,1}\d{3}[\s.-]{0,1}\d{4}$/;
  return regex.test(phone);
}

function validation(event) {
  event.preventDefault();
  var phone = document.getElementsByClassName("country-code")[0].value +
    document.getElementsByClassName("phone")[0].value;
  console.log(phone);
  var email = document.getElementsByClassName("email")[0].value;
  console.log(validatePhone(phone));
  if(validateEmail(email)) {
    return true;
  } else {
    return false;
  };


};
