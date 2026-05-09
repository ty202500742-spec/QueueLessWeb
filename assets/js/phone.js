//  Clock 
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
           const isSkipped = data.type === "skip";

            card.className = "notif-card" + (isServing ? "" : isSkipped ? " skip-card" : " done-card");

           const iconSvg = isServing
    ? '<svg viewBox="0 0 24 24"><path d="M12 22c1.1..."/></svg>'  // bell
    : isSkipped
    ? '<svg viewBox="0 0 24 24"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z"/></svg>' // info/skip
    : '<svg viewBox="0 0 24 24"><path d="M9 16.17L4.83..."/></svg>'; // checkmark

           const title = isServing ? "It\'s your turn!"
              : isSkipped ? "You were skipped"
              : "Transaction complete";
            const msg = isServing
    ? "Hi " + data.name.split(" ")[0] + ", please proceed to the window now. Your queue number is " + data.id + "."
    : isSkipped
    ? "Hi " + data.name.split(" ")[0] + ", you were marked as no-show for queue " + data.id + ". You have been re-added to the end of the queue."
    : "Your " + data.purpose + " request has been processed successfully. Thank you!";
            card.innerHTML =
                '<div class="notif-icon ' + (isServing ? "serve" : isSkipped ? "skip" : "done") + '">' + iconSvg + '</div>' +
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
            void frame.offsetWidth;
            frame.classList.add("buzz");
            setTimeout(() => frame.classList.remove("buzz"), 400);

            // update connection dot
            document.getElementById("connDot").classList.remove("idle");
            document.getElementById("connLabel").textContent = "Notification received from admin";
            document.getElementById("lsDot").style.background = "#22c55e";
            document.getElementById("lsLabel").textContent = "Connected — receiving from Admin Dashboard";
        }

        // ── Listen for admin-dash.js writing to "phoneNotif" 
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

        // Clear button 
        document.getElementById("clearBtn").addEventListener("click", () => {
            document.getElementById("notifArea").innerHTML = "";
            document.getElementById("connDot").classList.add("idle");
            document.getElementById("connLabel").textContent = "Waiting for admin action...";
        });

        window.addEventListener("DOMContentLoaded", () => {
            document.getElementById("lsDot").style.background = "#eab308";
            document.getElementById("lsLabel").textContent    = "Standby — open Admin Dashboard in another tab";
        });

        window.addEventListener("phoneNotifEvent", function (e) {
    showNotification(e.detail);
});