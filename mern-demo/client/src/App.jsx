import { useState, useEffect } from 'react';

function App() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({ mssv: '', name: '', email: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchStudents = () => {
    fetch('http://localhost:5000/api/students')
      .then(res => res.json())
      .then(data => {
        if (Array.isArray(data)) setStudents(data);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchStudents(); }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.mssv || !form.name || !form.email) return;

    if (editingId) {
      // Cập nhật sinh viên đang chọn
      setStudents(prev => prev.map(s => s._id === editingId ? { ...s, ...form } : s));
      fetch(`http://localhost:5000/api/students/${editingId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).catch(err => console.error(err));
      setEditingId(null);
    } else {
      // Thêm mới sinh viên
      const newStudent = { ...form, _id: Date.now().toString() };
      setStudents(prev => [...prev, newStudent]);
      fetch('http://localhost:5000/api/students', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      }).catch(err => console.error(err));
    }

    setForm({ mssv: '', name: '', email: '' });
  };

  const handleEdit = (student) => {
    setEditingId(student._id);
    setForm({ mssv: student.mssv, name: student.name, email: student.email });
  };

  const handleDelete = (id) => {
    setStudents(prev => prev.filter(s => s._id !== id));
    fetch(`http://localhost:5000/api/students/${id}`, { method: 'DELETE' })
      .catch(err => console.error(err));
  };

  return (
    <div style={{ padding: '20px', maxWidth: '750px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h2 style={{ textAlign: 'center' }}>Quản Lý Sinh Viên</h2>
      <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '10px', marginBottom: '20px' }}>
        <input placeholder="MSSV" value={form.mssv} onChange={(e) => setForm({ ...form, mssv: e.target.value })} style={{ padding: '8px', flex: 1 }} />
        <input placeholder="Họ và Tên" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} style={{ padding: '8px', flex: 1 }} />
        <input placeholder="Email" value={form.email} onChange={(e) => setForm({ ...form, email: e.target.value })} style={{ padding: '8px', flex: 1 }} />
        <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer', backgroundColor: editingId ? '#faad14' : '#1890ff', color: '#fff', border: 'none', borderRadius: '4px' }}>
          {editingId ? 'Cập Nhật' : 'Thêm Sinh Viên'}
        </button>
      </form>

      <h3 style={{ textAlign: 'center' }}>Danh Sách Sinh Viên</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%', textAlign: 'center' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
            <th>Hành động</th>
          </tr>
        </thead>
        <tbody>
          {students.length === 0 ? (
            <tr><td colSpan="4">Chưa có dữ liệu sinh viên</td></tr>
          ) : (
            students.map((s, index) => (
              <tr key={s._id || index}>
                <td>{s.mssv}</td>
                <td>{s.name}</td>
                <td>{s.email}</td>
                <td style={{ display: 'flex', gap: '5px', justifyContent: 'center' }}>
                  <button 
                    onClick={() => handleEdit(s)} 
                    style={{ backgroundColor: '#faad14', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Sửa
                  </button>
                  <button 
                    onClick={() => handleDelete(s._id)} 
                    style={{ backgroundColor: '#ff4d4f', color: 'white', border: 'none', padding: '5px 10px', borderRadius: '4px', cursor: 'pointer' }}
                  >
                    Xóa
                  </button>
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
