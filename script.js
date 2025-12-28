let deadlines = [];
let editIndex = null;

const saved = localStorage.getItem("deadlines");
if (saved) {
  deadlines = JSON.parse(saved);
} else {
  // default Pakistani deadlines (first-time users only)
  deadlines = [
    { title: "HEC Scholarship Application", date: "2026-03-15", category: "Scholarship" },
    { title: "University Admission Round 1", date: "2026-04-01", category: "University" },
    { title: "Transcript Attestation IBCC", date: "2026-02-28", category: "Documents" }
  ];
}

const container = document.getElementById("deadline-list");

function renderDeadlines() {
    container.innerHTML = "";

    const today = new Date();

    deadlines.forEach((d, index) => {
        const item = document.createElement("div");
        item.className = "deadline-item";

        // calculate days remaining
        const deadlineDate = new Date(d.date);
        const diffTime = deadlineDate - today;
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        // prepare alert if deadline is within next 3 days
        let alertText = "";
        if (diffDays <= 3 && diffDays >= 0) {
            alertText = `<span style="color:red; font-weight:bold;">⚠️ Due in ${diffDays} day(s)</span><br>`;
        }

        item.innerHTML = `
            <strong>${d.title}</strong><br>
            ${alertText}
            Date: ${d.date}<br>
            Category: ${d.category}<br>
            <button class="edit-btn" data-index="${index}">Edit</button>
            <button class="delete-btn" data-index="${index}">Delete</button>
            <hr>
        `;

        container.appendChild(item);
    });

    // re-attach handlers
    attachEditHandlers();
    attachDeleteHandlers();
}



renderDeadlines();

const form = document.getElementById("add-deadline-form");

form.addEventListener("submit", function (e) {
  e.preventDefault();

  const title = document.getElementById("deadline-title").value;
  const date = document.getElementById("deadline-date").value;
  const category = document.getElementById("deadline-category").value || "General";

  if (!title || !date) return;

  if (editIndex !== null) {
    // editing existing
    deadlines[editIndex] = { title, date, category };
    editIndex = null;
    form.querySelector("button").textContent = "Add Deadline";
  } else {
    // adding new
    deadlines.push({ title, date, category });
  }

  localStorage.setItem("deadlines", JSON.stringify(deadlines));
  renderDeadlines();
  form.reset();
});


function attachDeleteHandlers() {
  document.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      const index = this.dataset.index;

      deadlines.splice(index, 1);
      localStorage.setItem("deadlines", JSON.stringify(deadlines));
      renderDeadlines();
    });
  });
}

function attachEditHandlers() {
  document.querySelectorAll(".edit-btn").forEach(btn => {
    btn.addEventListener("click", function () {
      editIndex = this.dataset.index;

      const d = deadlines[editIndex];

      document.getElementById("deadline-title").value = d.title;
      document.getElementById("deadline-date").value = d.date;
      document.getElementById("deadline-category").value = d.category;

      form.querySelector("button").textContent = "Save Changes";
    });
  });
}
