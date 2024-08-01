import React, { useEffect, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
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
import Cha from './Admin_comp/Cha';
import Page from './Home/Page';
import Nologin from './Home/Nologin';
import QuizForm from './Teacher_pages/Createquiz';
import Allquiz from './Teacher_pages/Quizdata';
import Quiz from './Studend_pages/Quiz';
import Start from './Studend_pages/Start';
import Result from './Student_comp/Result';
import Studentresult from './Teacher_pages/Quizresult';
import Code from './Teacher_pages/Code'
import Mycode from './Studend_pages/Mycode';
function App() {
  const [user, setUser] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [admin, setAdmin] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = () => {
      const user = JSON.parse(localStorage.getItem('user'));
      const teacher = JSON.parse(localStorage.getItem('techerdata'));
      const admin = JSON.parse(localStorage.getItem('admin'));

      setUser(user);
      setTeacher(teacher);
      setAdmin(admin);
      setLoading(false);
    };

    checkAuth();
  }, []);

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div>
      <Router>
        <Routes>
          <Route path='/' element={!user && !teacher && !admin ? <HomePage /> : user ? <Sdashboard /> : teacher ? <Tdashboard /> : <Admin />} />
          <Route path='*' element={<Page />} />
          <Route path="/cha" element={<Cha/>} />
          {/* Admin routes */}
          <Route path="/admin">
            <Route path="Dashboard" element={admin ? <Admin /> : <Nologin />} />
            <Route path="allstudent" element={admin ? <Allstudent /> : <Nologin />} />
            <Route path="mteacher" element={admin ? <Mteacher /> : <Nologin />} />
            <Route path="setting" element={admin ? <Setting /> : <Nologin />} />
            <Route path="profile" element={admin ? <ProfilePage /> : <Nologin />} />
            <Route path="userreport" element={admin ? <UserReports /> : <Nologin />} />
            <Route path="login" element={<Admin_login />} />
          </Route>
          {/* Teacher routes */}
          <Route path="/teacher">
            <Route path='quiz' element={teacher ? <QuizForm /> : <Nologin />} />
            <Route path='allquiz' element={teacher ? <Allquiz /> : <Nologin />} />
            <Route path='quizresult/:id' element={teacher ? <Studentresult /> : <Nologin />} />
            <Route path="dashboard" element={teacher ? <Tdashboard /> : <Nologin />} />
            <Route path="profile" element={teacher ? <Tprofile /> : <Nologin />} />
            <Route path="login" element={<Teacher_login />} />
            <Route path="createclasswork" element={teacher ? <Create /> : <Nologin />} />
            <Route path="createclasswork/:id" element={teacher ? <Alltask /> : <Nologin />} />
            <Route path="createclasswork/:id/task/:taskId" element={teacher ? <Taskdetail /> : <Nologin />} />
            <Route path="createclasswork/:id/studentreport" element={teacher ? <Studentrep /> : <Nologin />} />
            <Route path="code/:task_id/:student_id" element={teacher ? <Code /> : <Nologin />} />
          </Route>
          {/* Student routes */}
          <Route path='/student'>
            <Route path='result' element={user ? <Result /> : <Nologin />} />
            <Route path='quiz' element={user ? <Quiz /> : <Nologin />} />
            <Route path='start/:id' element={user ? <Start /> : <Nologin />} />
            <Route path='dashboard' element={user ? <Sdashboard /> : <Nologin />} />
            <Route path='profile' element={user ? <Profile /> : <Nologin />} />
            <Route path='join' element={user ? <Join_class /> : <Nologin />} />
            <Route path='mysubmission' element={user ? <Mysub /> : <Nologin />} />
            <Route path='register' element={<Student_reg />} />
            <Route path='login' element={<Student_login />} />
            <Route path='join/:classid' element={user ? <Student_task /> : <Nologin />} />
            <Route path='join/:classid/tasksubmit/:id' element={user ? <Task_submit /> : <Nologin />} />
            <Route path="mycode/:task_id/:student_id" element={user ? <Mycode /> : <Nologin />} />
          </Route>
        </Routes>
      </Router>
    </div>
  );
}

export default App;
