const api = (url, options) => fetch(`/api/${url}`, options).then(async response => {
  const data = await response.json();
  if (!response.ok) throw new Error(data.error || 'Something went wrong.');
  return data;
});

const escapeHtml = value => String(value ?? '').replace(/[&<>"']/g, character => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' })[character]);

function showSection(sectionId) {
  document.querySelectorAll('section').forEach(section => section.classList.toggle('hidden', section.id !== sectionId));
  document.querySelectorAll('.tabs button').forEach(button => button.classList.toggle('active', button.getAttribute('onclick').includes(`'${sectionId}'`)));
}

function notify(message, type = 'success') {
  const element = document.getElementById('notice');
  element.textContent = message; element.className = `notice ${type}`;
  setTimeout(() => { element.className = 'notice hidden'; }, 3500);
}

async function loadData() {
  try {
    const [students, subjects, results, stats] = await Promise.all(['students', 'subjects', 'results', 'stats'].map(url => api(url)));
    document.getElementById('studentCount').textContent = stats.students;
    document.getElementById('subjectCount').textContent = stats.subjects;
    document.getElementById('resultCount').textContent = stats.results;
    document.getElementById('passRate').textContent = `${stats.passRate}%`;
    document.getElementById('studentTable').innerHTML = students.map(item => `<tr><td>${item.id}</td><td>${escapeHtml(item.rollNo)}</td><td>${escapeHtml(item.name)}</td><td>${escapeHtml(item.email || '—')}</td><td>${escapeHtml(item.course)}</td><td>${item.year}</td><td><button class="danger" onclick="deleteStudent(${item.id})">Delete</button></td></tr>`).join('') || '<tr><td colspan="7" class="empty">No students added yet.</td></tr>';
    document.getElementById('subjectTable').innerHTML = subjects.map(item => `<tr><td>${item.id}</td><td>${escapeHtml(item.code)}</td><td>${escapeHtml(item.name)}</td></tr>`).join('') || '<tr><td colspan="3" class="empty">No subjects added yet.</td></tr>';
    document.getElementById('studentSelect').innerHTML = '<option value="">Select Student</option>' + students.map(item => `<option value="${item.id}">${escapeHtml(item.rollNo)} — ${escapeHtml(item.name)}</option>`).join('');
    document.getElementById('subjectSelect').innerHTML = '<option value="">Select Subject</option>' + subjects.map(item => `<option value="${item.id}">${escapeHtml(item.code)} — ${escapeHtml(item.name)}</option>`).join('');
    document.getElementById('resultTable').innerHTML = results.map(item => `<tr><td>${escapeHtml(item.student?.rollNo || '—')}</td><td>${escapeHtml(item.student?.name || 'Removed student')}</td><td>${escapeHtml(item.subject?.name || 'Removed subject')}</td><td>${item.marks}</td><td><span class="grade">${item.grade}</span></td><td><span class="status ${item.status.toLowerCase()}">${item.status}</span></td><td><button class="danger" onclick="deleteResult(${item.id})">Delete</button></td></tr>`).join('') || '<tr><td colspan="7" class="empty">No results saved yet.</td></tr>';
  } catch (error) { notify(error.message, 'error'); }
}

document.getElementById('studentForm').addEventListener('submit', async event => {
  event.preventDefault(); const form = event.currentTarget;
  try { await api('students', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ rollNo: form.rollNo.value, name: form.studentName.value, email: form.email.value, course: form.course.value, year: Number(form.year.value) }) }); form.reset(); notify('Student added.'); loadData(); } catch (error) { notify(error.message, 'error'); }
});
document.getElementById('subjectForm').addEventListener('submit', async event => {
  event.preventDefault(); const form = event.currentTarget;
  try { await api('subjects', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code: form.subjectCode.value, name: form.subjectName.value }) }); form.reset(); notify('Subject added.'); loadData(); } catch (error) { notify(error.message, 'error'); }
});
document.getElementById('resultForm').addEventListener('submit', async event => {
  event.preventDefault(); const form = event.currentTarget;
  try { const result = await api('results', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ studentId: Number(form.studentSelect.value), subjectId: Number(form.subjectSelect.value), marks: Number(form.marks.value) }) }); form.reset(); notify(result.message); loadData(); } catch (error) { notify(error.message, 'error'); }
});
async function deleteStudent(id) { if (confirm('Delete this student and their results?')) { await api(`students/${id}`, { method: 'DELETE' }); notify('Student deleted.'); loadData(); } }
async function deleteResult(id) { if (confirm('Delete this result?')) { await api(`results/${id}`, { method: 'DELETE' }); notify('Result deleted.'); loadData(); } }
function searchStudents() { const term = document.getElementById('searchStudent').value.toLowerCase(); document.querySelectorAll('#studentTable tr').forEach(row => row.classList.toggle('hidden', !row.textContent.toLowerCase().includes(term))); }
loadData();
