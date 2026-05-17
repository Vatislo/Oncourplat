const progressItems = document.getElementById('progress-items')
const controlCenterItems = document.getElementById('control-center-items')
const previewItems = document.getElementById('preview-items')
const modalOverlay = document.getElementById('modal-overlay')
const modalTitle = document.getElementById('modal-title')
const modalContent = document.getElementById('modal-content')
const modalClose = document.getElementById('modal-close')

const importData = document.getElementById('import-data')
const exportData = document.getElementById('export-data')
const deleteData = document.getElementById('delete-data')

const openModal = (title, courses, type) => {
    modalTitle.textContent = title
    modalContent.innerHTML = ''
    if (courses.length === 0) {
        modalContent.innerHTML = '<p style="color: var(--text-secondary)">No courses</p>'
    } else {
        courses.forEach((course, index) => {
            const name = (type === 'saved' || type === 'completed') ? course : course.name
            const lessonNum = (type === 'saved' || type === 'completed') ? 1 : course.currentLesson
            const wrapper = document.createElement('div')
            wrapper.className = 'modal-item'
            const link = document.createElement('a')
            link.href = `../lesson/index.html?course=${encodeURIComponent(name)}&lessonNumber=${lessonNum}`
            link.innerHTML = `<h3>${name}</h3>`
            if (type === 'saved') {
                const deleteBtn = document.createElement('button')
                deleteBtn.className = 'modal-delete'
                deleteBtn.textContent = '×'
                deleteBtn.addEventListener('click', (e) => {
                    e.preventDefault()
                    e.stopPropagation()
                    let user = JSON.parse(localStorage.getItem('userInfo'))
                    user.savedCourses.courses = user.savedCourses.courses.filter(c => c !== name)
                    localStorage.setItem('userInfo', JSON.stringify(user))
                    wrapper.remove()
                    if (user.savedCourses.courses.length === 0) {
                        modalContent.innerHTML = '<p style="color: var(--text-secondary)">No courses</p>'
                    }
                    renderPage()
                })
                wrapper.appendChild(link)
                wrapper.appendChild(deleteBtn)
            } else {
                link.innerHTML += `<p>Lesson number: ${lessonNum}</p>`
                wrapper.appendChild(link)
            }
            modalContent.appendChild(wrapper)
        })
    }
    modalOverlay.classList.add('active')
}

const closeModal = () => {
    modalOverlay.classList.remove('active')
}

modalClose.addEventListener('click', closeModal)
modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal()
})

const renderPage = () => {
  const user = JSON.parse(localStorage.getItem('userInfo'));
  
  previewItems.innerHTML = '';
  progressItems.innerHTML = '';
  
  const getCards = (data, fromTo) => {
    if (data.courses.length === 0) return;
    for (let i = 0; i < data.courses.length; i++) {
      const template = `
        <a class="item" href="../lesson/index.html?course=${encodeURIComponent(data.courses[i].name)}&lessonNumber=${data.courses[i].currentLesson}">
         <h3>${data.courses[i].name}</h3>
          <p>Lesson number: ${data.courses[i].currentLesson}</p>
        </a>
      `
      fromTo.innerHTML += template;
    }
  };

  const getCard = (data, fromTo, text, type) => {
    if (data.courses.length === 0) return;
    const template = `
      <div class="item" data-type="${type}">
        <h3>${data.courses.length}</h3>
        <p>${text}</p>
      </div>
    `;
    fromTo.innerHTML += template;
  };

  const hasAnyData = user.savedCourses.courses.length > 0 
    || user.inProgressCourses.courses.length > 0 
    || user.completedCourses.courses.length > 0;
  
  exportData.style.display = hasAnyData ? '' : 'none';
  deleteData.style.display = hasAnyData ? '' : 'none';

  const hasSaved = user.savedCourses.courses.length > 0;
  const hasProgress = user.inProgressCourses.courses.length > 0;
  const hasCompleted = user.completedCourses.courses.length > 0;

  document.querySelector('.preview-box').style.display = (hasSaved || hasProgress || hasCompleted) ? '' : 'none';
  document.querySelector('.progress-box').style.display = hasProgress ? '' : 'none';

  getCard(user.savedCourses, previewItems, 'Saved', 'saved');
  getCard(user.inProgressCourses, previewItems, 'Progress', 'progress');
  getCard(user.completedCourses, previewItems, 'Completed', 'completed');
  getCards(user.inProgressCourses, progressItems);

  previewItems.querySelectorAll('.item').forEach(item => {
    item.style.cursor = 'pointer';
    item.addEventListener('click', () => {
      const type = item.dataset.type
      if (type === 'saved') {
        openModal('Saved Courses', user.savedCourses.courses, 'saved')
      } else if (type === 'completed') {
        openModal('Completed Courses', user.completedCourses.courses, 'completed')
      }
    })
  })
};

// exportData

exportData.addEventListener('click',()=>{
  const userInfo = localStorage.getItem('userInfo');
  
  const blob = new Blob([userInfo], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  
  const link = document.createElement('a');
  link.href = url;
  link.download = 'userInfo.json';
  link.click();
  
  URL.revokeObjectURL(url);
    
})

// importData

importData.addEventListener('click', function() {
  const input = document.createElement('input');
  input.type = 'file';
  input.accept = '.json';
  
  input.onchange = function(event) {
    const file = event.target.files[0];
    
    if (file) {
      const reader = new FileReader();
      
      reader.onload = function(e) {
        try {
          const data = JSON.parse(e.target.result);
          localStorage.setItem('userInfo', JSON.stringify(data));
          renderPage();
        } catch (error) {
          console.error('Invalid JSON');
        }
      };
      
      reader.readAsText(file);
    }
  };
  
  input.click();
  // location.reload();
});

// deleteData

deleteData.addEventListener('click', () => {
  const defaultUser = {
    savedCourses: { courses: [] },
    inProgressCourses: { courses: [] },
    completedCourses: { courses: [] }
  };
  localStorage.removeItem('userInfo')
  localStorage.setItem('userInfo', JSON.stringify(defaultUser));
  renderPage();
});

renderPage();


