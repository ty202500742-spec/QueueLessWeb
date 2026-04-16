  let selectedQueueIndex = null;

        function loadQueue() {
            let queue = JSON.parse(localStorage.getItem("queueList")) || [];
            let table = document.getElementById("queueTableBody");

            table.innerHTML = "";

            queue.forEach((q, index) => {

                let row = document.createElement('tr');
                row.innerHTML = `
      
            <td><strong>${q.id}</strong></td>
            <td>${q.name}</td>
            <td>${q.purpose}</td>
            <td>${q.time}</td>
            <td><span class="pill waiting">${q.status}</span></td>
            <td><button class="btn-sm serve">Serve</button></td>
        
        `;

                row.querySelector(".serve").addEventListener("click", () => {
                    selectedQueueIndex = index;
                    document.getElementById("serve-modal").style.display = "block";


                });
                table.prepend(row);
            });
        }

        function confirmServe() {
            let queue = JSON.parse(localStorage.getItem("queueList")) || [];

            if (selectedQueueIndex !== null) {
                queue.splice(selectedQueueIndex, 1); // remove item
                localStorage.setItem("queueList", JSON.stringify(queue));
                selectedQueueIndex = null;

                document.getElementById("serve-modal").style.display = "none"; // hide modal
                loadQueue(); // refresh table
            }
        }

        function closeModal() {
            document.getElementById("serve-modal").style.display = "none";
        }
        loadQueue();
         