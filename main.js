// ---- helpers ----
async function getData(url) {
  try {
    const response = await fetch(url)
    if (!response.ok) throw new Error(`data undefined`)
    return await response.json()
  } catch (error) {
    console.error(error)
  }
}

// ---- user init ----
if (localStorage.getItem('userInfo') === null) {
  const defaultUser = {
    savedCourses: { courses: [] },
    inProgressCourses: { courses: [] },
    completedCourses: { courses: [] }
  };
  localStorage.setItem('userInfo', JSON.stringify(defaultUser));
}

// ---- sidebar toggle ----
const burger = document.querySelector('.burger')
const sidebar = document.querySelector('.sidebar')
const overlay = document.querySelector('.sidebar-overlay')

if (burger && sidebar && overlay) {
  const close = () => {
    burger.classList.remove('active')
    sidebar.classList.remove('active')
    overlay.classList.remove('active')
    burger.style.display = ''
    document.body.style.overflow = ''
  }
  const open = () => {
    burger.classList.add('active')
    sidebar.classList.add('active')
    overlay.classList.add('active')
    burger.style.display = 'none'
    document.body.style.overflow = 'hidden'
  }

  burger.addEventListener('click', () => {
    if (sidebar.classList.contains('active')) close()
    else open()
  })

  overlay.addEventListener('click', close)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && sidebar.classList.contains('active')) close()
  })
}
