// Load saved data when page loads
      const inputBox = document.getElementById("input-box");
      const listContainer = document.getElementById("list-container");
      const progressBar = document.querySelector(".progress");
      const tasksCount = document.querySelector(".tasks-count");
      const completedCount = document.querySelector(".completed-count");
      const completionPercentage = document.querySelector(
        ".completion-percentage"
      );
      const toast = document.getElementById("toast");
      const emptyState = document.querySelector(".empty-state");

      function showToast(message) {
        toast.textContent = message;
        toast.classList.add("show");
        setTimeout(() => {
          toast.classList.remove("show");
        }, 2000);
      }

      function formatDate(date) {
        const options = { month: "short", day: "numeric" };
        return new Date(date).toLocaleDateString("en-US", options);
      }

      function addTask() {
        if (inputBox.value === "") {
          showToast("Please enter a task! 📝");
          return;
        }

        const li = document.createElement("li");
        li.className = "task-item";
        li.innerHTML = inputBox.value;

        // Add date badge
        const dateBadge = document.createElement("span");
        dateBadge.className = "date-badge";
        dateBadge.textContent = formatDate(new Date());
        li.appendChild(dateBadge);

        // Add delete button
        const span = document.createElement("span");
        span.className = "delete-btn";
        span.innerHTML = '<i class="fas fa-trash-alt"></i>';
        li.appendChild(span);

        listContainer.appendChild(li);

        // Hide empty state
        emptyState.style.display = "none";

        inputBox.value = "";
        showToast("Task added successfully! 🎉");
        updateProgress();
        saveData();
      }

      listContainer.addEventListener("click", function (e) {
        if (
          e.target.tagName === "LI" ||
          e.target.parentElement.tagName === "LI"
        ) {
          const li =
            e.target.tagName === "LI" ? e.target : e.target.parentElement;
          if (
            !e.target.classList.contains("delete-btn") &&
            !e.target.classList.contains("fa-trash-alt")
          ) {
            li.classList.toggle("checked");
            updateProgress();
            saveData();
            showToast(
              li.classList.contains("checked")
                ? "Task completed! 🎯"
                : "Task unchecked ↩️"
            );
          }
        }
        if (
          e.target.classList.contains("delete-btn") ||
          e.target.classList.contains("fa-trash-alt")
        ) {
          const li = e.target.closest(".task-item");
          li.style.transform = "translateX(-100px)";
          li.style.opacity = "0";
          setTimeout(() => {
            li.remove();
            updateProgress();
            saveData();
            if (listContainer.children.length === 1) {
              emptyState.style.display = "block";
            }
          }, 300);
          showToast("Task deleted! 🗑️");
        }
      });

      function updateProgress() {
        const totalTasks = listContainer.querySelectorAll(".task-item").length;
        const completedTasks =
          listContainer.querySelectorAll(".task-item.checked").length;

        const percentage =
          totalTasks === 0
            ? 0
            : Math.round((completedTasks / totalTasks) * 100);
        progressBar.style.width = percentage + "%";

        tasksCount.textContent = `${totalTasks} task${
          totalTasks !== 1 ? "s" : ""
        }`;
        completedCount.textContent = `${completedTasks} completed`;
        completionPercentage.textContent = `${percentage}%`;
      }

      function saveData() {
        localStorage.setItem(
          "taskData",
          JSON.stringify({
            tasks: listContainer.innerHTML,
            timestamp: new Date().getTime(),
          })
        );
      }

      function loadData() {
        const savedData = localStorage.getItem("taskData");
        if (savedData) {
          const data = JSON.parse(savedData);
          listContainer.innerHTML = data.tasks;

          // Show/hide empty state based on tasks
          if (listContainer.querySelectorAll(".task-item").length > 0) {
            emptyState.style.display = "none";
          }
          updateProgress();
        }
      }

      // Support for Enter key
      inputBox.addEventListener("keypress", function (e) {
        if (e.key === "Enter") {
          addTask();
        }
      });

      // Clear completed tasks
      function clearCompletedTasks() {
        const completedTasks =
          listContainer.querySelectorAll(".task-item.checked");
        completedTasks.forEach((task) => {
          task.style.transform = "translateX(-100px)";
          task.style.opacity = "0";
          setTimeout(() => {
            task.remove();
            updateProgress();
            saveData();
            if (listContainer.children.length === 1) {
              emptyState.style.display = "block";
            }
          }, 300);
        });
        if (completedTasks.length > 0) {
          showToast("Completed tasks cleared! 🧹");
        }
      }

      // Add task sort functionality
      let sortOrder = "asc";
      function sortTasks() {
        const tasks = Array.from(listContainer.querySelectorAll(".task-item"));
        if (tasks.length <= 1) return;

        tasks.sort((a, b) => {
          const textA = a.firstChild.textContent.toLowerCase();
          const textB = b.firstChild.textContent.toLowerCase();
          return sortOrder === "asc"
            ? textA.localeCompare(textB)
            : textB.localeCompare(textA);
        });

        sortOrder = sortOrder === "asc" ? "desc" : "asc";
        tasks.forEach((task) => listContainer.appendChild(task));
        showToast(`Tasks sorted ${sortOrder === "asc" ? "A-Z" : "Z-A"} 📋`);
      }

      // Load saved data when page loads
      document.addEventListener("DOMContentLoaded", loadData);

      // Add keyboard shortcuts
      document.addEventListener("keydown", function (e) {
        // Ctrl/Cmd + Enter to add task
        if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
          addTask();
        }
        // Ctrl/Cmd + Delete to clear completed
        if ((e.ctrlKey || e.metaKey) && e.key === "Delete") {
          clearCompletedTasks();
        }
        // Ctrl/Cmd + S to sort
        if ((e.ctrlKey || e.metaKey) && e.key === "s") {
          e.preventDefault();
          sortTasks();
        }
      });

      // Check for tasks that are older than 24 hours
      function checkOldTasks() {
        const tasks = listContainer.querySelectorAll(".task-item");
        const now = new Date();

        tasks.forEach((task) => {
          const dateBadge = task.querySelector(".date-badge");
          const taskDate = new Date(dateBadge.textContent);

          // Add warning style if task is older than 24 hours
          if (now - taskDate > 24 * 60 * 60 * 1000) {
            task.style.borderLeft = "4px solid #f59e0b";
          }
        });
      }

      // Check for old tasks every hour
      setInterval(checkOldTasks, 3600000);

      // Initial check for old tasks
      checkOldTasks();
      // Add these constants at the top
      const dueDateInput = document.getElementById("due-date");

      // Modify the addTask function
      function addTask() {
        if (inputBox.value === "") {
          showToast("Please enter a task! 📝");
          return;
        }

        const li = document.createElement("li");
        li.className = "task-item";

        // Create task content wrapper
        const taskContent = document.createElement("div");
        taskContent.className = "task-content";
        taskContent.textContent = inputBox.value;

        // Add priority badge based on due date urgency
        const priority = calculatePriority(dueDateInput.value);
        const priorityBadge = document.createElement("span");
        priorityBadge.className = `priority-badge priority-${priority}`;
        priorityBadge.textContent = priority.toUpperCase();

        // Add creation date badge
        const dateBadge = document.createElement("span");
        dateBadge.className = "date-badge";
        dateBadge.textContent = formatDate(new Date());

        // Add due date badge
        if (dueDateInput.value) {
          const dueDateBadge = document.createElement("span");
          dueDateBadge.className = "due-date-badge";
          dueDateBadge.innerHTML = `<i class="fas fa-clock"></i> ${formatDueDate(
            dueDateInput.value
          )}`;
          updateDueDateStatus(dueDateBadge, dueDateInput.value);
          li.appendChild(dueDateBadge);
        }

        // Add delete button
        const deleteBtn = document.createElement("span");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = '<i class="fas fa-trash-alt"></i>';

        // Append all elements
        li.appendChild(taskContent);
        li.appendChild(priorityBadge);
        li.appendChild(dateBadge);
        li.appendChild(deleteBtn);

        listContainer.appendChild(li);

        // Store the due date in the task data
        li.dataset.dueDate = dueDateInput.value;

        // Reset inputs
        inputBox.value = "";
        dueDateInput.value = "";

        // Hide empty state
        emptyState.style.display = "none";

        showToast("Task added successfully! 🎉");
        updateProgress();
        saveData();
      }

      // Add these new utility functions
      function formatDueDate(dateString) {
        const date = new Date(dateString);
        const options = {
          month: "short",
          day: "numeric",
          hour: "2-digit",
          minute: "2-digit",
        };
        return date.toLocaleDateString("en-US", options);
      }

      function calculatePriority(dueDate) {
        if (!dueDate) return "low";

        const now = new Date();
        const due = new Date(dueDate);
        const diffHours = (due - now) / (1000 * 60 * 60);

        if (diffHours <= 24) return "high";
        if (diffHours <= 72) return "medium";
        return "low";
      }

      function updateDueDateStatus(badge, dueDate) {
        const now = new Date();
        const due = new Date(dueDate);
        const diffHours = (due - now) / (1000 * 60 * 60);

        if (diffHours <= 24) {
          badge.classList.add("urgent");
        } else if (diffHours <= 72) {
          badge.classList.add("near");
        }
      }

      // Add filter functionality
      function addFilterButtons() {
        const filterContainer = document.createElement("div");
        filterContainer.className = "filter-container";

        const filters = [
          { text: "All", value: "all" },
          { text: "Active", value: "active" },
          { text: "Completed", value: "completed" },
          { text: "Due Today", value: "today" },
          { text: "Overdue", value: "overdue" },
        ];

        filters.forEach((filter) => {
          const btn = document.createElement("button");
          btn.className = "filter-btn";
          btn.textContent = filter.text;
          btn.onclick = () => filterTasks(filter.value);
          filterContainer.appendChild(btn);
        });

        document.querySelector(".progress-container").after(filterContainer);
      }

      function filterTasks(filterValue) {
        const tasks = document.querySelectorAll(".task-item");
        const now = new Date();

        tasks.forEach((task) => {
          const dueDate = new Date(task.dataset.dueDate);
          const isCompleted = task.classList.contains("checked");

          switch (filterValue) {
            case "active":
              task.style.display = !isCompleted ? "" : "none";
              break;
            case "completed":
              task.style.display = isCompleted ? "" : "none";
              break;
            case "today":
              const isToday = dueDate.toDateString() === now.toDateString();
              task.style.display = isToday ? "" : "none";
              break;
            case "overdue":
              task.style.display = dueDate < now && !isCompleted ? "" : "none";
              break;
            default:
              task.style.display = "";
          }
        });
      }

      // Initialize filter buttons
      addFilterButtons();

      // Update tasks status every minute
      setInterval(() => {
        const tasks = document.querySelectorAll(".task-item");
        tasks.forEach((task) => {
          const dueDateBadge = task.querySelector(".due-date-badge");
          if (dueDateBadge && task.dataset.dueDate) {
            updateDueDateStatus(dueDateBadge, task.dataset.dueDate);
          }
        });
      }, 60000);