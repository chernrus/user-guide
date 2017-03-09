var config = {
  name: 'Имя',
  phone: 'Телефон',
  email: 'Email',
  text: 'Сообщение'
}

// Get the modal
var feedback = document.getElementById('feedback');

// Get the button that opens the modal
var btn = document.getElementById("btn-show");

// Get the <span> element that closes the modal
var span = document.getElementsByClassName("close")[0];

// When the user clicks the button, open the modal
btn.onclick = function() {
    feedback.style.display = "inline-block";
}

// When the user clicks on <span> (x), close the modal
span.onclick = function() {
    feedback.style.display = "none";
}

// When the user clicks anywhere outside of the modal, close it
window.onclick = function(event) {
    if (event.target == feedback) {
        feedback.style.display = "none";
    }
}

// var showPopup = function () {
//   document.getElementsByClassName('popup-feedback')[0].style.display = 'inline-block';
// };
//
// var hidePopup = function () {
//   document.getElementsByClassName('popup-feedback')[0].style.display = 'none';
//   console.log('safdsfsdfsd');
// };

var validateName = function (name) {
  return (name.length > 5);
};

// Валидатор для телефона
var validatePhone = function (phone) {
  const regex = /^\d{1,2}[\s.\-\(]{0,1}\d{3}[\s.\-\)]{0,1}\d{3}[\s.-]{0,1}\d{4}$/;
  return regex.test(phone);
};

// Валидатор для email
var validateEmail = function (email) {
  const regex = /^(([^<>()!\[\]\\.,;:\s@"]+(\.[^<>()!\[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;
  return regex.test(email);
};

var validateText = function (text) {
  return (text.length > 10);
};

// Удаление символов из телефона
var transformPhone = function (phone) {
  phone = phone.replace(/\D/g,'');
  return phone;
};

// Ajax запрос
var makeRequest = function (url, callback, method, formData){
  var xhr = new XMLHttpRequest();
  xhr.open(method, url, true);
  xhr.send(formData); // (1)

  xhr.onreadystatechange = function() { // (3)
    if (xhr.readyState != 4) return;

    if (xhr.status != 200) {
      alert( xhr.status + ': ' + xhr.statusText );
    } else {
      console.log(xhr.responseText);
      callback(xhr.responseText);
    }
  };
};

// callback обработка принятого ответа - верные или неверные данные
var responseCallback = function (res) {
  var result = JSON.parse(res);
  console.log(result);
  //цикл для проверки всех неправильных полей
  if (result.status == "error") {
    result.fields.forEach(function(field) {
      changeFieldColor(field, 'red');
    });
    showErrorMessage(result.fields);
  } else {
    showSuccessMessage();
    console.log(result.status);
  };
};

// отправка данных
var sendForm = function (formData) {
  var method = "POST",
  url = "https://test.em70.ru/rav/callback/";
  makeRequest(url, responseCallback, method, formData);
};

var showErrorMessage = function (error) {
  var result = error.reduce(function(sum, current) {
    return sum + ' ' + config[current];
  }, '');
  console.log(result);
  document.getElementsByClassName("responseMessage")[0].innerText = "Вы ввели некоректные данные в поля - " + result;

    // config[error.fields[0]];
  document.getElementsByClassName("responseMessage")[0].style.color = "red";
};

var showSuccessMessage = function () {
  document.getElementsByClassName("responseMessage")[0].innerText = "Сообщение успешно отправлено";
  document.getElementsByClassName("responseMessage")[0].style.color = "green";
};

var changeFieldColor = function (atributeName, color) {
  document.getElementsByName(atributeName)[0].style.border= '1px solid ' + color;
};

// main функция - валидация формы, отправка данных - sendForm
var validation = function (event) {
  event.preventDefault();
  var validationState = true;
  var fields = [];

  var formData = new FormData(document.forms.formH);
  var nameForValidate = formData.get("name");
  var phoneForValidate = formData.get("country-code") + formData.get("phone");
  var emailForValidate = formData.get("email");
  var textForValidate = formData.get("text");

  if(validateName(nameForValidate)) {
    console.log(validateName(nameForValidate));
    changeFieldColor('name', 'green');
  } else {
    console.log(validateName(nameForValidate));
    changeFieldColor('name', 'red');
    validationState = false;
    fields.push('name');
  };

  if(validatePhone(phoneForValidate)) {
    changeFieldColor('phone', 'green');//сделать поле зеленым !!!!!В ОТДЕЛЬНУЮ ФУНКЦИЮ!!!
    phone = transformPhone(phoneForValidate);
    formData.set('phone',phone);
  } else {
    changeFieldColor('phone', 'red');
    validationState = false;
    fields.push('phone');
  };

  if(validateEmail(emailForValidate)) {
    changeFieldColor('email', 'green');//сделать поле зеленым
  } else {
    changeFieldColor('email', 'red');//сделать поле красным, вывести ошибку
    validationState = false;
    fields.push('email');
  };

  if(validateText(textForValidate)) {
    console.log(validateText(textForValidate));
    changeFieldColor('text', 'green');
  } else {
     console.log(validateText(textForValidate));
     changeFieldColor('text', 'red');
     validationState = false;
     fields.push('text');
  };

    // formData.set("name","asdfsdf");
    // formData.set("text","adsfdsfdsfdsfsdfdsfsdfsd");
    // formData.set("phone","a");
    // formData.set("email","adsfsdfsdfsdfsdfsdfsdfdsf");

  if(validationState) {
    formData.delete("country-code");
    sendForm(formData);
  } else {
    showErrorMessage(fields);
    return false;
  }

  console.log(formData.get("name") + '\n' + formData.get("phone") + '\n'
    + formData.get("email") + '\n' +  formData.get("text"));
};
