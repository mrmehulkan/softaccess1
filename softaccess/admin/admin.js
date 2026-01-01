function loadUsers() {
    fetch(`${API_URL}?action=users`)
        .then(r => r.json())
        .then(list => {
            const tb = document.getElementById("userTable");
            tb.innerHTML = list.map(u => `
                <tr>
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td>${u.status}</td>
                    <td><button onclick="toggleUser('${u.user_id}')">Toggle Block</button></td>
                </tr>`).join('');
        });
}

function loadPending() {
    fetch(`${API_URL}?action=pending_users`)
        .then(r => r.json())
        .then(list => {
            const tb = document.getElementById("pendingTable");
            tb.innerHTML = list.map(u => `
                <tr>
                    <td>${u.name}</td>
                    <td>${u.email}</td>
                    <td><button onclick="approveUser('${u.user_id}')">Approve</button></td>
                </tr>`).join('');
        });
}

function approveUser(id) {
    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "approve_user", user_id: id })
    }).then(() => location.reload());
}

function toggleUser(id) {
    fetch(API_URL, {
        method: "POST",
        body: JSON.stringify({ action: "toggle_user", user_id: id })
    }).then(() => loadUsers());
}
