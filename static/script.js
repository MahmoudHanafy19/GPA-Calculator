let subjects = [];

function addSubject() {
    const name = document.getElementById("subject_name").value;
    const grade = parseFloat(document.getElementById("subject_grade").value);
    const hours = parseInt(document.getElementById("subject_hours").value);

    if (!name || isNaN(grade) || isNaN(hours)) {
        alert("Please enter valid subject details.");
        return;
    }

    const subject = { name, grade, hours };
    subjects.push(subject);

    const list = document.getElementById("subject_list");
    const item = document.createElement("li");
    const index = subjects.length - 1;
    item.innerHTML = `
    <strong>subject ${index + 1}:</strong> ${name} - Grade: ${grade}, Hours: ${hours}
    <div style="margin-top: 8px;">
        <button onclick="removeSubject(${index})" style="margin-right: 5px;">❌</button>
        <button onclick="editSubject(${index})">✏️</button>
    </div>
`;
    item.id = `subject-${index}`;
    list.appendChild(item);

    document.getElementById("subject_name").value = "";
    document.getElementById("subject_grade").value = "";
    document.getElementById("subject_hours").value = "";
}


function removeSubject(index) {
    subjects.splice(index, 1);
    document.getElementById(`subject-${index}`).remove();

    // Clear the subject list and re-render all subjects to keep everything in sync
    const list = document.getElementById("subject_list");
    list.innerHTML = "";
    subjects.forEach((subject, i) => {
        const item = document.createElement("li");
        item.id = `subject-${i}`;
        item.innerHTML = `
        <strong>subject ${i + 1}:</strong> ${subject.name} - Grade: ${subject.grade}, Hours: ${subject.hours}
        <div style="margin-top: 8px;">
            <button onclick="removeSubject(${i})" style="margin-right: 5px;">❌</button>
            <button onclick="editSubject(${i})">✏️</button>
        </div>
        `;
        list.appendChild(item);
    });
}
function editSubject(index) {
    const item = document.getElementById(`subject-${index}`);
    const subject = subjects[index];

    // Replace the list item content with input fields and save/cancel buttons
    item.innerHTML = `
        <input type="text" id="edit_name_${index}" value="${subject.name}" />
        <input type="number" id="edit_grade_${index}" value="${subject.grade}" step="0.01" />
        <input type="number" id="edit_hours_${index}" value="${subject.hours}" />
        <button onclick="saveEdit(${index})">💾</button>
        <button onclick="cancelEdit(${index})">✖️</button>
    `;
}

function saveEdit(index) {
    const name = document.getElementById(`edit_name_${index}`).value;
    const grade = parseFloat(document.getElementById(`edit_grade_${index}`).value);
    const hours = parseInt(document.getElementById(`edit_hours_${index}`).value);

    if (!name || isNaN(grade) || isNaN(hours)) {
        alert("Please enter valid subject details.");
        return;
    }

    subjects[index] = { name, grade, hours };

    const item = document.getElementById(`subject-${index}`);
    item.innerHTML = `
    <strong>subject ${index + 1}:</strong> ${name} - Grade: ${grade}, Hours: ${hours}
    <div style="margin-top: 8px;">
        <button onclick="removeSubject(${index})" style="margin-right: 5px;">❌</button>
        <button onclick="editSubject(${index})">✏️</button>
    </div>
    `;
}

function cancelEdit(index) {
    const subject = subjects[index];
    const item = document.getElementById(`subject-${index}`);
    item.innerHTML = `
    <strong>subject ${index + 1}:</strong> ${subject.name} - Grade: ${subject.grade}, Hours: ${subject.hours}
    <div style="margin-top: 8px;">
        <button onclick="removeSubject(${index})" style="margin-right: 5px;">❌</button>
        <button onclick="editSubject(${index})">✏️</button>
    </div>
    `;
}

async function calculateGPA() {
    if (subjects.length === 0) {
        document.getElementById('result').textContent = 'Please add subjects first.';
        return;
    }

    const response = await fetch('/calculate', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ subjects }),
    });

    const data = await response.json();

    let resultText = '';
    data.subjects.forEach(sub => {
        resultText += `${sub.name} – Grade: ${sub.letter}\n`;
    });

    resultText += `\nYour GPA: ${data.gpa}`;

    // عرض النتيجة داخل عنصر <pre> أو بطريقة تحافظ على التنسيق
    const resultDiv = document.getElementById('result');
    resultDiv.innerHTML = `<pre>${resultText}</pre>`;
}



function toggleMode() {
    const body = document.body;
    const toggle = document.getElementById("modeToggle");
    if (toggle.checked) {
        body.classList.remove("dark-mode");
        body.classList.add("light-mode");
    } else {
        body.classList.remove("light-mode");
        body.classList.add("dark-mode");
    }
}

