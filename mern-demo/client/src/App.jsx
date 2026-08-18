import { useState, useEffect } from 'react';

function App() {
  // 📌 CÂU 47: State lưu danh sách sinh viên
  const [students, setStudents] = useState([]);

  // 📌 CÂU 48: State lưu dữ liệu Form nhập
  const [formData, setFormData] = useState({
    studentId: '',
    name: '',
    email: ''
  });

  const API_URL = 'https://probable-meme-v6x6pq66wrv6cpr6r-5000.app.github.dev/api/students';

  // 📌 CÂU 47: Gọi API GET /api/students lấy danh sách sinh viên
  const fetchStudents = async () => {
    try {
      const response = await fetch(API_URL);
      const data = await response.json();
      setStudents(data);
    } catch (error) {
      console.error('Lỗi khi lấy danh sách sinh viên:', error);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  // 📌 CÂU 48: Cập nhật state khi nhập vào các input
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // 📌 CÂU 49: Gửi Request POST /api/students để thêm sinh viên mới
  const handleSubmit = async (e) => {
    e.preventDefault(); // Ngăn trang web bị reload lại khi submit
    try {
      const response = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData), // Chuyển thông tin nhập trên Form thành JSON
      });

      if (response.ok) {
        alert('Thêm sinh viên thành công!');
        setFormData({ studentId: '', name: '', email: '' }); // Xóa trắng Form
        fetchStudents(); // Cập nhật lại danh sách sinh viên trên màn hình
      } else {
        alert('Thêm sinh viên thất bại!');
      }
    } catch (error) {
      console.error('Lỗi khi thêm sinh viên:', error);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>Quản Lý Sinh Viên</h2>

      {/* 📌 CÂU 48 & 49: Form nhập liệu và sự kiện onSubmit */}
      <form onSubmit={handleSubmit} style={{ marginBottom: '20px' }}>
        <div style={{ marginBottom: '10px' }}>
          <input
            type="text"
            name="studentId"
            placeholder="Mã sinh viên (MSSV)"
            value={formData.studentId}
            onChange={handleChange}
            required
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <input
            type="text"
            name="name"
            placeholder="Họ và tên"
            value={formData.name}
            onChange={handleChange}
            required
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            value={formData.email}
            onChange={handleChange}
            required
            style={{ padding: '8px', marginRight: '10px' }}
          />
          <button type="submit" style={{ padding: '8px 15px', cursor: 'pointer' }}>
            Thêm Sinh Viên
          </button>
        </div>
      </form>

      <hr />

      {/* 📌 CÂU 47: Bảng hiển thị danh sách sinh viên */}
      <h3>Danh Sách Sinh Viên</h3>
      <table border="1" cellPadding="10" cellSpacing="0" style={{ width: '100%' }}>
        <thead>
          <tr>
            <th>MSSV</th>
            <th>Họ và Tên</th>
            <th>Email</th>
          </tr>
        </thead>
        <tbody>
          {students.length > 0 ? (
            students.map((student) => (
              <tr key={student._id || student.studentId}>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.email}</td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="3" style={{ textAlign: 'center' }}>Chưa có dữ liệu sinh viên</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default App;