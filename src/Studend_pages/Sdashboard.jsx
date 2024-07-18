import React from 'react'
import Student_nav from '../Student_comp/Student_nav'
import Student_card from '../Student_comp/Student_card'
import Student_chart from '../Student_comp/Student_chart'
import Quizchart from '../Student_comp/Quizchart'
function Sdashboard() {
  return (
    <div>
      <Student_nav/><br /><br /><br /><br />
      <Student_card/>
      <Quizchart/>
      <Student_chart/>
      
      
    </div>
  )
}

export default Sdashboard
