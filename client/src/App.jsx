import { useState, useEffect } from 'react';

const API_URL = 'https://mern-backend-237701.onrender.com/api/students';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ studentId: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    fetch(API_URL)
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      studentId: form.studentId,
      mssv: form.studentId,
      name: form.name,
      email: form.email
    };

    if (editingId) {
      fetch(`${API_URL}/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(() => {
        setEditingId(null);
        setForm({ studentId: '', name: '', email: '' });
        fetchStudents();
      })
      .catch(err => console.error(err));
    } else {
      fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      })
      .then(() => {
        setForm({ studentId: '', name: '', email: '' });
        fetchStudents();
      })
      .catch(err => console.error(err));
    }
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({ 
      studentId: student.studentId || student.mssv || '', 
      name: student.name || '', 
      email: student.email || '' 
    });
  };

  const handleDelete = (id) => {
    fetch(`${API_URL}/${id}`, { method: 'DELETE' })
      .then(() => fetchStudents())
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Quản Lý Sinh Viên</h2>
      
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input 
          placeholder="MSSV" 
          value={form.studentId} 
          onChange={(e) => setForm({ ...form, studentId: e.target.value })} 
          required 
          style={{ padding: '8px', flex: 1 }} 
        />
        <input 
          placeholder="Họ và Tên" 
          value={form.name} 
          onChange={(e) => setForm({ ...form, name: e.target.value })} 
          required 
          style={{ padding: '8px', flex: 1 }} 
        />
        <input 
          placeholder="Email" 
          value={form.email} 
          onChange={(e) => setForm({ ...form, email: e.target.value })} 
          required 
          style={{ padding: '8px', flex: 1 }} 
        />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: editingId ? '#faad14' : '#1890ff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          {editingId ? 'Cập Nhật' : 'Thêm Sinh Viên'}
        </button>
      </form>

      <h3 style={{ textAlign: 'center' }}>Danh Sách Sinh Viên</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'center', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th>MSSV</th>
            <th>Họ và Tên</th>
            <th>E-mail</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan="4">Chưa có dữ liệu sinh viên</td></tr>
          ) : (
            students.map((s, index) => (
              <tr key={s._id || index}>
                <td>{s.studentId || s.mssv || 'N/A'}</td>
                <td>{s.name || s.hoTen || 'N/A'}</td>
                <td>{s.email}</td>
                <td style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  <button onClick={() => handleEdit(s)} style={{ backgroundColor: '#faad14', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Edit</button>
                  <button onClick={() => handleDelete(s._id)} style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}>Delete</button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;