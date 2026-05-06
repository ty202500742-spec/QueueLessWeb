// ── Clock 
        function updateClock() {
            const d = new Date();
            let h = d.getHours(), m = d.getMinutes();
            const ampm = h >= 12 ? "PM" : "AM";
            h = h % 12 || 12;
            const hm = h + ":" + String(m).padStart(2, "0");
            document.getElementById("wallTime").textContent  = hm;
            document.getElementById("phoneTime").textContent = hm + " " + ampm;

            const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
            const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
            document.getElementById("wallDate").textContent  = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate();
        }

        updateClock();
        setInterval(updateClock, 10000);

        // ── Notification renderer 
        function nowTime() {
            const d = new Date();
            let h = d.getHours(), m = d.getMinutes();
            const ampm = h >= 12 ? "PM" : "AM";
            h = h % 12 || 12;
            return h + ":" + String(m).padStart(2, "0") + " " + ampm;
        }

        function showNotification(data) {
            const area  = document.getElementById("notifArea");
            const frame = document.getElementById("phoneFrame");
            const card  = document.createElement("div");

            const isServing = data.type === "serving";

            card.className = "notif-card" + (isServing ? "" : " done-card");

            const iconSvg = isServing
                // bell icon
                ? '<svg viewBox="0 0 24 24"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6V11c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/></svg>'
                // checkmark icon
                : '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41z"/></svg>';

            const title = isServing ? "It\'s your turn!" : "Transaction complete";
            const msg   = isServing
                ? "Hi " + data.name.split(" ")[0] + ", please proceed to the window now. Your queue number is " + data.id + "."
                : "Your " + data.purpose + " request has been processed successfully. Thank you!";

            card.innerHTML =
                '<div class="notif-icon ' + (isServing ? "serve" : "done") + '">' + iconSvg + '</div>' +
                '<div class="notif-body">' +
                    '<div class="notif-app">QueueLess</div>' +
                    '<div class="notif-title">' + title + '</div>' +
                    '<div class="notif-msg">'   + msg   + '</div>' +
                    '<div class="notif-meta">&#128241; ' + (data.phone || "N/A") + ' &bull; ' + nowTime() + '</div>' +
                '</div>';

            // max 3 notifications visible
            if (area.children.length >= 3) area.removeChild(area.lastChild);
            area.prepend(card);

            // vibrate the phone frame
            frame.classList.remove("buzz");
            void frame.offsetWidth; // reflow to restart animation
            frame.classList.add("buzz");
            setTimeout(() => frame.classList.remove("buzz"), 400);

            // update connection dot
            document.getElementById("connDot").classList.remove("idle");
            document.getElementById("connLabel").textContent = "Notification received from admin";
            document.getElementById("lsDot").style.background = "#22c55e";
            document.getElementById("lsLabel").textContent = "Connected — receiving from Admin Dashboard";
        }

        // ── Listen for admin-dash.js writing to "phoneNotif" 
        // The storage event fires on OTHER tabs/windows that share the same origin.
        window.addEventListener("storage", function (e) {
            if (e.key !== "phoneNotif") return;
            if (!e.newValue) return;

            try {
                const data = JSON.parse(e.newValue);
                showNotification(data);
            } catch (err) {
                console.error("phoneNotif parse error:", err);
            }
        });

        // ── Clear button ───
        document.getElementById("clearBtn").addEventListener("click", () => {
            document.getElementById("notifArea").innerHTML = "";
            document.getElementById("connDot").classList.add("idle");
            document.getElementById("connLabel").textContent = "Waiting for admin action...";
        });

        // ── Mark as connected once page is ready ──────
        window.addEventListener("DOMContentLoaded", () => {
            document.getElementById("lsDot").style.background = "#eab308";
            document.getElementById("lsLabel").textContent    = "Standby — open Admin Dashboard in another tab";
        });

        window.addEventListener("phoneNotifEvent", function (e) {
    showNotification(e.detail);
});