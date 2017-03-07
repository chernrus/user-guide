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

// Валидатор для email
var validateEmail = function (email) {
  const regex = /^(([^<>()!\[\]\\.,;:\s@"]+(\.[^<>()!\[\]\\.,;:\s@"]+)*)|(".+"))@(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,})$/;
  return regex.test(email);
};

// Валидатор для телефона
var validatePhone = function (phone) {
  const regex = /^\d{1,2}[\s.\-\(]{0,1}\d{3}[\s.\-\)]{0,1}\d{3}[\s.-]{0,1}\d{4}$/;
  return regex.test(phone);
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
      callback(xhr.responseText);
    }
  }
};

// callback обработка принятого ответа - верные или неверные данные
var responseCallback = function (res) {
  var result = JSON.parse(res);

  console.log('Неправильный формат поля - ' + config[result.fields[0]]);
}

// отправка данных
var sendForm = function (formData) {
  var method = "POST",
  url = "https://test.em70.ru/rav/callback/";

  makeRequest(url, responseCallback, method, formData);
};

// main функция - валидация формы, отправка данных - sendForm
var validation = function (event) {
  event.preventDefault();

  var form = document.forms.formH;
  var formData = new FormData(form);
  console.log(formData.get("name") + formData.get("phone") + formData.get("email") + formData.get("text")+formData.get("country-code"));
  var phoneForValidate = formData.get("country-code") + formData.get("phone");
  var emailForValidate = formData.get("email");

  if(validatePhone(phoneForValidate)) {
    //сделать поле зеленым
    phone = transformPhone(phoneForValidate);
    formData.set("phone",phone);
  } else {
    //сделать поле красным, вывести ошибку
    console.log(phoneForValidate + validatePhone(phoneForValidate));
    return false;
  };

  if(validateEmail(emailForValidate)) {
    //сделать поле зеленым
  } else {
    //сделать поле красным, вывести ошибку
    return false;
  };

  formData.delete("country-code");
  formData.set("phone","q");
  sendForm(formData);

  console.log(formData.get("name") + '\n' + formData.get("phone") + '\n'
    + formData.get("email") + '\n' +  formData.get("text"));
};
