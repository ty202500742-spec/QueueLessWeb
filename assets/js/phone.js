// Clock
function updateClock() {
    const d = new Date();
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    const hm = h + ":" + String(m).padStart(2, "0");
    const hma = hm + " " + ampm;

    ["wallTime1", "wallTime2", "wallTime4"].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = hm;
    });
    ["phoneTime1", "phoneTime2", "phoneTime4"].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = hma;
    });

    const days   = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    const months = ["January","February","March","April","May","June","July","August","September","October","November","December"];
    const dateStr = days[d.getDay()] + ", " + months[d.getMonth()] + " " + d.getDate();
    ["wallDate1", "wallDate2", "wallDate4"].forEach(function(id) {
        var el = document.getElementById(id);
        if (el) el.textContent = dateStr;
    });
}
updateClock();
setInterval(updateClock, 10000);

function nowTime() {
    const d = new Date();
    let h = d.getHours(), m = d.getMinutes();
    const ampm = h >= 12 ? "PM" : "AM";
    h = h % 12 || 12;
    return h + ":" + String(m).padStart(2, "0") + " " + ampm;
}

function buzzFrame(frameId) {
    var frame = document.getElementById(frameId);
    if (!frame) return;
    frame.classList.remove("buzz");
    void frame.offsetWidth;
    frame.classList.add("buzz");
    setTimeout(function() { frame.classList.remove("buzz"); }, 400);
}

function setConnected(label) {
    var dot = document.getElementById("connDot");
    if (dot) dot.classList.remove("idle");
    var lbl = document.getElementById("connLabel");
    if (lbl) lbl.textContent = label;
    var lsDot = document.getElementById("lsDot");
    if (lsDot) lsDot.style.background = "#22c55e";
    var lsLbl = document.getElementById("lsLabel");
    if (lsLbl) lsLbl.textContent = "Connected — receiving from Admin Dashboard";
}

function pushToArea(areaId, card) {
    var area = document.getElementById(areaId);
    if (!area) return;
    if (area.children.length >= 3) area.removeChild(area.lastChild);
    area.prepend(card);
}

// SVG icons
var bellSvg  = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.9 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z" fill="currentColor"/></svg>';
var warnSvg  = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 15h-2v-2h2v2zm0-4h-2V7h2v6z" fill="currentColor"/></svg>';
var checkSvg = '<svg viewBox="0 0 24 24" width="20" height="20"><path d="M9 16.17L4.83 12l-1.42 1.41L9 19 21 7l-1.41-1.41L9 16.17z" fill="currentColor"/></svg>';

// ─── Phone 1: 2nd in line (position === 2) ────────────────────────────────────
function showSecondInLineNotification(data) {
    var card = document.createElement("div");
    card.className = "notif-card skip-card";
    var firstName = data.name.split(" ")[0];
    card.innerHTML =
        '<div class="notif-icon skip">' + bellSvg + '</div>' +
        '<div class="notif-body">' +
            '<div class="notif-app">QueueLess</div>' +
            '<div class="notif-title">You are 2nd in line!</div>' +
            '<div class="notif-msg">Hi ' + firstName + ', 1 person is ahead of you at ' + data.window + '. Queue: ' + data.id + '. Get ready to approach.</div>' +
            '<div class="notif-meta">&#128241; ' + (data.phone || "N/A") + ' &bull; ' + nowTime() + '</div>' +
        '</div>';
    pushToArea("notifArea2", card);
    buzzFrame("phoneFrame2");
    setConnected("2nd-in-line alert received");
}

// ─── Phone 2: 1st in line (position === 1) ────────────────────────────────────
function showFirstInLineNotification(data) {
    var card = document.createElement("div");
    card.className = "notif-card";
    var firstName = data.name.split(" ")[0];
    card.innerHTML =
        '<div class="notif-icon serve">' + bellSvg + '</div>' +
        '<div class="notif-body">' +
            '<div class="notif-app">QueueLess</div>' +
            '<div class="notif-title">You are 1st in line!</div>' +
            '<div class="notif-msg">Hi ' + firstName + ', you are next to be called at ' + data.window + '. Queue: ' + data.id + '. Please approach the window now.</div>' +
            '<div class="notif-meta">&#128241; ' + (data.phone || "N/A") + ' &bull; ' + nowTime() + '</div>' +
        '</div>';
    pushToArea("notifArea4", card);
    buzzFrame("phoneFrame4");
    setConnected("1st-in-line alert received");
}

// ─── Phone 3: Now serving / done / no-show ────────────────────────────────────
function showQueueNotification(data) {
    var card = document.createElement("div");
    var isServing = data.type === "serving";
    var isSkipped = data.type === "skip";
    card.className = "notif-card" + (isServing ? "" : isSkipped ? " skip-card" : " done-card");

    var title = isServing ? "It's your turn!"
        : isSkipped ? "You were skipped"
        : "Transaction complete";

    var firstName = data.name.split(" ")[0];
    var msg = isServing
        ? "Hi " + firstName + ", please proceed to the window now. Your queue number is " + data.id + "."
        : isSkipped
        ? "Hi " + firstName + ", you were marked as no-show for queue " + data.id + ". You have been re-added to the end of the queue."
        : "Your " + (data.purpose || "request") + " has been processed successfully. Thank you!";

    var iconCls = isServing ? "serve" : isSkipped ? "skip" : "done";
    var iconSvg = isServing ? bellSvg : isSkipped ? warnSvg : checkSvg;

    card.innerHTML =
        '<div class="notif-icon ' + iconCls + '">' + iconSvg + '</div>' +
        '<div class="notif-body">' +
            '<div class="notif-app">QueueLess</div>' +
            '<div class="notif-title">' + title + '</div>' +
            '<div class="notif-msg">' + msg + '</div>' +
            '<div class="notif-meta">&#128241; ' + (data.phone || "N/A") + ' &bull; ' + nowTime() + '</div>' +
        '</div>';

    pushToArea("notifArea1", card);
    buzzFrame("phoneFrame1");
    setConnected("Queue alert received");
}

// ─── Central dispatcher ───────────────────────────────────────────────────────
function handleNotifData(data) {
    if (!data || !data.type) return;

    if (data.type === "position_alert") {
        var pos = parseInt(data.position, 10);
        if      (pos === 1) showFirstInLineNotification(data);
        else if (pos === 2) showSecondInLineNotification(data);
    } else if (data.type === "serving" || data.type === "skip" || data.type === "done") {
        showQueueNotification(data);
    }
}

// ─── Storage listener (cross-tab, no polling) ─────────────────────────────────
var _lastProcessed = null;

window.addEventListener("storage", function(e) {
    if (e.key !== "phoneNotif" || !e.newValue) return;
    if (e.newValue === _lastProcessed) return;
    _lastProcessed = e.newValue;
    try {
        handleNotifData(JSON.parse(e.newValue));
    } catch (err) {
        console.error("phoneNotif parse error:", err);
    }
});

// ─── Clear buttons ────────────────────────────────────────────────────────────
document.getElementById("clearBtn2").addEventListener("click", function() {
    document.getElementById("notifArea2").innerHTML = "";
});
document.getElementById("clearBtn4").addEventListener("click", function() {
    document.getElementById("notifArea4").innerHTML = "";
});
document.getElementById("clearBtn1").addEventListener("click", function() {
    document.getElementById("notifArea1").innerHTML = "";
    var dot = document.getElementById("connDot");
    if (dot) dot.classList.add("idle");
    var lbl = document.getElementById("connLabel");
    if (lbl) lbl.textContent = "Waiting for admin action...";
});

window.addEventListener("DOMContentLoaded", function() {
    document.getElementById("lsDot").style.background = "#eab308";
    document.getElementById("lsLabel").textContent = "Standby — open Admin Dashboard in another tab";
});