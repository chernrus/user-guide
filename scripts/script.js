var config = {
  name: 'Имя',
  phone: 'Телефон',
  email: 'Email',
  text: 'Сообщение'
}

// Получаем элементы
var feedback = document.getElementById('feedback');
var btn = document.getElementById("btn-show");
var span = document.getElementsByClassName("close")[0];

//Открытие формы по нажатию кнопки
btn.onclick = function() {
    feedback.style.display = "inline-block";
}

// Закрытие формы по нажатию кнопки <span> (x)
span.onclick = function() {
    feedback.style.display = "none";
}

// Закрытие формы по нажатию за пределы формы
window.onclick = function(event) {
    if (event.target == feedback) {
        feedback.style.display = "none";
    }
}

// Валидатор для имени
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

// Валидатор для сообщения
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
      callback(xhr.responseText);
    }
  };
};

// callback обработка принятого ответа - верные или неверные данные
var responseCallback = function (res) {
  var result = JSON.parse(res);
  //цикл для проверки всех неправильных полей
  if (result.status == "error") {
    result.fields.forEach(function(field) {
      changeFieldColor(field, 'red');
    });
    showErrorMessage(result.fields);
  } else {
    showSuccessMessage();
  };
};

// отправка данных
var sendForm = function (formData) {
  var method = "POST",
  url = "https://test.em70.ru/rav/callback/";
  makeRequest(url, responseCallback, method, formData);
};

// <- Вывод сообщений об ошибки или успешном запросе
var showErrorMessage = function (error) {
  var result = error.reduce(function(sum, current) {
    return sum + ' ' + config[current];
  }, '');
  document.getElementsByClassName("responseMessage")[0].innerText = "Вы ввели некоректные данные в поля - " + result;

    // config[error.fields[0]];
  document.getElementsByClassName("responseMessage")[0].style.color = "red";
};

var showSuccessMessage = function () {
  document.getElementsByClassName("responseMessage")[0].innerText = "Сообщение успешно отправлено";
  document.getElementsByClassName("responseMessage")[0].style.color = "green";
};//->

var changeFieldColor = function (atributeName, color) {
  document.getElementsByName(atributeName)[0].style.border= '1px solid ' + color;
};

// main функция - валидация формы, отправка данных - sendForm
var validation = function (event) {
  event.preventDefault();
  var validationState = true;
  var fields = [];

  var formData = new FormData(document.forms.formH);
  var nameForValidate = formData.get("name"),
    phoneForValidate = formData.get("country-code") + formData.get("phone"),
    emailForValidate = formData.get("email"),
    textForValidate = formData.get("text");

  if(validateName(nameForValidate)) {
    changeFieldColor('name', 'green');
  } else {
    changeFieldColor('name', 'red');
    fields.push('name');
      validationState = false;
  };

  if(validatePhone(phoneForValidate)) {
    changeFieldColor('phone', 'green');
    phone = transformPhone(phoneForValidate);
    formData.set('phone',phone);
  } else {
    changeFieldColor('phone', 'red');
    fields.push('phone');
    validationState = false;
  };

  if(validateEmail(emailForValidate)) {
    changeFieldColor('email', 'green');
  } else {
    changeFieldColor('email', 'red');
    fields.push('email');
    validationState = false;
  };

  if(validateText(textForValidate)) {
    changeFieldColor('text', 'green');
  } else {
     changeFieldColor('text', 'red');
     fields.push('text');
     validationState = false;
  };

  if(validationState) {
    formData.delete("country-code");
    sendForm(formData);
  } else {
    showErrorMessage(fields);
    return false;
  }
};
