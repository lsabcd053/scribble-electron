const writeArea = document.querySelector('.js-write-area')
const listOfSaves = document.querySelector('.js-list-of-saves')
const saveNameFixed = 'scribbleSave'
const currentSave = function () {
  return window.localStorage.getItem('currentScribbleSave')
}

const loadSaves = function () {
  return Object.keys(window.localStorage).filter(function (key) {
    return key.startsWith(saveNameFixed)
  }).reverse()
}

const loadSave = function (saveName) {
  if (window.localStorage.getItem(saveName) !== null) {
    setCurrentSave(saveName)
    writeArea.value = window.localStorage.getItem(saveName)
    renderListing()
    writeArea.focus()
  } else {
    window.alert('save not found')
  }
}

const saveData = function (evt) {
  window.localStorage.setItem(currentSave(), evt.target.value)
  if (window.localStorage.getItem(currentSave()).indexOf('\n') < 0) {
    renderListing()
  }
}

const newSave = function () {
  let saves = loadSaves()
  let num
  if (saves.length > 0) {
    num = Number(saves[0].replace(saveNameFixed, '')) + 1
  } else {
    num = 1
  }

  let name = saveNameFixed + num
  window.localStorage.setItem(name, '')
  loadSave(name)

  renderListing()
}

const setCurrentSave = function (saveName) {
  window.localStorage.setItem('currentScribbleSave', saveName)
}

const deleteSave = function (saveName) {
  if (loadSaves().length === 1) {
    return window.alert('can\'t delete the last save')
  } else if (window.confirm('are you sure? the note will be gone forever!')) {
    window.localStorage.removeItem(saveName)
    if (currentSave() === saveName) {
      loadSave(loadSaves()[0])
    }
    renderListing()
  }
}

const renderListing = function () {
  listOfSaves.innerHTML = ''

  loadSaves().forEach(function (key) {
    let li = document.createElement('li')
    let button = document.createElement('button')
    button.type = 'button'
    button.innerText = (window.localStorage.getItem(key).split('\n')[0] || 'Empty').substr(0, 50)
    button.setAttribute('data-save', key)
    button.classList.add('js-load-save')
    let deleteButton = document.createElement('button')
    deleteButton.type = 'button'
    deleteButton.innerText = '×'
    deleteButton.classList.add('js-delete-save')
    deleteButton.setAttribute('data-save', key)

    if (key === currentSave()) button.classList.add('current')
    li.appendChild(button)
    if (loadSaves().length !== 1) li.appendChild(deleteButton)
    listOfSaves.appendChild(li)
  })
}

const showList = function () {
  listOfSaves.classList.add('open')
}

const hideList = function () {
  listOfSaves.classList.remove('open')
}

writeArea.addEventListener('input', saveData)

if (currentSave()) {
  loadSave(currentSave())
} else {
  newSave()
}

document.addEventListener('click', function (evt) {
  if (evt.target.classList.contains('js-load-save')) {
    loadSave(evt.target.getAttribute('data-save'))
  }

  if (evt.target.classList.contains('js-new-save')) {
    newSave()
  }

  if (evt.target.classList.contains('js-delete-save')) {
    deleteSave(evt.target.getAttribute('data-save'))
  }
})

document.addEventListener('keydown', function (evt) {
  if (evt.shiftKey && evt.metaKey) {
    showList()
  }

  if (evt.metaKey && evt.code === 'KeyN') {
    newSave()
  }

  if (evt.metaKey && evt.code === 'KeyD') {
    deleteSave(currentSave())
  }

  if (evt.metaKey && evt.code === 'BracketLeft') {
    let saves = loadSaves()
    if (saves.indexOf(currentSave()) !== 0) {
      loadSave(saves[saves.indexOf(currentSave()) - 1])
    }
  }

  if (evt.metaKey && evt.code === 'BracketRight') {
    let saves = loadSaves()
    if (saves.indexOf(currentSave()) < saves.length - 1) {
      loadSave(saves[saves.indexOf(currentSave()) + 1])
    }
  }
})

document.addEventListener('keyup', function (evt) {
  if (evt.shiftKey || evt.metaKey) {
    hideList()
  }
})
