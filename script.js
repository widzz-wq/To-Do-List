const todoInput = document.getElementById('todo-input')
const addBtn = document.getElementById('add-btn')
const todoList = document.getElementById('todo-list')
const errorMsg = document.getElementById('error-msg')

let todos = JSON.parse(localStorage.getItem('todos')) || []
let currentFilter = 'all' // 

function renderTodos() {
    todoList.innerHTML = ''

    const filteredTodos = todos.filter(todo => {
        if (currentFilter === 'active') return !todo.completed  // Loloskan jika completed bernilai false
        if (currentFilter === 'completed') return todo.completed // Loloskan jika completed bernilai true
        return true // Jika 'all', loloskan semuanya
    })

    filteredTodos.forEach((todo) => {
        const li = document.createElement('li')
        // Berikan class kondisional tambahan jika tugas sudah selesai
        li.className = `todo-item ${todo.completed ? 'completed-style' : ''}`

        li.innerHTML = `
            <div class="todo-clickable" onclick="toggleTodo(${todo.id})">
                <div class="status-badge"></div>
                <span class="todo-text">${todo.text}</span>
            </div>
            <div class="actions">
                <button onclick="editTodo(${todo.id})" class="btn-edit">Edit</button>
                <button onclick="deleteTodo(${todo.id})" class="btn-delete">Hapus</button>
            </div>
        `
        todoList.appendChild(li)
    })

    updateFilterButtonsStyle()
    localStorage.setItem('todos', JSON.stringify(todos))
}

// Fungsi Tambah Data
function addTodo() {
    const value = todoInput.value.trim()

    if (value === '') {
        todoInput.classList.add('border-red-500')
        errorMsg.classList.remove('hidden')
        return 
    }

    const todoBaru = {
        id: Date.now(),
        text: value,
        completed: false // Default tugas baru selalu belum selesai (Active)
    }

    todos = [...todos, todoBaru]
    renderTodos()
    todoInput.value = ''
}

// Menghilangkan pesan error saat mengetik ulang
todoInput.addEventListener('input', () => {
    todoInput.classList.remove('border-red-500')
    errorMsg.classList.add('hidden')
})

addBtn.addEventListener('click', addTodo)
todoInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') addTodo()
})

// Fungsi Toggle Status Selesai (Tempat submit/mengubah status tugas)
window.toggleTodo = (id) => {
    todos = todos.map(todo => {
        if (todo.id === id) {
            // Membalikkan status boolean completed
            return { ...todo, completed: !todo.completed }
        }
        return todo
    })
    renderTodos() // Me-render ulang agar filter mendeteksi perubahan status terbaru
}

// Fungsi Hapus Data
window.deleteTodo = (id) => {
    todos = todos.filter(todo => todo.id !== id)
    renderTodos()
}

// Fungsi Edit Data
window.editTodo = (id) => {
    const todoYangDipilih = todos.find(todo => todo.id === id)
    if (!todoYangDipilih) return

    const teksBaru = prompt("Ubah tugas kamu:", todoYangDipilih.text)
    if (teksBaru === null || teksBaru.trim() === '') return

    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, text: teksBaru.trim() }
        }
        return todo
    })
    renderTodos()
}

// Fungsi Mengubah Kategori Filter Aktif
window.changeFilter = (filterType) => {
    currentFilter = filterType
    renderTodos()
}

// Sinkronisasi class aktif pada tombol tab filter
function updateFilterButtonsStyle() {
    const filters = ['all', 'active', 'completed']
    filters.forEach(f => {
        const btn = document.getElementById(`filter-${f}`)
        if (f === currentFilter) {
            btn.className = "btn-filter btn-active"
        } else {
            btn.className = "btn-filter btn-inactive"
        }
    })
}

renderTodos()