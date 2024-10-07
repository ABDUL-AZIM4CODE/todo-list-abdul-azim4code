const taskInput = document.getElementById("task-input");
        const taskTimeInput = document.getElementById("task-time");
        const taskList = document.getElementById("task-list");
        const calendar = document.getElementById("calendar");
        let tasks = [];
        let taskHistory = {};  // To store completed tasks for each day
        
        // Load tasks from localStorage
        window.onload = function() {
            loadTasks();
            renderCalendar();
        };
        
        // Add a new task with a time slot
        function addTask() {
            const task = taskInput.value.trim();
            const taskTime = taskTimeInput.value.trim();
            if (task && taskTime) {
                tasks.push({ task: task, time: taskTime, completed: false });
                taskInput.value = "";
                taskTimeInput.value = "";
                saveTasks();
                renderTasks();
                renderCalendar();
            }
        }
        
        // Render the current day's tasks
        function renderTasks() {
            taskList.innerHTML = tasks.map((taskObj, index) => `
                <li class="${taskObj.completed ? 'completed' : ''}">
                    ${taskObj.task} at ${taskObj.time}
                    <button onclick="removeTask(${index})" class="remove-task">X</button>
                </li>
            `).join("");
        }
        
        // Toggle task completion
        function toggleTask(index) {
            tasks[index].completed = !tasks[index].completed;
            saveTasks();
            renderTasks();
        }
        
        // Remove a task
        function removeTask(index) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
            renderCalendar();
        }
        
        // Save tasks to localStorage
        function saveTasks() {
            const today = new Date().toISOString().split("T")[0];
            localStorage.setItem("tasks", JSON.stringify(tasks));
            localStorage.setItem("lastUpdated", today);
        }
        
        // Load tasks from localStorage
        function loadTasks() {
            tasks = JSON.parse(localStorage.getItem("tasks")) || [];
            renderTasks();
        }
        
        // Render the time-blocked calendar (Google Calendar style)
        function renderCalendar() {
            calendar.innerHTML = "";  // Clear previous calendar content
        
            const hours = Array.from({length: 12}, (_, i) => i + 8);  // From 8 AM to 8 PM
            const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
        
            // Create Time Labels on the left column
            hours.forEach(hour => {
                const timeLabel = document.createElement("div");
                timeLabel.className = "calendar-time";
                timeLabel.innerText = `${hour}:00`;
                calendar.appendChild(timeLabel);
            });
        
            // Create Day Labels
            days.forEach(day => {
                const dayLabel = document.createElement("div");
                dayLabel.className = "calendar-time";
                dayLabel.innerText = day;
                calendar.appendChild(dayLabel);
            });
        
            // Create a grid for each hour and day slot
            hours.forEach(hour => {
                days.forEach(day => {
                    const daySlot = document.createElement("div");
                    daySlot.className = "calendar-day";
        
                    // Check if there are tasks for this time
                    tasks.forEach(task => {
                        if (parseInt(task.time.split(":")[0]) === hour) {
                            const taskDiv = document.createElement("div");
                            taskDiv.className = "calendar-event";
                            taskDiv.innerText = task.task;
                            daySlot.appendChild(taskDiv);
                        }
                    });
        
                    calendar.appendChild(daySlot);
                });
            });
        }
       