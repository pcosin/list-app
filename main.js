import apiUrl  from "./config.js";
window.onload = function () {
  const isLoggedIn = localStorage.getItem("isLoggedIn");
  if (isLoggedIn) {
    window.location.href = "./home.html";
  } else {
    const $login = document.getElementById("login-form");

    if ($login) {
      $login.addEventListener("submit", async (e) => {
        e.preventDefault();
        const username = document.getElementById("username").value;
        const password = document.getElementById("password").value;

        try {
          const response = await fetch(`${apiUrl}/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ username, password }),
          });

          if (response.ok) {
            const user = await response.json();

            localStorage.setItem("user", JSON.stringify(user));

            localStorage.setItem("isLoggedIn", true);

            setTimeout(function () {
              window.location.href = "./home.html";
            }, 1000);
          } else {
            const error = await response.json();
            alert(error.message || "Error en la autenticación");
          }
        } catch (error) {
          console.error(error);
          alert("Error en la autenticación");
        }
      });
    }
  }
};
