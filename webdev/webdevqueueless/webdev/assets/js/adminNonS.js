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
            <td>${q.day}</td>
            <td><span class="pill waiting">${q.status}</span></td>
            <td><a href="#serve-modal" class="btn-sm serve">Serve</a></td>
        
        `;

                row.querySelector(".serve").addEventListener("click", () => {

                    queue.splice(index, 1);

                    localStorage.setItem("queueList", JSON.stringify(queue));

                    loadQueue();

                })
                table.prepend(row);
            });
        }

        loadQueue();
