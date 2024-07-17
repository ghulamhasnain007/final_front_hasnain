import React, { useEffect ,useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Admin from './Admin_pages/Dashboard';
import Allstudent from './Admin_pages/AllStudent';
import Mteacher from './Admin_pages/Mteacher';
import Setting from './Admin_pages/Setting';
import ProfilePage from './Admin_pages/Profile';
import UserReports from './Admin_pages/Userreport';
import Admin_login from './Admin_pages/Admin_login'
import Tdashboard from './Teacher_pages/Tdashboard';
import Create from './Teacher_pages/Create';
import Studentrep from './Teacher_pages/Studentrep';
import Tprofile from './Teacher_pages/Tprofile';
import Alltask from './Teacher_pages/Alltask';
import Taskdetail from './Teacher_pages/Taskdetail';
import Sdashboard from './Studend_pages/Sdashboard'
import Profile from './Studend_pages/Profile'
import Join_class from './Studend_pages/Join_class';
import Student_task from './Studend_pages/Student_task'
import Task_submit from './Studend_pages/Task_submit';
import Student_reg from './Studend_pages/Student_reg';
import Student_login from './Studend_pages/Student_login';
import Teacher_login from './Teacher_pages/Teacher_login';
import Mysub from './Studend_pages/Mysub'
import HomePage from './Home/Home';
import Cha from './Admin_comp/Cha';
import Page from './Home/Page'
import Nologin from './Home/Nologin'
import QuizForm from './Teacher_pages/Createquiz';
import Allquiz from './Teacher_pages/Quizdata'
import Quiz from './Studend_pages/Quiz'
import Start from './Studend_pages/Start'
function App() {
  const [user, setUser] = useState('');
  const [teacher, setTeacher] = useState('');
  const [admin, setAdmin] = useState('');

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem('user'));
    const teacher = JSON.parse(localStorage.getItem('techerdata'));
    const admin = JSON.parse(localStorage.getItem('admin'));

     setUser(user)
    setTeacher(teacher)
     setAdmin(admin)
  }, []);
  return (
    <div>
      <Router>
        <Routes>
          {/*  */}
          <Route path='/' element={<HomePage />} />
          <Route path='/cha' element={<Cha />} />
          <Route path='*' element={<Page/>} />
          {/* Admin routes */}
          <Route path="/admin">
            <Route path="Dashboard" element={ admin ? <Admin /> : <Nologin/>} />
            <Route path="allstudent" element={ admin ? <Allstudent /> : <Nologin/>} />
            <Route path="mteacher" element={admin ? <Mteacher />: <Nologin/>} />
            <Route path="setting" element={ admin ? <Setting />: <Nologin/>} />
            <Route path="profile" element={ admin ? <ProfilePage />: <Nologin/>} />
            <Route path="userreport" element={ admin ? <UserReports />: <Nologin/>} />
            <Route path="login" element={<Admin_login />} />
          </Route>

          {/* Teacher Route */}
          <Route path="/teacher">
          <Route path='quiz' element={<QuizForm/>} />
          <Route path='allquiz' element={<Allquiz/>} />
          
            <Route path="dashboard" element={teacher  ?  <Tdashboard /> : <Nologin/> } />
            {/* <Route path="studentreport" element={<Studentrep />} /> */}
            <Route path="profile" element={ teacher  ? <Tprofile /> : <Nologin/>  } />
            <Route path="login" element={  < Teacher_login />} />
            <Route path="createclasswork" element={ teacher  ? <Create /> : <Nologin/>  } />
            <Route path="createclasswork/:id" element={teacher  ? <Alltask /> : <Nologin/>  } />
            <Route path="createclasswork/:id/task/:taskId" element={ teacher  ? <Taskdetail /> : <Nologin/> } />
            <Route path="createclasswork/:id/studentreport" element={ teacher  ? <Studentrep /> : <Nologin/>  } />
          </Route>
          {/* Student Route */}
          <Route path='/student' >
          <Route path='quiz' element={  <Quiz />} />
          <Route path='start/:id' element={  < Start/>} />
            <Route path='dashboard' element={user ?  <Sdashboard /> : <Nologin/>   } />
            <Route path='profile' element={user ? <Profile /> : <Nologin/>   } />
            <Route path='join' element={user ? <Join_class /> : <Nologin/>   } />
            <Route path='mysubmission' element={user ? <Mysub /> : <Nologin/>   } />
            <Route path='register' element={ <Student_reg />} />
            <Route path='login' element={<Student_login />} />
            <Route path='join/:classid' element={ user ? <Student_task />: <Nologin/>  } />
            <Route path='join/:classid/tasksubmit/:id' element={ user ? <Task_submit /> : <Nologin/> } />
          </Route>

        </Routes>
      </Router>
    </div>
  );
}

export default App;
