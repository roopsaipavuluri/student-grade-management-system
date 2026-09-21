const http = require('http');
const fs = require('fs');
const path = require('path');
const { readData, saveData } = require('./db');

const PORT = process.env.PORT || 3000;
const frontend = path.join(__dirname, '..', 'frontend');
const mimeTypes = { '.html': 'text/html; charset=utf-8', '.js': 'application/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8' };

function json(res, status, value) {
  res.writeHead(status, { 'Content-Type': 'application/json; charset=utf-8' });
  res.end(JSON.stringify(value));
}

function gradeFor(marks) {
  if (marks >= 90) return 'A+';
  if (marks >= 80) return 'A';
  if (marks >= 70) return 'B';
  if (marks >= 60) return 'C';
  if (marks >= 50) return 'D';
  return 'F';
}

function getResults(data) {
  return data.results.map(result => {
    const student = data.students.find(item => item.id === result.studentId);
    const subject = data.subjects.find(item => item.id === result.subjectId);
    return { ...result, student, subject, grade: gradeFor(result.marks), status: result.marks >= 50 ? 'Pass' : 'Fail' };
  });
}

function readBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', chunk => { body += chunk; if (body.length > 1e6) req.destroy(); });
    req.on('end', () => { try { resolve(body ? JSON.parse(body) : {}); } catch { reject(new Error('Invalid JSON')); } });
  });
}

function serveStatic(res, pathname) {
  const requested = pathname === '/' ? 'index.html' : pathname.slice(1);
  const file = path.resolve(frontend, requested);
  if (!file.startsWith(frontend) || !fs.existsSync(file) || fs.statSync(file).isDirectory()) return json(res, 404, { error: 'Not found' });
  res.writeHead(200, { 'Content-Type': mimeTypes[path.extname(file)] || 'application/octet-stream' });
  fs.createReadStream(file).pipe(res);
}

const server = http.createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host}`);
  const { pathname } = url;
  try {
    if (!pathname.startsWith('/api/')) return serveStatic(res, pathname);
    const data = readData();
    if (req.method === 'GET' && pathname === '/api/students') return json(res, 200, data.students);
    if (req.method === 'GET' && pathname === '/api/subjects') return json(res, 200, data.subjects);
    if (req.method === 'GET' && pathname === '/api/results') return json(res, 200, getResults(data));
    if (req.method === 'GET' && pathname === '/api/stats') {
      const results = getResults(data);
      const passed = results.filter(item => item.status === 'Pass').length;
      return json(res, 200, { students: data.students.length, subjects: data.subjects.length, results: results.length, passRate: results.length ? Math.round((passed / results.length) * 100) : 0 });
    }
    const body = await readBody(req);
    if (req.method === 'POST' && pathname === '/api/students') {
      const { rollNo, name, email = '', course, year } = body;
      if (!rollNo || !name || !course || !Number.isInteger(Number(year))) return json(res, 400, { error: 'Please provide roll number, name, course, and year.' });
      if (data.students.some(item => item.rollNo.toLowerCase() === String(rollNo).trim().toLowerCase())) return json(res, 409, { error: 'That roll number already exists.' });
      const student = { id: data.nextStudentId++, rollNo: String(rollNo).trim(), name: String(name).trim(), email: String(email).trim(), course: String(course).trim(), year: Number(year) };
      data.students.push(student); saveData(data); return json(res, 201, student);
    }
    if (req.method === 'POST' && pathname === '/api/subjects') {
      const { code, name } = body;
      if (!code || !name) return json(res, 400, { error: 'Please provide subject code and name.' });
      if (data.subjects.some(item => item.code.toLowerCase() === String(code).trim().toLowerCase())) return json(res, 409, { error: 'That subject code already exists.' });
      const subject = { id: data.nextSubjectId++, code: String(code).trim(), name: String(name).trim() };
      data.subjects.push(subject); saveData(data); return json(res, 201, subject);
    }
    if (req.method === 'POST' && pathname === '/api/results') {
      const studentId = Number(body.studentId), subjectId = Number(body.subjectId), marks = Number(body.marks);
      if (!data.students.some(item => item.id === studentId) || !data.subjects.some(item => item.id === subjectId) || !Number.isFinite(marks) || marks < 0 || marks > 100) return json(res, 400, { error: 'Select valid student and subject, and enter marks from 0 to 100.' });
      const existing = data.results.find(item => item.studentId === studentId && item.subjectId === subjectId);
      if (existing) existing.marks = marks;
      else data.results.push({ id: data.nextResultId++, studentId, subjectId, marks });
      saveData(data); return json(res, 201, { message: existing ? 'Result updated.' : 'Result saved.' });
    }
    const studentMatch = pathname.match(/^\/api\/students\/(\d+)$/);
    const resultMatch = pathname.match(/^\/api\/results\/(\d+)$/);
    if (req.method === 'DELETE' && studentMatch) {
      const id = Number(studentMatch[1]); data.students = data.students.filter(item => item.id !== id); data.results = data.results.filter(item => item.studentId !== id); saveData(data); return json(res, 200, { message: 'Student deleted.' });
    }
    if (req.method === 'DELETE' && resultMatch) {
      const id = Number(resultMatch[1]); data.results = data.results.filter(item => item.id !== id); saveData(data); return json(res, 200, { message: 'Result deleted.' });
    }
    return json(res, 404, { error: 'API route not found.' });
  } catch (error) { return json(res, 500, { error: error.message || 'Server error.' }); }
});

server.listen(PORT, () => console.log(`Student Grade Management is running at http://localhost:${PORT}`));
