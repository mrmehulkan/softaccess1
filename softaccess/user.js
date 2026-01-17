// ================= CONFIG =================
const API_URL =
  "https://script.google.com/macros/s/AKfycbxYRZHNMPkBAF58StJ2-XM6qLFf--oZgBgmB_YzxZ121lu2Y_7xedP3M2Kvww-WBf4ajQ/exec";

// ================= LOGIN =================
function loginUser() {
  const email = document.getElementById("email").value;
  const pass = document.getElementById("password").value;
  const msg = document.getElementById("msg");

  if (!email || !pass) {
    msg.innerText = "Kripya details bhariye";
    return;
  }

  fetch(
    `${API_URL}?action=login&email=${encodeURIComponent(
      email
    )}&password=${encodeURIComponent(pass)}`
  )
    .then((r) => r.json())
    .then((d) => {
      if (d.success) {
        localStorage.setItem("user_id", d.user_id);
        localStorage.setItem("user_name", d.name);
        localStorage.setItem("role", d.role);

        if (d.role === "admin") {
          location.href = "admin/dashboard.html";
        } else {
          location.href = "dashboard.html";
        }
      } else {
        msg.innerText = d.message;
      }
    })
    .catch(() => {
      msg.innerText = "Server Error!";
    });
}

// ================= SIGNUP =================
function signup() {
  const name = document.getElementById("name").value;
  const email = document.getElementById("email").value;
  const mobile = document.getElementById("mobile").value;
  const pass = document.getElementById("password").value;
  const conf = document.getElementById("confirm_password").value;

  if (pass !== conf) {
    alert("Password match nahi hua!");
    return;
  }

  const url = `${API_URL}?action=signup&name=${encodeURIComponent(
    name
  )}&email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(
    mobile
  )}&password=${encodeURIComponent(pass)}`;

  fetch(url)
    .then((r) => r.json())
    .then((d) => {
      alert(d.message);
      if (d.success) location.href = "index.html";
    });
}

// ================= LOGOUT =================
function logoutUser() {
  localStorage.clear();
  const path = location.pathname.includes("admin")
    ? "../index.html"
    : "index.html";
  location.href = path;
}

// ================= LOAD SOFTWARES =================
function loadMySoftwares() {
  const uid = localStorage.getItem("user_id");
  if (!uid) {
    location.href = "index.html";
    return;
  }

  fetch(`${API_URL}?action=user_softwares&user_id=${uid}`)
    .then((r) => r.json())
    .then((list) => {
      const box = document.getElementById("list");

      box.innerHTML = list
        .map((s) => {
          const folderName = s.software_name
            .toLowerCase()
            .trim()
            .replace(/\s+/g, "-");

          let action = "";

          // 📲 ANDROID APK
          if (folderName === "mandijapk") {
            action =
              "download-apk:https://raw.githubusercontent.com/mrmehulkan/softaccess1/main/softaccesss/apps/mandijapk/app-release.apk";
          }
          // 🌐 WEB SOFTWARE
          else {
            action = `open-web:apps/${folderName}/index.html`;
          }

          return `
          <div class="card">
            <h3>${s.software_name}</h3>
            <p>Status: <b class="${s.status.toLowerCase()}">${s.status}</b></p>
            <button 
              class="open-btn"
              data-action="${action}"
              ${s.status !== "ACTIVE" ? "disabled" : ""}
            >
              OPEN
            </button>
          </div>
        `;
        })
        .join("");
    })
    .catch(() => {
      document.getElementById("list").innerText =
        "Software load nahi ho paye.";
    });
}

// ================= GLOBAL CLICK HANDLER =================
document.addEventListener("click", function (e) {
  const btn = e.target.closest(".open-btn");
  if (!btn) return;

  const action = btn.getAttribute("data-action");
  if (!action) return;

  // APK download
  if (action.startsWith("download-apk:")) {
    const url = action.replace("download-apk:", "");
    window.location.href = url;
    return;
  }

  // Web open
  if (action.startsWith("open-web:")) {
    const path = action.replace("open-web:", "");
    window.location.href = path;
    return;
  }
});
