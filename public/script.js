document.addEventListener("DOMContentLoaded", () => {
    // SPA: δυναμικό main και aside
    const mainContent = document.getElementById("main-content");
    const navLinks = document.querySelectorAll("nav a");
    const asideSections = document.querySelectorAll(".aside-section");

    // Ενεργό nav
    function setActiveNav(section) {
        navLinks.forEach(link => {
            if (link.dataset.section === section) {
                link.classList.add("active");
            } else {
                link.classList.remove("active");
            }
        });
    }

    // Απόκρυψη όλων των aside εκτός από το id
    function showAside(section) {
        asideSections.forEach(div => div.classList.add("hidden"));
        const aside = document.getElementById("aside-" + section);
        if (aside) aside.classList.remove("hidden");
    }

    // Περιεχόμενο για βιογραφία
    const bioContent = {
        early: `<h2>Πρώτα Χρόνια</h2><p>Ο Μίλτος Τεντόγλου γεννήθηκε στις 18 Μαρτίου 1998 στα Γρεβενά. Από μικρή ηλικία έδειξε ιδιαίτερο ταλέντο στον αθλητισμό και ξεκίνησε την ενασχόλησή του με το άλμα εις μήκος στην εφηβεία. Η οικογένειά του και οι προπονητές του αναγνώρισαν νωρίς το ταλέντο του και τον υποστήριξαν να ακολουθήσει την αθλητική καριέρα.</p>`,
        career: `<h2>Αθλητική Καριέρα</h2><p>Ο Μίλτος Τεντόγλου είναι ο Έλληνας πρωταθλητής του άλματος εις μήκος με τεράστιες διεθνείς επιτυχίες. Κατέκτησε το χρυσό μετάλλιο στους Ολυμπιακούς Αγώνες του Τόκιο 2020 και των Παρισίων 2024, καθώς και πολλαπλά χρυσά μετάλλια σε Παγκόσμια και Ευρωπαϊκά Πρωταθλήματα. Με προσωπικό ρεκόρ 8.65m (εσωτερικού στίβου) και 8.60m (ανοιχτού στίβου), είναι ένας από τους κορυφαίους αθλητές του κόσμου στο άθλημά του.</p>`
    };
    // Περιεχόμενο για φωτογραφίες
    const photosContent = {
        competitions: `<h2>Αγώνες & Πρωταθλήματα</h2><div class="art-gallery">
            <div class="artwork-item"><img src="ΤΟΚΙΟ.jpg" alt="Ολυμπιακοί Αγώνες Τόκιο 2020" class="artwork-image"><p>Ολυμπιακοί Αγώνες Τόκιο 2020</p></div>
            <div class="artwork-item"><img src="ΠΑΡΙΣΙ.jpg" alt="Ολυμπιακοί Αγώνες Παρίσι 2024" class="artwork-image"><p>Ολυμπιακοί Αγώνες Παρίσι 2024</p></div>
            <div class="artwork-item"><img src="ΠΑΓΚΟΣΜΙΟ.jpg" alt="Παγκόσμιο Πρωτάθλημα" class="artwork-image"><p>Παγκόσμιο Πρωτάθλημα</p></div>
        </div>`,
        training: `<h2>Προπόνηση & Προετοιμασία</h2><div class="art-gallery">
            <div class="artwork-item"><img src="proponisi1.jpg" alt="Προπόνηση στο στίβο" class="artwork-image"><p>Προπόνηση στο στίβο</p></div>
            <div class="artwork-item"><img src="proponisi2.jpg" alt="Ενδυνάμωση" class="artwork-image"><p>Ενδυνάμωση & Τεχνική</p></div>
        </div>`
    };

    // Αρχική εμφάνιση
    function showSection(section) {
        setActiveNav(section);
        showAside(section);
        if (section === "bio") {
            mainContent.innerHTML = bioContent.early;
        } else if (section === "photos") {
            mainContent.innerHTML = photosContent.competitions;
        } else if (section === "achievements") {
            mainContent.innerHTML = `<h2>Διακρίσεις</h2><p>Επιλέξτε κατηγορία από το αριστερό μενού.</p>`;
        } else if (section === "links") {
            mainContent.innerHTML = `<h2>Σύνδεσμοι</h2><p>Επιλέξτε κατηγορία από το αριστερό μενού.</p>`;
        } else if (section === "admin") {
            mainContent.innerHTML = `<h2>Διαχείριση</h2><p>Συνδεθείτε ως διαχειριστής για να διαχειριστείτε διακρίσεις και συνδέσμους.</p>`;
        }
    }

    // SPA navigation
    navLinks.forEach(link => {
        link.addEventListener("click", e => {
            e.preventDefault();
            const section = link.dataset.section;
            showSection(section);
        });
    });

    // Aside υπομενού: βιογραφία
    document.querySelectorAll('#aside-bio a[data-bio]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const key = link.dataset.bio;
            mainContent.innerHTML = bioContent[key] || '';
        });
    });
    // Aside υπομενού: φωτογραφίες
    document.querySelectorAll('#aside-photos a[data-photo]').forEach(link => {
        link.addEventListener('click', e => {
            e.preventDefault();
            const key = link.dataset.photo;
            mainContent.innerHTML = photosContent[key] || '';
        });
    });

    // Aside υπομενού: διακρίσεις (fetch)
    document.querySelectorAll('#aside-achievements a[data-achievement]').forEach(link => {
        link.addEventListener('click', async e => {
            e.preventDefault();
            const key = link.dataset.achievement;
            try {
                const res = await fetch(`/api/achievements?type=${key}`);
                const data = await res.json();
                let html = `<h2>Διακρίσεις - ${key === 'olympic' ? 'Ολυμπιακές' : 'Παγκόσμια Πρωταθλήματα'}</h2>`;
                if (data.length === 0) html += '<p>Δεν υπάρχουν διακρίσεις.</p>';
                else html += '<ul>' + data.map(ach => `<li>${ach.name} (${ach.year}) - ${ach.medal}</li>`).join('') + '</ul>';
                mainContent.innerHTML = html;
            } catch {
                mainContent.innerHTML = '<p>Σφάλμα φόρτωσης διακρίσεων.</p>';
            }
        });
    });
    // Aside υπομενού: σύνδεσμοι (fetch)
    document.querySelectorAll('#aside-links a[data-link]').forEach(link => {
        link.addEventListener('click', async e => {
            e.preventDefault();
            const key = link.dataset.link;
            try {
                const res = await fetch(`/api/links?type=${key}`);
                const data = await res.json();
                let html = `<h2>Σύνδεσμοι - ${key === 'videos' ? 'Βίντεο & Συνεντεύξεις' : 'Άρθρα & Ειδήσεις'}</h2>`;
                if (data.length === 0) html += '<p>Δεν υπάρχουν σύνδεσμοι.</p>';
                else html += '<ul>' + data.map(link => `<li><a href="${link.url}" target="_blank">${link.name}</a></li>`).join('') + '</ul>';
                mainContent.innerHTML = html;
            } catch {
                mainContent.innerHTML = '<p>Σφάλμα φόρτωσης συνδέσμων.</p>';
            }
        });
    });


    // Admin login/logout (πλήρης λειτουργικότητα)
    const loginForm = document.getElementById('login-form');
    const adminLogout = document.getElementById('admin-logout');
    const adminAchievements = document.getElementById('admin-achievements');
    const adminLinks = document.getElementById('admin-links');
    let isAdmin = false;
    async function checkAdmin() {
        // Θα μπορούσε να γίνει με endpoint, εδώ απλά ελέγχουμε το UI
        if (isAdmin) {
            loginForm.classList.add('hidden');
            adminLogout.classList.remove('hidden');
            adminAchievements.classList.remove('hidden');
            adminLinks.classList.remove('hidden');
        } else {
            loginForm.classList.remove('hidden');
            adminLogout.classList.add('hidden');
            adminAchievements.classList.add('hidden');
            adminLinks.classList.add('hidden');
        }
    }
    if (loginForm) {
        loginForm.addEventListener('submit', async e => {
            e.preventDefault();
            const username = document.getElementById('username').value;
            const password = document.getElementById('password').value;
            try {
                const res = await fetch('/api/login', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ username, password })
                });
                if (res.ok) {
                    isAdmin = true;
                    showMessage('Επιτυχής σύνδεση!', true);
                } else {
                    const data = await res.json();
                    showMessage(data.message || 'Αποτυχία σύνδεσης', false);
                }
            } catch {
                showMessage('Σφάλμα σύνδεσης', false);
            }
            checkAdmin();
            mainContent.innerHTML = '<h2>Καλώς ήρθατε, διαχειριστή!</h2>';
        });
    }
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', async () => {
            await fetch('/api/logout', { method: 'POST' });
            isAdmin = false;
            showMessage('Αποσυνδεθήκατε.', true);
            checkAdmin();
            mainContent.innerHTML = '<h2>Αποσυνδεθήκατε.</h2>';
        });
    }
    checkAdmin();

    // Εμφάνιση μηνυμάτων
    function showMessage(msg, success) {
        let el = document.getElementById('msgbox');
        if (!el) {
            el = document.createElement('div');
            el.id = 'msgbox';
            el.style.position = 'fixed';
            el.style.top = '10px';
            el.style.right = '10px';
            el.style.zIndex = 1000;
            el.style.padding = '10px 20px';
            el.style.borderRadius = '6px';
            el.style.fontWeight = 'bold';
            document.body.appendChild(el);
        }
        el.textContent = msg;
        el.style.background = success ? '#2ecc40' : '#e74c3c';
        el.style.color = '#fff';
        el.style.display = 'block';
        setTimeout(() => { el.style.display = 'none'; }, 2500);
    }

    // Admin διαχείριση διακρίσεων
    if (adminAchievements) {
        document.getElementById('manage-achievements').addEventListener('click', async () => {
            if (!isAdmin) return;
            mainContent.innerHTML = '<h2>Διαχείριση Διακρίσεων</h2><div id="ach-form"></div><div id="ach-list"></div>';
            await renderAchievementsAdmin();
        });
    }
    async function renderAchievementsAdmin() {
        // Φόρμα προσθήκης
        document.getElementById('ach-form').innerHTML = `
            <form id="add-ach-form">
                <input type="text" id="ach-name" placeholder="Όνομα διοργάνωσης" required>
                <input type="number" id="ach-year" placeholder="Έτος" required>
                <input type="text" id="ach-medal" placeholder="Μετάλλιο (π.χ. Χρυσό)" required>
                <select id="ach-type"><option value="olympic">Ολυμπιακή</option><option value="world">Παγκόσμια</option></select>
                <button type="submit">Προσθήκη</button>
            </form>
        `;
        document.getElementById('add-ach-form').onsubmit = async e => {
            e.preventDefault();
            const name = document.getElementById('ach-name').value;
            const year = document.getElementById('ach-year').value;
            const medal = document.getElementById('ach-medal').value;
            const type = document.getElementById('ach-type').value;
            const res = await fetch('/api/achievements', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, year, medal, type })
            });
            if (res.ok) showMessage('Η διάκριση προστέθηκε.', true);
            else showMessage('Σφάλμα προσθήκης.', false);
            await renderAchievementsAdmin();
        };
        // Λίστα διακρίσεων
        const res = await fetch('/api/achievements');
        const data = await res.json();
        let html = '<ul>' + data.map(a => `
            <li>
                <b>${a.name}</b> (${a.year}) - ${a.medal} [${a.type === 'olympic' ? 'Ολυμπιακή' : 'Παγκόσμια'}]
                <button data-id="${a.id}" class="del-ach">Διαγραφή</button>
            </li>`).join('') + '</ul>';
        document.getElementById('ach-list').innerHTML = html;
        document.querySelectorAll('.del-ach').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.getAttribute('data-id');
                const res = await fetch(`/api/achievements/${id}`, { method: 'DELETE' });
                if (res.ok) showMessage('Διαγράφηκε.', true);
                else showMessage('Σφάλμα διαγραφής.', false);
                await renderAchievementsAdmin();
            };
        });
    }

    // Admin διαχείριση συνδέσμων
    if (adminLinks) {
        document.getElementById('manage-links').addEventListener('click', async () => {
            if (!isAdmin) return;
            mainContent.innerHTML = '<h2>Διαχείριση Συνδέσμων</h2><div id="link-form"></div><div id="link-list"></div>';
            await renderLinksAdmin();
        });
    }
    async function renderLinksAdmin() {
        // Φόρμα προσθήκης
        document.getElementById('link-form').innerHTML = `
            <form id="add-link-form">
                <input type="text" id="link-name" placeholder="Όνομα" required>
                <input type="url" id="link-url" placeholder="URL" required>
                <select id="link-type"><option value="videos">Βίντεο</option><option value="articles">Άρθρα</option></select>
                <button type="submit">Προσθήκη</button>
            </form>
        `;
        document.getElementById('add-link-form').onsubmit = async e => {
            e.preventDefault();
            const name = document.getElementById('link-name').value;
            const url = document.getElementById('link-url').value;
            const type = document.getElementById('link-type').value;
            const res = await fetch('/api/links', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, url, type })
            });
            if (res.ok) showMessage('Ο σύνδεσμος προστέθηκε.', true);
            else showMessage('Σφάλμα προσθήκης.', false);
            await renderLinksAdmin();
        };
        // Λίστα συνδέσμων
        const res = await fetch('/api/links');
        const data = await res.json();
        let html = '<ul>' + data.map(l => `
            <li>
                <a href="${l.url}" target="_blank">${l.name}</a> [${l.type === 'videos' ? 'Βίντεο' : 'Άρθρα'}]
                <button data-id="${l.id}" class="del-link">Διαγραφή</button>
            </li>`).join('') + '</ul>';
        document.getElementById('link-list').innerHTML = html;
        document.querySelectorAll('.del-link').forEach(btn => {
            btn.onclick = async () => {
                const id = btn.getAttribute('data-id');
                const res = await fetch(`/api/links/${id}`, { method: 'DELETE' });
                if (res.ok) showMessage('Διαγράφηκε.', true);
                else showMessage('Σφάλμα διαγραφής.', false);
                await renderLinksAdmin();
            };
        });
    }

    // Αρχική σελίδα
    showSection('bio');
});


