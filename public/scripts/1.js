var nav = document.getElementById('nav');
var semesterDiv = document.getElementById('semesterid');
var student_input_formdiv = document.getElementById('formData');
var book_navDiv = document.getElementById('book_nav');
var All_bookdDiv = document.getElementById('All_bookid');
var book_input_detailsDiv = document.getElementById('book_input_detailsid');
var recordDiv = document.getElementById('recordid')
var detailsectiondiv = document.getElementById('detailsSection');
var student_detailsDiv = document.getElementById('student_detailsid');
var formData_addbookDiv = document.getElementById('formData_addbook');
var searchBookDiv = document.getElementById('searchBook');
var bookInfoDiv = document.getElementById('bookInfo');

nav.addEventListener('mouseover', () => {
  // nav2.style.backgroundColor="red";
  book_navDiv.style.marginLeft = "235px";
  recordDiv.style.marginLeft = "235px";
  student_input_formdiv.style.marginLeft = "auto";
  student_input_formdiv.style.marginRight = "auto";
  All_bookdDiv.style.marginLeft = "310px"
  book_input_detailsDiv.style.marginLeft = "310px"
  searchBookDiv.style.marginLeft = "310px"
  bookInfoDiv.style.marginLeft = "310px"

});
nav.addEventListener('mouseout', () => {
  semesterDiv.style.marginLeft = "85px";
  book_navDiv.style.marginLeft = "85px";
  recordDiv.style.marginLeft = "85px";
  student_input_formdiv.style.marginLeft = "auto";
  student_input_formdiv.style.marginRight = "auto";
  book_input_detailsDiv.style.marginLeft = "160px"
  searchBookDiv.style.marginLeft = "160px"
  bookInfoDiv.style.marginLeft = "160px"
  All_bookdDiv.style.marginLeft = "160px"

});
book_navDiv.addEventListener('mouseover', () => {
  All_bookdDiv.style.marginLeft = "270px"
  book_input_detailsDiv.style.marginLeft = "270px"
  searchBookDiv.style.marginLeft = "270px"
  bookInfoDiv.style.marginLeft = "270px"
});
book_navDiv.addEventListener('mouseout', () => {
  book_input_detailsDiv.style.marginLeft = "160px"
  searchBookDiv.style.marginLeft = "160px"
  bookInfoDiv.style.marginLeft = "160px"
  All_bookdDiv.style.marginLeft = "160px"
});
function home() {
  searchBookDiv.style.display = "none";
  book_navDiv.style.display = "none";
  recordDiv.style.display = "none";
  student_detailsDiv.style.display = "none";
  student_input_formdiv.style.display = "none";
  All_bookdDiv.style.display = "none";
  book_input_detailsDiv.style.display = "none";
  detailsectiondiv.style.display = "none";
  formData_addbookDiv.style.display = "none";
  bookInfoDiv.style.display = "none";


  if (semesterDiv.style.display === "none") {
    semesterDiv.style.display = "block";
  } else {
    semesterDiv.style.display = "none";
  }
}
function bookrecord() {
  searchBookDiv.style.display = "none";
  semesterDiv.style.display = "none";
  recordDiv.style.display = "none";
  student_detailsDiv.style.display = "none";
  student_input_formdiv.style.display = "none";
  All_bookdDiv.style.display = "none";
  book_input_detailsDiv.style.display = "none";
  formData_addbookDiv.style.display = "none";
  bookInfoDiv.style.display = "none";

  if (book_navDiv.style.display === "none") {
    book_navDiv.style.display = "block";
  } else {
    book_navDiv.style.display = "none";
  }
  fetch(`/data`)
    .then(response => response.json())
    .then(data => {
      const tableBody = document.querySelector("#allBookInfo tbody");
      tableBody.innerHTML = "";

      data.forEach(item => {
        const tr = document.createElement("tr");
        tr.innerHTML = `<td>${item.seq}</td><td>${item.bookId}</td><td>${item.authorName}</td><td>${item.subjectName}</td><td>${item.price}</td><td>${item.availble}</td>`;
        tableBody.appendChild(tr);

      });
    })
    .catch(error => console.error('Error fetching data:', error));
}
function opencloseSection(openid1, closeid1, closeid2, closeid3) {
  var open1 = document.getElementById(openid1);
  var close1 = document.getElementById(closeid1);
  var close2 = document.getElementById(closeid2);
  var close3 = document.getElementById(closeid3);
  if (open1.style.display === "none") {
    open1.style.display = "block";
  }
  else {
    open1.style.display = "none";
  }
  if (open1.style.display === "block") {
    close1.style.display = "none";
    close2.style.display = "none";
    close3.style.display = "none";
  }
}
function openSection() {
  if (student_input_formdiv.style.display === "none") {
    student_input_formdiv.style.display = "block";
  }
  else {
    student_input_formdiv.style.display = "none";
  }
  detailsectiondiv.style.display = "none";
  student_detailsDiv.style.display = "none";
}
function openTwoSections() {
  if (student_detailsDiv.style.display === "none") {
    student_detailsDiv.style.display = "block";
  }
  else {
    student_detailsDiv.style.display = "none";
  }
  if (detailsectiondiv.style.display === "none") {
    detailsectiondiv.style.display = "block";
  }
  else {
    detailsectiondiv.style.display = "none";
  }
  student_input_formdiv.style.display = "none";

}
function previous() {
  searchBookDiv.style.display = "none";
  semesterDiv.style.display = "none";
  student_detailsDiv.style.display = "none";
  student_input_formdiv.style.display = "none";
  book_input_detailsDiv.style.display = "none";
  All_bookdDiv.style.display = "none";
  book_navDiv.style.display = "none";
  formData_addbookDiv.style.display = "none";
  bookInfoDiv.style.display = "none";


  if (recordDiv.style.display === "none") {
    recordDiv.style.display = "block";
  }
  else {
    recordDiv.style.display = "none";
  }
}
function togglePasswordVisibility() {
  var passwordField = document.getElementById('password');
  var passwordFieldType = passwordField.getAttribute('type');
  if (passwordFieldType === 'password') {
    passwordField.setAttribute('type', 'text');
  } else {
    passwordField.setAttribute('type', 'password');
  }
}
function validateLogin() {
  var username = document.getElementById('username').value;
  var password = document.getElementById('password').value;
  console.log(typeof (username), username);
  console.log(typeof (password), password);
  if (username == 'jarvis') {
    if (password == 'jarvis') {
      alert('Login successful!');
      document.getElementById('back').style.display = 'none';
      window.location.href = 'home.html';
    } else {
      alert('Incorrect password. Please try again.');
    }
  } else {
    alert('Incorrect username. Please try again.');
  }
}
