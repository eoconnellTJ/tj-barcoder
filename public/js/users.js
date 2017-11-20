// var obj = require('./test.json');
if (window.location.pathname === "/user") {
document.querySelector(".button.submit").addEventListener("click", e => {
  e.preventDefault();
  var user = {
    firstName: document.querySelector("#firstname").value,
    lastName: document.querySelector("#lastname").value,
    email: document.querySelector("#email").value
  };
  var product = document.querySelector("#product").value;
  console.log("show the user==", user.firstName, user.lastName, user.email, product);
});
}