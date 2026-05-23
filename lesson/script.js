const params = new URLSearchParams(window.location.search)
const courseName = params.get('course')
const lessonNumber = parseInt(params.get('lessonNumber'))

let totalLessons = 0

const info = document.getElementById('info')
const lessonList = document.getElementById('lesson-list')
const work = document.getElementById('work')

const getData = async (url) => {
    try {
    const response = await fetch(url)
    if (!response.ok) {
        throw new Error(`data undefined`)
    }
    return await response.json()
} catch (error) {
    console.error(error)
}
}
const toSnakeLower = (str) => {
    return str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_')
    .replace(/[^a-z0-9_]/g, '');
}

const renderInfo = (item,fromTo) => {
    const templete = `
    <div><h3 title="Save">${item.course.title}</h3><i id="save-btn" class="save-btn fa-regular fa-bookmark"></i></div>
    <div><span>Author:</span><span>${item.course.instructor.name}</span></div>
    <div><span>Duration(day):</span><span>${item.course.duration}</span></div>
    <div><span>Language:</span><span>${item.course.language}</span></div>
    <div><span>Level:</span><span>${item.course.level}</span></div>
    `

    fromTo.innerHTML = templete

}

const renderLessonList = (item, fromTo, item2) => {
    fromTo.innerHTML = `<h3>${item2.course.title}</h3>`;
    for (let i = 0; i < item.lessons.length; i++) {
        const template = `
        <li><a href="?course=${encodeURIComponent(courseName)}&lessonNumber=${i + 1}">${item.lessons[i].title}</a></li>
        `;
        fromTo.innerHTML += template;
    }
}

const renderWork = (item, fromTo, number) => {
    if (!number) {
        fromTo.innerHTML = ''
        fromTo.style.display = 'none'
        return
    }
    fromTo.style.display = ''
    const lessonIndex = number - 1
    const lesson = item.lessons[lessonIndex]
    if (!lesson) return
    const template = lesson.html
    fromTo.innerHTML = template


    fromTo.querySelectorAll('code').forEach(el => {
        el.classList.add('language-javascript')
    })
    Prism.highlightAllUnder(fromTo)
}

const addButtonComplete = () => {
    const h2 = document.querySelector('h2');
    const wrapper = document.createElement('div');
    wrapper.className = 'work-title';
    wrapper.innerHTML = h2.outerHTML + `<p id="complete-btn" class="complete-btn complete-btn-hover">Save progress</p>`;
    h2.replaceWith(wrapper);
}

const completeButton = () => {
    const btn = document.getElementById('complete-btn')
    if (!btn) {
        console.error('Complete button not found')
        return
    }
    btn.addEventListener('click', () => {
        let user = JSON.parse(localStorage.getItem('userInfo'))
        if (!user.inProgressCourses) user.inProgressCourses = { courses: [] }
        if (!user.completedCourses) user.completedCourses = { courses: [] }

        const courseIndex = user.inProgressCourses.courses.findIndex(
            c => c.name === courseName
        )

        if (courseIndex === -1) {
            user.inProgressCourses.courses.push({
                name: courseName,
                currentLesson: lessonNumber
            })
        } else {
            user.inProgressCourses.courses[courseIndex].currentLesson = lessonNumber
        }
        if (lessonNumber === totalLessons) {
            user.inProgressCourses.courses = user.inProgressCourses.courses.filter(
                c => c.name !== courseName
            )
            if (!user.completedCourses.courses.includes(courseName)) {
                user.completedCourses.courses.push(courseName)
            }
        }
        localStorage.setItem('userInfo', JSON.stringify(user))
    })
}

const stylleList = () => {
    if (lessonNumber) {
        const items = document.querySelectorAll('#lesson-list li');
        items[lessonNumber - 1].classList.add("active")
        for (let i = 0; i < lessonNumber - 1; i++) {
           items[i].classList.add("passed")
        }
    }
}

const btnAnimate = () => {
    const btn = document.getElementById("complete-btn")
    btn.addEventListener('click', ()=>{
        btn.style.color = "var(--text-secondary)"
        btn.style.transform = " scale(0.95)"
        btn.style.color = "var(--text-secondary)"
        btn.style.cursor = "default"
        btn.classList.remove("complete-btn-hover")
    })
}

const saveBtnFun = () => {
    const infoBox = document.getElementById('info')
    if (!infoBox) return
    infoBox.addEventListener('click', (e) => {
        const saveBtn = e.target.closest('#save-btn')
        if (!saveBtn) return
        if (!courseName) return
        let user = JSON.parse(localStorage.getItem('userInfo'))
        if (!user) {
            user = {
                savedCourses: { courses: [] },
                inProgressCourses: { courses: [] },
                completedCourses: { courses: [] }
            }
        }
        if (!user.savedCourses) user.savedCourses = { courses: [] }
        const idx = user.savedCourses.courses.indexOf(courseName)
        if (idx === -1) {
            user.savedCourses.courses.push(courseName)
            saveBtn.classList.remove("fa-regular")
            saveBtn.classList.add("fa-solid")
            saveBtn.style.color = 'var(--accent)'
        } else {
            user.savedCourses.courses.splice(idx, 1)
            saveBtn.classList.remove("fa-solid")
            saveBtn.classList.add("fa-regular")
            saveBtn.style.color = ''
        }
        localStorage.setItem('userInfo', JSON.stringify(user))
    })
    const user = JSON.parse(localStorage.getItem('userInfo'))
    if (user && user.savedCourses && user.savedCourses.courses.includes(courseName)) {
        const saveBtn = document.getElementById('save-btn')
        if (saveBtn) {
            saveBtn.style.color = 'var(--accent)'
            saveBtn.classList.remove("fa-regular")
            saveBtn.classList.add("fa-solid")
        }
    }
}

const init = async () => {
    const lessons = await getData(`https://vatislo.github.io/FakeApi/oncourplat/courses/${toSnakeLower(courseName)}/main.json`)
    const allInfo = await getData(`https://vatislo.github.io/FakeApi/oncourplat/courses/${toSnakeLower(courseName)}/info.json`)
    totalLessons = lessons.lessons.length
    renderInfo(allInfo,info)
    renderWork(lessons,work,lessonNumber)
    renderLessonList(lessons,lessonList,allInfo)
    addButtonComplete()
    completeButton()
    stylleList()
    btnAnimate()
    saveBtnFun()
}
init()


