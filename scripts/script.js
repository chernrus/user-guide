var config = {
  name: 'Имя',
  phone: 'Телефон',
  email: 'Email',
  text: 'Сообщение'
}

var showPopup = function () {
  document.getElementsByClassName('popup-feedback')[0].style.display = 'block';
};

var hidePopup = function () {
  document.getElementsByClassName('popup-feedback')[0].style.display = 'none';
  console.log('safdsfsdfsd');
};

var validateName = function (name) {
  return (name.length >= 5);
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
  return (text.length >= 10);
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
  if (result.status == "error") {
    document.getElementsByName(result.fields[0])[0].style.border= '1px solid red';
    showErrorMessage(result);
  } else {
    showSuccessMessage(result);
    console.log(result.status);
  };
};

// отправка данных
var sendForm = function (formData) {
  var method = "POST",
  url = "https://test.em70.ru/rav/callback/";

  makeRequest(url, responseCallback, method, formData);
};

var showErrorMessage = function (result) {
  document.getElementsByClassName("responseMessage")[0].innerText = "Неправильное поле - " +
  config[result.fields[0]];
   document.getElementsByClassName("responseMessage")[0].style.color = "red";
};

var showSuccessMessage = function (result) {
  document.getElementsByClassName("responseMessage")[0].innerText = "Сообщение успешно отправлено";
  document.getElementsByClassName("responseMessage")[0].style.color = "green";
};

// main функция - валидация формы, отправка данных - sendForm
var validation = function (event) {
  event.preventDefault();

  var formData = new FormData(document.forms.formH);
  var nameForValidate = formData.get("name");
  var phoneForValidate = formData.get("country-code") + formData.get("phone");
  var emailForValidate = formData.get("email");
  var textForValidate = formData.get("text");

  if(validateName(nameForValidate)) {
    console.log(validateName(nameForValidate));
    document.getElementsByName('name')[0].style.border= '1px solid green';
  } else {
    console.log(validateName(nameForValidate));
    document.getElementsByName('name')[0].style.border= '1px solid red';
    return false;
  };

  if(validatePhone(phoneForValidate)) {
    document.getElementsByName('phone')[0].style.border= '1px solid green';//сделать поле зеленым !!!!!В ОТДЕЛЬНУЮ ФУНКЦИЮ!!!

    phone = transformPhone(phoneForValidate);
    formData.set("phone",phone);
  } else {
    document.getElementsByName('phone')[0].style.border= '1px solid red';
    return false;
  };

  if(validateEmail(emailForValidate)) {
    document.getElementsByName('email')[0].style.border= '1px solid green';//сделать поле зеленым
  } else {
    document.getElementsByName('email')[0].style.border= '1px solid red';//сделать поле красным, вывести ошибку
    return false;
  };

  if(validateText(textForValidate)) {
    console.log(validateText(textForValidate));
    document.getElementsByName('text')[0].style.border= '1px solid green';
  } else {
     console.log(validateText(textForValidate));
     document.getElementsByName('text')[0].style.border= '1px solid red';
     return false;
  };

  formData.delete("country-code");
  sendForm(formData);

  console.log(formData.get("name") + '\n' + formData.get("phone") + '\n'
    + formData.get("email") + '\n' +  formData.get("text"));
};
