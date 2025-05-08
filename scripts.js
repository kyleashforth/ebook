import { initializeApp } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-app.js';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, onAuthStateChanged, signOut } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-auth.js';
import { getFirestore, doc, getDoc, collection, addDoc, getDocs, query, orderBy } from 'https://www.gstatic.com/firebasejs/11.6.1/firebase-firestore.js';

const firebaseConfig = {
  apiKey: "AIzaSyBBtM8u0HUwZJC716VUoK73GDYPd_AbXYw",
  authDomain: "project-5028070446990289643.firebaseapp.com",
  projectId: "project-5028070446990289643",
  storageBucket: "project-5028070446990289643.appspot.com",
  messagingSenderId: "485470950176",
  appId: "1:485470950176:web:d458c042b05b0d9a997d45"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

const elements = {
  authBtn: document.getElementById('auth-btn'),
  profileMenu: document.getElementById('profile-menu'),
  profileIcon: document.querySelector('.profile-icon'),
  profileDropdown: document.querySelector('.profile-dropdown'),
  switchUserBtn: document.getElementById('switch-user-btn'),
  signOutBtn: document.getElementById('sign-out-btn'),
  authModal: document.getElementById('auth-modal'),
  closeModal: document.querySelector('#auth-modal .close'),
  authForm: document.getElementById('auth-form'),
  emailInput: document.getElementById('email'),
  emailError: document.getElementById('email-error'),
  passwordInput: document.getElementById('password'),
  passwordError: document.getElementById('password-error'),
  submitBtn: document.getElementById('submit-btn'),
  toggleAuth: document.getElementById('toggle-auth'),
  modalTitle: document.getElementById('modal-title'),
  bookDetailModal: document.getElementById('book-detail-modal'),
  closeBookModal: document.querySelector('#book-detail-modal .close'),
  detailBookImage: document.getElementById('detail-book-image'),
  detailBookTitle: document.getElementById('detail-book-title'),
  detailBookAuthor: document.getElementById('detail-book-author'),
  detailBookAnnotation: document.getElementById('detail-book-annotation'),
  reviewForm: document.getElementById('review-form'),
  reviewText: document.getElementById('review-text'),
  reviewsList: document.getElementById('reviews-list'),
  booksGrid: document.getElementById('books-grid'),
  newBooksGrid: document.getElementById('new-books-grid'),
  popularBooksGrid: document.getElementById('popular-books-grid'),
  quotesCarousel: document.querySelector('.quotes-carousel')
};

// Объект с URL обложек для всех книг
const bookCovers = {
  1: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSNSuqCiwj-q0Dew06DxUOOnmkgpOdjb0vB9MhEIwRqUqgdOMndgsnKFFM3nBJZ_yxNy28&usqp=CAU',
  2: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCWXvM7XlaqsSq96hpwhh8dVcnfr3hAmLHiA&s',
  3: 'https://imo10.labirint.ru/books/914292/cover.jpg/242-0',
  4: 'https://ir.ozone.ru/s3/multimedia-6/c1000/6664740774.jpg',
  5: 'https://imo10.labirint.ru/books/829864/cover.jpg/242-0',
  6: 'https://ir.ozone.ru/s3/multimedia-s/c1000/6324766972.jpg',
  7: 'https://imo10.labirint.ru/books/745001/cover.jpg/242-0',
  8: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSeeCG4apOa8I0XBkbFhVDFT9-XmIf1b_bbpg&s',
  9: 'https://www.litres.ru/pub/c/cover/63573742.jpg',
  10: 'https://imo10.labirint.ru/books/793149/cover.jpg/242-0',
  11: 'https://litmir.club/data/Book/0/281000/281258/BC4_1490790500.jpg',
  12: 'https://www.litres.ru/pub/c/cover/35015534.jpg',
  13: 'https://avidreaders.ru/pics/6/2/818762.jpeg',
  14: 'https://www.litres.ru/pub/c/cover/54908589.jpg',
  15: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSFXsAEF_VApHl56v7LYxzngt7n7kbwDy8i0w&s',
  16: 'https://www.litres.ru/pub/c/cover/26714111.jpg',
  17: 'https://imo10.labirint.ru/books/630592/cover.jpg/242-0',
  18: 'https://imo10.labirint.ru/books/641193/cover.jpg/242-0',
  19: 'https://imo10.labirint.ru/books/948311/cover.jpg/242-0',
  20: 'https://ndc.book24.ru/resize/410x590/pim/products/images/d8/c5/018f612a-6eba-7036-bb98-bebb9cb8d8c5.jpg',
  21: 'https://www.litres.ru/pub/c/cover/70281301.jpg',
  22: 'https://content.img-gorod.ru/pim/products/images/c9/0d/018f5f1c-92dd-7e3e-aa1c-435662efc90d.jpg',
  23: 'https://imo10.labirint.ru/books/864481/cover.jpg/242-0',
  24: 'https://imo10.labirint.ru/books/860636/cover.jpg/484-0'
};

let currentPage = 0;
const booksPerPage = 16;
let isLoading = false;
let allBooksLoaded = false;
const totalBooks = 24;
let isLoginMode = true;

onAuthStateChanged(auth, user => {
  elements.authBtn.style.display = user ? 'none' : 'block';
  elements.profileMenu.style.display = user ? 'flex' : 'none';
});

elements.authBtn.addEventListener('click', () => {
  elements.authModal.style.display = 'flex';
});

elements.switchUserBtn.addEventListener('click', () => {
  elements.authModal.style.display = 'flex';
  elements.profileDropdown.style.display = 'none';
});

elements.closeModal.addEventListener('click', () => {
  elements.authModal.style.display = 'none';
  resetForm();
});

elements.profileIcon.addEventListener('click', () => {
  elements.profileDropdown.style.display = elements.profileDropdown.style.display === 'none' ? 'block' : 'none';
});

elements.toggleAuth.addEventListener('click', () => {
  isLoginMode = !isLoginMode;
  elements.modalTitle.textContent = isLoginMode ? 'Вход' : 'Регистрация';
  elements.submitBtn.textContent = isLoginMode ? 'Войти' : 'Зарегистрироваться';
  elements.toggleAuth.textContent = isLoginMode ? 'Нет аккаунта? Зарегистрируйтесь' : 'Уже есть аккаунт? Войдите';
  resetForm();
});

elements.authForm.addEventListener('submit', async e => {
  e.preventDefault();
  resetErrors();
  const email = elements.emailInput.value;
  const password = elements.passwordInput.value;

  if (!email) {
    showError(elements.emailError, 'Введите email');
    return;
  }
  if (!password) {
    showError(elements.passwordError, 'Введите пароль');
    return;
  }

  try {
    elements.submitBtn.disabled = true;
    if (isLoginMode) {
      await signInWithEmailAndPassword(auth, email, password);
    } else {
      await createUserWithEmailAndPassword(auth, email, password);
    }
    elements.authModal.style.display = 'none';
    resetForm();
  } catch (error) {
    handleAuthError(error);
  } finally {
    elements.submitBtn.disabled = false;
  }
});

elements.signOutBtn.addEventListener('click', async () => {
  await signOut(auth);
  elements.profileDropdown.style.display = 'none';
});

function resetForm() {
  elements.authForm.reset();
  resetErrors();
}

function resetErrors() {
  elements.emailError.style.display = 'none';
  elements.passwordError.style.display = 'none';
}

function showError(element, message) {
  element.textContent = message;
  element.style.display = 'block';
}

function handleAuthError(error) {
  switch (error.code) {
    case 'auth/invalid-email':
      showError(elements.emailError, 'Неверный формат email');
      break;
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      showError(elements.passwordError, 'Неверный email или пароль');
      break;
    case 'auth/email-already-in-use':
      showError(elements.emailError, 'Email уже зарегистрирован');
      break;
    default:
      showError(elements.emailError, error.message);
  }
}

async function loadQuotes() {
  try {
    const docSnap = await getDoc(doc(db, 'quotes', 'quote1'));
    if (docSnap.exists()) {
      const quotes = Object.values(docSnap.data()).filter(quote => quote);
      if (!quotes.length) throw new Error('No quotes');
      let index = 0;
      const showQuote = () => {
        elements.quotesCarousel.querySelector('.quote-item').textContent = quotes[index];
        elements.quotesCarousel.querySelector('.quote-item').classList.add('active');
        setTimeout(() => {
          elements.quotesCarousel.querySelector('.quote-item').classList.remove('active');
          setTimeout(() => {
            index = (index + 1) % quotes.length;
            showQuote();
          }, 300);
        }, 4700);
      };
      showQuote();
    } else {
      elements.quotesCarousel.innerHTML = '<p class="no-data">Цитаты отсутствуют</p>';
    }
  } catch (error) {
    elements.quotesCarousel.innerHTML = '<p class="error">Ошибка загрузки цитат</p>';
  }
}

async function loadBooks(range, targetGrid) {
  try {
    const bookPromises = range.map(i => getDoc(doc(db, 'books', `book${i}`)));
    const bookSnapshots = await Promise.all(bookPromises);
    bookSnapshots.forEach((docSnap, index) => {
      const bookNumber = range[index];
      if (docSnap.exists()) {
        createBookCard(bookNumber, docSnap.data(), targetGrid);
      } else {
        createMissingBookCard(bookNumber, targetGrid);
      }
    });
  } catch (error) {
    targetGrid.innerHTML = '<p class="error">Ошибка загрузки книг</p>';
  }
}

async function loadLibraryBooks() {
  if (isLoading || allBooksLoaded) return;
  isLoading = true;
  if (currentPage === 0) showLoading();
  try {
    const start = currentPage * booksPerPage + 1;
    const end = Math.min((currentPage + 1) * booksPerPage, totalBooks);
    await loadBooks(Array.from({length: end - start + 1}, (_, i) => start + i), elements.booksGrid);
    if (end >= totalBooks) allBooksLoaded = true;
    currentPage++;
  } catch (error) {
    showErrorMessage('Ошибка загрузки книг');
  } finally {
    isLoading = false;
    if (currentPage === 1) hideLoading();
  }
}

function createBookCard(bookNumber, data, targetGrid) {
  const card = document.createElement('div');
  card.className = 'book-card';
  card.dataset.bookId = `book${bookNumber}`;
  
  const imageSrc = bookCovers[bookNumber] || `../img/${bookNumber}.png`;
  
  card.innerHTML = `
    <img src="${imageSrc}" alt="${data.title || 'Книга'}" loading="lazy">
    <h3>${data.title || 'Без названия'}</h3>
    <p>${data.author || 'Неизвестный автор'}</p>
  `;
  card.addEventListener('click', () => openBookDetail(`book${bookNumber}`));
  targetGrid.appendChild(card);
}

function createMissingBookCard(bookNumber, targetGrid) {
  const card = document.createElement('div');
  card.className = 'book-card missing';
  card.innerHTML = `
    <img src="../img/${bookNumber}.png" alt="Книга отсутствует" loading="lazy">
    <h3>Книга недоступна</h3>
    <p>Автор неизвестен</p>
  `;
  targetGrid.appendChild(card);
}

async function openBookDetail(bookId) {
  elements.bookDetailModal.style.display = 'flex';
  elements.detailBookTitle.textContent = 'Загрузка...';
  elements.detailBookAuthor.textContent = '';
  elements.detailBookAnnotation.textContent = 'Загружаем...';
  elements.reviewsList.innerHTML = '<p class="loading">Загрузка отзывов...</p>';
  const bookNumber = bookId.replace('book', '');
  
  elements.detailBookImage.src = bookCovers[bookNumber] || `../img/${bookNumber}.png`;
  elements.bookDetailModal.dataset.currentBook = bookId;

  try {
    const docSnap = await getDoc(doc(db, 'books', bookId));
    if (docSnap.exists()) {
      const data = docSnap.data();
      elements.detailBookTitle.textContent = data.title || 'Без названия';
      elements.detailBookAuthor.textContent = data.author || 'Неизвестный автор';
      elements.detailBookAnnotation.textContent = data.annotation || 'Без аннотации';
    } else {
      elements.detailBookTitle.textContent = 'Книга не найдена';
      elements.detailBookAnnotation.textContent = 'Информация отсутствует';
    }
    await loadReviews(bookId);
  } catch (error) {
    elements.detailBookTitle.textContent = 'Ошибка';
    elements.detailBookAnnotation.textContent = 'Не удалось загрузить данные';
    elements.reviewsList.innerHTML = '<p class="error">Ошибка загрузки отзывов</p>';
  }
}

async function loadReviews(bookId) {
  try {
    const reviewsQuery = query(collection(db, 'reviews', bookId, 'bookReviews'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(reviewsQuery);
    elements.reviewsList.innerHTML = querySnapshot.empty ? '<p class="no-data">Отзывов нет</p>' : '';
    querySnapshot.forEach(doc => {
      const review = doc.data();
      const reviewElement = document.createElement('div');
      reviewElement.className = 'review-item';
      reviewElement.innerHTML = `
        <p class="review-meta">${review.userName} | ${new Date(review.timestamp.toDate()).toLocaleString('ru-RU')}</p>
        <p>${review.text}</p>
      `;
      elements.reviewsList.appendChild(reviewElement);
    });
  } catch (error) {
    elements.reviewsList.innerHTML = '<p class="error">Ошибка загрузки отзывов</p>';
  }
}

elements.reviewForm.addEventListener('submit', async e => {
  e.preventDefault();
  const user = auth.currentUser;
  if (!user) {
    alert('Войдите, чтобы оставить отзыв');
    elements.authModal.style.display = 'flex';
    return;
  }
  const bookId = elements.bookDetailModal.dataset.currentBook;
  const text = elements.reviewText.value.trim();
  if (!text) return;

  try {
    await addDoc(collection(db, 'reviews', bookId, 'bookReviews'), {
      userId: user.uid,
      userName: user.displayName || user.email.split('@')[0],
      text,
      timestamp: new Date()
    });
    elements.reviewText.value = '';
    await loadReviews(bookId);
  } catch (error) {
    alert(`Ошибка: ${error.message}`);
  }
});

elements.closeBookModal.addEventListener('click', () => {
  elements.bookDetailModal.style.display = 'none';
});

elements.bookDetailModal.addEventListener('click', e => {
  if (e.target === elements.bookDetailModal) elements.bookDetailModal.style.display = 'none';
});

function showLoading() {
  const loader = document.createElement('div');
  loader.className = 'loading';
  loader.textContent = 'Загрузка...';
  elements.booksGrid.appendChild(loader);
}

function hideLoading() {
  const loader = elements.booksGrid.querySelector('.loading');
  if (loader) loader.remove();
}

function showErrorMessage(message) {
  const error = document.createElement('div');
  error.className = 'error';
  error.textContent = message;
  elements.booksGrid.appendChild(error);
}

function handleScroll() {
  if (isLoading || allBooksLoaded) return;
  const { scrollTop, scrollHeight, clientHeight } = document.documentElement;
  if (scrollTop + clientHeight >= scrollHeight - 300) loadLibraryBooks();
}

document.addEventListener('DOMContentLoaded', () => {
  if (window.location.pathname.includes('library.html')) {
    loadLibraryBooks();
    window.addEventListener('scroll', handleScroll);
  } else {
    loadQuotes();
    loadBooks(Array.from({length: 8}, (_, i) => i + 9), elements.newBooksGrid);
    loadBooks(Array.from({length: 8}, (_, i) => i + 1), elements.popularBooksGrid);
  }
});