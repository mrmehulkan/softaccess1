const API_URL = "https://script.google.com/macros/s/AKfycbxYRZHNMPkBAF58StJ2-XM6qLFf--oZgBgmB_YzxZ121lu2Y_7xedP3M2Kvww-WBf4ajQ/exec";

function loginUser() {
    const email = document.getElementById("email").value;
    const pass = document.getElementById("password").value;
    const msg = document.getElementById("msg");

    if (!email || !pass) {
        msg.innerText = "Kripya details bhariye";
        return;
    }

    fetch(`${API_URL}?action=login&email=${encodeURIComponent(email)}&password=${encodeURIComponent(pass)}`)
        .then(r => r.json())
        .then(d => {
            if (d.success) {
                localStorage.setItem("user_id", d.user_id);
                localStorage.setItem("user_name", d.name);
                localStorage.setItem("role", d.role);

                location.href = d.role === "admin"
                    ? "admin/dashboard.html"
                    : "dashboard.html";
            } else {
                msg.innerText = d.message;
            }
        })
        .catch(() => msg.innerText = "Server Error!");
}

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

    fetch(`${API_URL}?action=signup&name=${encodeURIComponent(name)}&email=${encodeURIComponent(email)}&mobile=${encodeURIComponent(mobile)}&password=${encodeURIComponent(pass)}`)
        .then(r => r.json())
        .then(d => {
            alert(d.message);
            if (d.success) location.href = "index.html";
        });
}

function logoutUser() {
    localStorage.clear();
    location.href = location.pathname.includes("admin")
        ? "../index.html"
        : "index.html";
}

function loadMySoftwares() {
    const uid = localStorage.getItem("user_id");
    if (!uid) {
        location.href = "index.html";
        return;
    }

    fetch(`${API_URL}?action=user_softwares&user_id=${uid}`)
        .then(r => r.json())
        .then(list => {
            const box = document.getElementById("list");

            box.innerHTML = list.map(s => {
                const folder = s.software_name
                    .toLowerCase()
                    .trim()
                    .replace(/\s+/g, '-');

                let action;

                // 📲 ANDROID APK
                if (folder === "mandijapk") {
                    action = "window.location.href='https://raw.githubusercontent.com/mrmehulkan/softaccess1/main/softaccess/apps/mandijapk/app-release.apk'";
                }
                else if (folder === "mandi1apk") {
                    action = "window.location.href='https://raw.githubusercontent.com/mrmehulkan/softaccess1/main/softaccess/apps/mandi1apk/mandi1apk.apk'";
                }
                // 🌐 WEB APPS
                else {
                    action = `window.location.href='apps/${folder}/index.html'`;
                }

                return `
                    <div class="card">
                        <h3>${s.software_name}</h3>
                        <p>Status: <b class="${s.status.toLowerCase()}">${s.status}</b></p>
                        <button onclick="${action}" ${s.status !== 'ACTIVE' ? 'disabled' : ''}>
                            OPEN
                        </button>
                    </div>
                `;
            }).join("");
        })
        .catch(() => {
            document.getElementById("list").innerText = "Software load nahi ho paye.";
        });
}


