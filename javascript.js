// Variables globales
let books = JSON.parse(localStorage.getItem('books')) || [];
const bookForm = document.getElementById('book-form');
const bookTable = $('#book-table').DataTable({
  pageLength: 10,  // Mostrar solo 10 libros por página
  lengthMenu: [10, 25, 50, 100],  // Opciones de filas por página
  responsive: true,
});
const totalBooksEl = document.getElementById('total-books');
const borrowedBooksEl = document.getElementById('borrowed-books');
const availableBooksEl = document.getElementById('available-books');

// Login de administrador
document.getElementById('login-form').addEventListener('submit', (e) => {
  e.preventDefault();
  const username = document.getElementById('username').value;
  const password = document.getElementById('password').value;
  if (username === 'Biblioteca' && password === '1234') {
    document.getElementById('login-section').classList.add('hidden');
    document.getElementById('dashboard').classList.remove('hidden');
    loadBooks();
    updateStatistics();
  } else {
    alert('Credenciales incorrectas');
  }
});

document.getElementById('logout-btn').addEventListener('click', () => {
  location.reload();
});

// Agregar libro
bookForm.addEventListener('submit', (e) => {
  e.preventDefault();
  const title = document.getElementById('title').value;
  const author = document.getElementById('author').value;
  const subject = document.getElementById('subject').value;  // Añadir materia
  const status = document.getElementById('status').value;
  const book = { title, author, subject, status, dateAdded: new Date() };
  books.push(book);
  saveBooks();
  renderBook(book, books.length - 1);
  updateStatistics();
  bookForm.reset();
});

// Guardar libros en LocalStorage
function saveBooks() {
  localStorage.setItem('books', JSON.stringify(books));
}

// Cargar libros en la tabla
function loadBooks() {
  books.forEach(renderBook);
}

// Renderizar un libro en la tabla
function renderBook(book, index) {
  const row = bookTable.row
    .add([
      book.title,
      book.author,
      book.subject,  // Mostrar materia
      book.status,
      `<button class="toggle-status-btn">Cambiar Estado</button>
       <button class="remove-btn">Eliminar</button>`,
    ])
    .draw()
    .node();

  // Evento para cambiar estado del libro
  row.querySelector('.toggle-status-btn').addEventListener('click', () => {
    toggleBookStatus(index);
  });

  // Evento para eliminar libro
  row.querySelector('.remove-btn').addEventListener('click', () => {
    if (confirm('¿Seguro que deseas eliminar este libro?')) {
      books.splice(index, 1);
      saveBooks();
      bookTable.row(row).remove().draw();
      updateStatistics();
    }
  });
}

// Cambiar estado del libro (disponible/prestado)
function toggleBookStatus(index) {
  books[index].status = books[index].status === 'disponible' ? 'prestado' : 'disponible';
  saveBooks();
  refreshTable();
  updateStatistics();
}

// Refrescar la tabla de libros
function refreshTable() {
  bookTable.clear().draw();  // Limpiar la tabla antes de recargarla
  books.forEach(renderBook);  // Volver a renderizar todos los libros
}

// Actualizar estadísticas
function updateStatistics() {
  totalBooksEl.textContent = books.length;
  borrowedBooksEl.textContent = books.filter((b) => b.status === 'prestado').length;
  availableBooksEl.textContent = books.filter((b) => b.status === 'disponible').length;
}
