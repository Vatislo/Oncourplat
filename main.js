if (localStorage.getItem('userInfo') === null) {
  const defaultUser = {
    savedCourses: {

      courses: []
    },
    inProgressCourses: {
      // {name:"",currentLesson:""}
      courses: []
    },
    completedCourses: {
      courses: []
    }
  };
  localStorage.setItem('userInfo', JSON.stringify(defaultUser));
  console.log(13412341)
}
