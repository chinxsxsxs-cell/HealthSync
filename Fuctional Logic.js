let patients = JSON.parse(localStorage.getItem('hs_patients')) || [];
let currentResults = [];

function showSection(id) {
    document.querySelectorAll('.section').forEach(s => s.classList.add('hidden'));
    document.getElementById(id).classList.remove('hidden');
    if(id === 'lab-results') updatePatientDropdown();
}

function savePatient() {
    const patient = {
        id: document.getElementById('pID').value || Date.now().toString(),
        name: document.getElementById('pName').value,
        dob: document.getElementById('pDob').value,
        gender: document.getElementById('pGender').value,
        bloodType: document.getElementById('pBlood').value,
        philhealth: document.getElementById('pPhilHealth').value,
        allergies: document.getElementById('pAllergies').value.split('\n'),
        physician: document.getElementById('pPhysician').value,
        source: document.getElementById('regSource').value,
        regDate: new Date().toLocaleString()
    };

    patients.push(patient);
    localStorage.setItem('hs_patients', JSON.stringify(patients));
    alert("Patient Registered Successfully!");
    document.getElementById('regForm').reset();
}

function updatePatientDropdown() {
    const select = document.getElementById('patientSelect');
    select.innerHTML = '<option value="">Select Patient</option>';
    patients.forEach(p => {
        let opt = document.createElement('option');
        opt.value = p.id;
        opt.innerHTML = `${p.name} (${p.id})`;
        select.appendChild(opt);
    });
}

function loadPatientData() {
    const val = document.getElementById('patientSelect').value;
    document.getElementById('analyteForm').className = val ? "" : "hidden";
    currentResults = [];
    document.getElementById('resultBody').innerHTML = "";
}

function addAnalyte() {
    const analyte = {
        name: document.getElementById('analyteName').value,
        val: document.getElementById('analyteValue').value,
        status: document.getElementById('analyteStatus').value
    };
    currentResults.push(analyte);
    
    const row = `<tr><td>${analyte.name}</td><td>${analyte.val}</td><td>${analyte.status}</td></tr>`;
    document.getElementById('resultBody').innerHTML += row;
}

async function generatePDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const pId = document.getElementById('patientSelect').value;
    const p = patients.find(p => p.id === pId);

    // Header
    doc.setFontSize(18);
    doc.setTextColor(46, 125, 50); // Primary Green
    doc.text("MERCADO HOSPITAL", 105, 20, { align: "center" });
    doc.setFontSize(10);
    doc.setTextColor(0, 0, 0);
    doc.text("Laboratory Department - Official Result", 105, 26, { align: "center" });
    doc.line(20, 30, 190, 30);

    // Patient Info
    doc.setFont(undefined, 'bold');
    doc.text(`Patient Name: ${p.name}`, 20, 40);
    doc.text(`Patient ID: ${p.id}`, 140, 40);
    doc.setFont(undefined, 'normal');
    doc.text(`DOB: ${p.dob} | Gender: ${p.gender}`, 20, 45);
    doc.text(`Attending Physician: ${p.physician}`, 20, 50);
    doc.text(`Date: ${new Date().toLocaleDateString()}`, 140, 50);

    // Results Table
    doc.setFillColor(232, 245, 233);
    doc.rect(20, 60, 170, 8, 'F');
    doc.text("ANALYTE", 25, 65);
    doc.text("RESULT", 80, 65);
    doc.text("FLAG/REFERENCE", 140, 65);

    let y = 75;
    currentResults.forEach(res => {
        doc.text(res.name, 25, y);
        doc.text(res.val, 80, y);
        doc.text(res.status, 140, y);
        y += 10;
    });

    // Footer
    doc.setFontSize(8);
    doc.text("Electronically Signed: Medical Technologist / Pathologist", 20, 280);
    
    doc.save(`Result_${p.name}.pdf`);
}

function logout() {
    if(confirm("Are you sure you want to logout?")) {
        window.location.reload();
    }
}


