
        function chooseService(purpose) {
            selectedService = purpose;

            for (let i = 1; i <= 7; i++) {
                document.getElementById("confirmBox" + i).style.display = "block";
            }

            // Determine requirements
            let requirements = "";
            switch (purpose) {
                case "Enrollment":
                case "EAT":
                case "NAT":
                case "Interview":
                    requirements = "CET Results";
                    break;
                case "Shifting":
                case "Readmission":
                case "Miscellaneous":
                case "Certificate":
                case "Diploma":
                    requirements = "School ID or COR";
                    break;
                case "Tuition Fee":
                case "TOR":
                case "ID Request":
                case "ID Replacement":
                    requirements = "COR and Required Amount";
                    break;
                case "Other fees":
                case "ID Request":
                    requirements = "School ID";
                    break;
                case "Scholarship":
                    requirements = "Form 138 or any grade report";
                    break;
                default:
                    requirements = "Check office for Requirements";
            }

            // Update all 8 confirm boxes dynamically
            for (let i = 1; i <= 8; i++) {
                document.getElementById("selectedText" + i).innerHTML = `<strong>You selected:</strong> ${purpose}`;
                document.getElementById("requirementText" + i).innerHTML = `<strong>Requirements:</strong> ${requirements}`;


            }
        }
        function addQueue(btn) {

             let popup = btn.closest(".popup");
            let queue = JSON.parse(localStorage.getItem("queueList")) || [];
                let selectedDay = popup.querySelector("#queueDay").value;
            
            if(!selectedDay) {
                alert("Please select a day before confirming.");
                return;
            }

            let qNum = "Q-" + Math.floor(Math.random() * 1000).toString().padStart(3, '0');

            let newQueue = {
                id: qNum,
                name: "Non-student User",
                purpose: selectedService,
                status: "waiting",
                day: selectedDay,
                time: new Date().toLocaleTimeString()


            };

            queue.push(newQueue);

            localStorage.setItem("queueList", JSON.stringify(queue));


            window.location.href = "nonS-quenum.html";
        }
