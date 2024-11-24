function submitForm(event) {
  event.preventDefault(); // Prevent default form submission behavior
  const semester = document.getElementById("semester").value; // Get the selected semester
  document.getElementById("semester").value = semester; // Set the selected semester in a hidden input field inside the form
  document.getElementById("formData").submit(); // Submit the form
}
function addbook(event) {
  event.preventDefault(); // Prevent default form submission behavior
  const semester = document.getElementById("add_semester").value; // Get the selected semester
  document.getElementById("add_semester").value = semester; // Set the selected semester in a hidden input field inside the form
  document.getElementById("formData_addbook").submit(); // Submit the form

}
function addBookInLibr(event) {
  event.preventDefault();
  document.getElementById("addbook_inlibr").submit();
}

document.addEventListener("DOMContentLoaded", function () {
  // const detailsSection = document.getElementById("detailsSection");
  // Reusable function to fetch and update data for a semester
  function fetchAndUpdateData(semester) {
    fetch(`/data/${semester}`)
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector("#student_detailsid tbody");
        tableBody.innerHTML = "";

        data.forEach(item => {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${item.seq}</td><td class="clickable">${item._id}</td>`;
          tableBody.appendChild(tr);

        });

        tableBody.querySelectorAll("tr td:nth-child(2)").forEach(cell => {
          cell.addEventListener("click", function () {
            const name = cell.textContent;
            // const semester = document.getElementById("semester").value;
            var formData_addbookDiv = document.getElementById('formData_addbook');
            if (formData_addbookDiv.style.display === "none") {
              formData_addbookDiv.style.display = "block";
            }
            else {
              formData_addbookDiv.style.display = "none";
            }
            fetchDataByName(name, semester); // Fetch data for the clicked name and selected semester
          });
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  // Function to fetch data for a collection by name and semester
  function fetchDataByName(name, semester) {
    fetch(`/details/${name}?semester=${semester}`)
      .then(response => response.json())
      .then(data => {
        const tableBody = document.querySelector("#bookIssueid tbody");
        tableBody.innerHTML = "";
        const headerDiv = document.getElementById('detailsSection');
        // Set the h3 data dynamically
        const h3Element = headerDiv.querySelector("h3");
        h3Element.textContent='';
        h3Element.textContent = `All info about all issue books from ${semester} - Name: ${name}`;

        data.forEach(item => {
          const tr = document.createElement("tr");
          tr.innerHTML = `<td>${item.bookId}</td><td>${item.authorName}</td><td>${item.subjectName}</td><td>${item.date}</td>`;
          tableBody.appendChild(tr);
        });
      })
      .catch(error => console.error('Error fetching data:', error));
  }
  // Add event listeners to semester links dynamically
  const semesterLinks = document.querySelectorAll('.semester-link');
  semesterLinks.forEach(link => {
    link.addEventListener('click', function (event) {
      event.preventDefault(); // Prevent default anchor tag behavior
      const semester = this.dataset.semester;
      const ttableBody = document.querySelector("#bookIssueid tbody");
      ttableBody.innerHTML = "";
      const headerDiv = document.getElementById('detailsSection');
      const h3Element = headerDiv.querySelector("h3");
      h3Element.textContent='';
      var formData_addbookDiv = document.getElementById('formData_addbook');
      formData_addbookDiv.style.display = "none";
      fetchAndUpdateData(semester);
    });
  });
});
document.getElementById('findBookForm').addEventListener('submit', async function (event) {
  event.preventDefault(); // Prevent the default form submission

  const bookId = document.getElementById('bookIdd').value; // Get the book ID from the input field

  try {
    const response = await fetch(`/find?bookId=${bookId}`); // Fetch book information from the server
    const data = await response.json(); // Parse the JSON response

    // Clear previous content
    document.getElementById('bookInfo').innerHTML = '';
    // Display book information on the webpage
    const bookInfoDiv = document.getElementById('bookInfo');
    bookInfoDiv.style.display = "block";

    if (data && data.length > 0) {
      // let foundAvailable = false;
      
      data.forEach(result => {
        const { database, collection, data, availble } = result;
        if (availble) {
          // Book is available in at least one collection
          // console.log('availble if part',availble);
          const html = `
            <div class="book-info">
              <h2 id="h1">Book ${bookId} is present in ${database}, and available</h2>
            </div>
          `;
          bookInfoDiv.insertAdjacentHTML('beforeend', html);
          // foundAvailable = true;
        }
        else {
          // console.log('availble else part',availble);

          // Book is present but not available in any collection
          const html = `
            <div class="book-info">
              <h2 id="h1">Semester: ${database}, Student Name: ${collection}</h2>
              ${data.map(book => `
                <div class="book-details">
                  <p class="book-title">Book Id: ${book.bookId}</p>
                  <p>Author: ${book.authorName}</p>
                  <p>Issue date: ${book.date}</p>
                </div>
              `).join('')}
            </div>
          `;
          bookInfoDiv.insertAdjacentHTML('beforeend', html);
        }
      });
    }
  }
  catch (error) {
    // Display an error message on the webpage
    document.getElementById('bookInfo').innerText = 'An error occurred while fetching book information';
  }
});
