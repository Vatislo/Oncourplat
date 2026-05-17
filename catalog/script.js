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

const init = async () => {
  const allInfo = await getData("https://vatislo.github.io/FakeApi/oncourplat/all_info.json")
  if (!allInfo) return

  const cards = document.querySelector('.cards')

  function findCoursesByWord(queries, data) {
    const filtered = queries.filter(q => q !== '')
    if (filtered.length === 0) return data.map(item => item.title)

    const regexes = filtered.map(q => {
      const esc = String(q).replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
      return new RegExp(`\\b${esc}\\b`, 'i')
    })

    const result = []

    for (let i = 0; i < data.length; i++) {
      const course = data[i]
      if (!course) continue

      const language = String(course.language || '')
      const level = String(course.level || '')

      const matchesAll = regexes.every(re =>
        re.test(language) || re.test(level)
      )

      if (matchesAll) result.push(course.title)
    }

    return result
  }

  const renderCard = (item) => `
  <a class="card" href="../lesson/index.html?course=${encodeURIComponent(item.title)}&lessonNumber=1">
    <h3>${item.title}</h3>
    <div><span>Author:</span><span>${item.instructor.name}</span></div>
    <div><span>Duration(day):</span><span>${item.duration}</span></div>
    <div><span>Language:</span><span>${item.language}</span></div>
    <div><span>Level:</span><span>${item.level}</span></div>
  </a>
`

  function appendCard(vertailukriteeri) {
    let filterCourse = []
    if (typeof vertailukriteeri === 'undefined') {
      filterCourse = allInfo.map(item => item.title)
    } else {
      filterCourse = findCoursesByWord(vertailukriteeri, allInfo)
    }

    cards.innerHTML = ''

    for (let i = 0; i < allInfo.length; i++) {
      const item = allInfo[i]
      const title = item.title
      if (title && filterCourse.includes(title)) {
        cards.innerHTML += renderCard(item)
      }
    }
  }

  appendCard()

  const cardsForm = document.querySelector('form')
  const langOption = document.getElementById("selProLang")
  const levelOption = document.getElementById("selLevel")

  cardsForm.addEventListener('submit', e => {
    e.preventDefault()
    appendCard([langOption.value, levelOption.value])
  })
}

init()
