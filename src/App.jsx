import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Spin } from 'antd';
import Admin from './Admin_pages/Dashboard';
import Allstudent from './Admin_pages/AllStudent';
import Mteacher from './Admin_pages/Mteacher';
import Setting from './Admin_pages/Setting';
import ProfilePage from './Admin_pages/Profile';
import UserReports from './Admin_pages/Userreport';
import Admin_login from './Admin_pages/Admin_login';
import Tdashboard from './Teacher_pages/Tdashboard';
import Create from './Teacher_pages/Create';
import Studentrep from './Teacher_pages/Studentrep';
import Tprofile from './Teacher_pages/Tprofile';
import Alltask from './Teacher_pages/Alltask';
import Taskdetail from './Teacher_pages/Taskdetail';
import Sdashboard from './Studend_pages/Sdashboard';
import Profile from './Studend_pages/Profile';
import Join_class from './Studend_pages/Join_class';
import Student_task from './Studend_pages/Student_task';
import Task_submit from './Studend_pages/Task_submit';
import Student_reg from './Studend_pages/Student_reg';
import Student_login from './Studend_pages/Student_login';
import Teacher_login from './Teacher_pages/Teacher_login';
import Mysub from './Studend_pages/Mysub';
import HomePage from './Home/Home';
import Page from './Home/Page';
import Nologin from './Home/Nologin';
import QuizForm from './Teacher_pages/Createquiz';
import Allquiz from './Teacher_pages/Quizdata';
import Quiz from './Studend_pages/Quiz';
import Start from './Studend_pages/Start';
import Result from './Student_comp/Result';
import Studentresult from './Teacher_pages/Quizresult';
import Code from './Teacher_pages/Code';
import Mycode from './Studend_pages/Mycode';
import Cha from './Admin_comp/Cha'
function App() {
  const [auth, setAuth] = useState({ user: '', role: '' });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const role = JSON.parse(localStorage.getItem('role'))

      setAuth({ user, role });
      setLoading(false);
    };

    checkAuth();
    // console.log(auth.role);
    
  }, []);

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '30px 50px' }}>
      <Spin
        size="large"
        indicator={
          <div style={{ color: 'green', fontSize: '24px' }}>
            <i className="anticon anticon-loading anticon-spin"></i>
          </div>
        }
      />
    </div>
    );
  }

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HomePage />} />
        <Route path="/cha" element={<Cha />} />
        <Route path="/student/login" element={<Student_login />} />
        <Route path="teacher/login" element={<Teacher_login />} />
        <Route path="admin/login" element={<Admin_login />} />
        <Route path="student/register" element={<Student_reg />} />

        {/* Protected Routes */}
        <Route path="/admin/*" element={auth.role == 'admin' ? <AdminRoutes /> : <Navigate to="/admin/login" />} />
        <Route path="/teacher/*" element={auth.role == 'teacher' ? <TeacherRoutes /> : <Navigate to="/teacher/login" />} />
        <Route path="/student/*" element={auth.role == 'student' ? <StudentRoutes /> : <Navigate to="/student/login" />} />

        {/* Fallback Route */}
        <Route path="*" element={<Page />} />
      </Routes>
    </Router>
  );
}

function AdminRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Admin />} />
      <Route path="allstudent" element={<Allstudent />} />
      <Route path="mteacher" element={<Mteacher />} />
      <Route path="setting" element={<Setting />} />
      <Route path="profile" element={<ProfilePage />} />
      <Route path="userreport" element={<UserReports />} />
      <Route path="*" element={<Nologin />} />
    </Routes>
  );
}

function TeacherRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Tdashboard />} />
      <Route path="quiz" element={<QuizForm />} />
      <Route path="allquiz" element={<Allquiz />} />
      <Route path="quizresult/:id" element={<Studentresult />} />
      <Route path="profile" element={<Tprofile />} />
      <Route path="createclasswork" element={<Create />} />
      <Route path="createclasswork/:id" element={<Alltask />} />
      <Route path="createclasswork/:id/task/:taskId" element={<Taskdetail />} />
      <Route path="createclasswork/:id/studentreport" element={<Studentrep />} />
      <Route path="code/:task_id/:student_id" element={<Code />} />
      <Route path="*" element={<Nologin />} />
    </Routes>
  );
}

function StudentRoutes() {
  return (
    <Routes>
      <Route path="dashboard" element={<Sdashboard />} />
      <Route path="profile" element={<Profile />} />
      <Route path="join" element={<Join_class />} />
      <Route path="mysubmission" element={<Mysub />} />
      <Route path="join/:classid" element={<Student_task />} />
      <Route path="join/:classid/tasksubmit/:id" element={<Task_submit />} />
      <Route path="mycode/:task_id/:student_id" element={<Mycode />} />
      <Route path="result" element={<Result />} />
      <Route path="quiz" element={<Quiz />} />
      <Route path="start/:id" element={<Start />} />
      <Route path="*" element={<Nologin />} />
    </Routes>
  );
}

export default App;
