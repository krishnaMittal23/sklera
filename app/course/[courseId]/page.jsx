"use client"

import DashboardHeader from '@/app/dashboard/_components/DashboardHeader'
import axios from 'axios'
import { useParams } from 'next/navigation'
import React, { useEffect,useState } from 'react'
import CourseIntro from './_components/CourseIntro'
import StudyMaterialSection from './_components/StudyMaterialSection'
import ChapterList from './_components/ChapterList'

const Course = () => {

  const {courseId} = useParams();
  const [course,setCourse] = useState();
  // console.log(courseId)

  useEffect(() => {
  if (courseId) {
    console.log("courseId from params:", courseId);
    GetCourse();
  }
}, [courseId]);

  const GetCourse = async ()=>{
    const result = await axios.get('/api/courses?courseId='+courseId)
    console.log(result.data.result);
    setCourse(result.data.result)
    
  }

  return (
    <div>
       <DashboardHeader/>
       <div className='mx-10 md:mx-36 lg:px-60 mt-10'>
       {/* course intro */}
       <CourseIntro course={course}/>

       {/* study material */}
       <StudyMaterialSection courseId={courseId}/>

       {/* chapter list */}
       <ChapterList course={course}/>
       </div>
    </div>
  )
}

export default Course