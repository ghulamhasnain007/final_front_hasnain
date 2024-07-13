import React from 'react'
import Student_nav from '../Student_comp/Student_nav'
import Student_card from '../Student_comp/Student_card'
import Student_chart from '../Student_comp/Student_chart'
function Sdashboard() {
  return (
    <div>
      <Student_nav/><br /><br /><br /><br />
      <Student_card/>
      <Student_chart/>
      <h1>Student</h1>
    </div>
  )
}

export default Sdashboard
