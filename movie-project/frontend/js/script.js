
const API_URL = 'http://localhost:5000'; //нужно будет убрать


// Текущее состояние редактирования 
let currentEditId = null;
userActions
        
user-actions
        let currentSlide = 0;
        let carouselInterval;
        function initCarousel() {
            const slides = document.querySelectorAll('.carousel-slide');
            const indicatorsContainer = document.getElementById('carouselIndicators');
            const carouselContainer = document.querySelector('.carousel-container');
            
            slides.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.className = 'carousel-indicator';
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => goToSlide(index));
                indicatorsContainer.appendChild(indicator);
            });

            startAutoSlide();
        }
        function changeSlide(direction) {
            const slides = document.querySelectorAll('.carousel-slide');
            const indicators = document.querySelectorAll('.carousel-indicator');
            
            // Убираем активный класс с текущего слайда
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            // Вычисляем новый индекс слайда
            currentSlide += direction;
            
            // Зацикливаем слайды
            if (currentSlide >= slides.length) {
                currentSlide = 0;
            } else if (currentSlide < 0) {
                currentSlide = slides.length - 1;
            }
            
            // Добавляем активный класс к новому слайду
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
          
            restartAutoSlide();
        }

        function goToSlide(index) {
            const slides = document.querySelectorAll('.carousel-slide');
            const indicators = document.querySelectorAll('.carousel-indicator');

            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');

            currentSlide = index;

            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');

            restartAutoSlide();
        }

        function startAutoSlide() {
            carouselInterval = setInterval(() => {
                changeSlide(1);
            }, 1400); // 1.4 секунды
        }

        function stopAutoSlide() {
            if (carouselInterval) {
                clearInterval(carouselInterval);
            }
        }

        function restartAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        function toggleAdminPanel() {
            const panel = document.getElementById('adminPanel');
            panel.classList.toggle('active');
        }



// Загрузка фильмов с бэкенда
async function loadMovies() {
    try {
        if (!currentUser) {
            const moviesList = document.getElementById('moviesList');
            if (moviesList) {
                moviesList.innerHTML = '<p>Войдите, чтобы просмотреть ваши фильмы</p>';
            }
            return;
        }
        
        const response = await fetch(`${API_URL}/movies`, {
            credentials: 'include'
        });
        if (!response.ok) {
            if (response.status === 401) {
                currentUser = null;
                updateUserInterface();
                const moviesList = document.getElementById('moviesList');
                if (moviesList) {
                    moviesList.innerHTML = '<p>Необходима авторизация. Пожалуйста, войдите.</p>';
                }
                return;
            }
            throw new Error('Ошибка загрузки фильмов');
        }
        const movies = await response.json();
        const moviesList = document.getElementById('moviesList');
        if (!moviesList) return;
        
        moviesList.innerHTML = '';
        
        if (movies.length === 0) {
            moviesList.innerHTML = '<p>У вас пока нет фильмов. Добавьте первый фильм!</p>';
            return;
        }
        
        movies.forEach(movie => {
            const movieItem = document.createElement('div');
            movieItem.className = 'movie-item';
            movieItem.innerHTML = `
                <div class="movie-info">
                    <h4>${movie.title} (${movie.year})</h4>
                    <p>${movie.genre} • Рейтинг: ${movie.rating.toFixed(1)} • ${movie.description || 'Нет описания'}</p>
                </div>
                <div class="movie-actions">
                    <button class="admin-btn secondary">Смотреть</button>
                    <button class="admin-btn secondary edit-btn" data-id="${movie.id}">Редактировать</button>
                    <button class="admin-btn delete-btn" data-id="${movie.id}">Удалить</button>
                </div>
            `;

            // Привязываем обработчики через JS, а не через onclick
            const editBtn = movieItem.querySelector('.edit-btn');
            const deleteBtn = movieItem.querySelector('.delete-btn');
            if (editBtn) {
                editBtn.addEventListener('click', () => editMovie(movie.id));
            }
            if (deleteBtn) {
                deleteBtn.addEventListener('click', () => deleteMovie(movie.id));
            }

            moviesList.appendChild(movieItem);
        });
    } catch (error) {
        console.error('Ошибка:', error);
        const moviesList = document.getElementById('moviesList');
        if (moviesList) {
            moviesList.innerHTML = '<p>Ошибка загрузки фильмов</p>';
        }
    }
}

async function addMovie(event) {
    event.preventDefault();
    
    if (!currentUser) {
        alert('Необходима авторизация для добавления фильмов');
        openModal('loginModal');
        return;
    }

    const title = document.getElementById('movieTitle').value.trim();
    const rating = document.getElementById('movieRating').value;
    const genre = document.getElementById('movieGenre').value;
    const year = document.getElementById('movieYear').value;
    const description = document.getElementById('movieDescription').value.trim();

    // Валидация
    if (!title || !rating || !genre || !year) {
        alert('Заполните все обязательные поля');
        return;
    }

    const movieData = {
        title,
        rating,
        genre,
        year,
        description
    };

    // Если currentEditId есть — обновляем фильм (PUT), иначе создаём новый (POST)
    const isEditMode = currentEditId !== null;
    const url = isEditMode
        ? `${API_URL}/movies/${currentEditId}`
        : `${API_URL}/movies`;
    const method = isEditMode ? 'PUT' : 'POST';

    try {
        const response = await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(movieData)
        });

        const result = await response.json();

        if (response.ok) {
            resetMovieForm();
            loadMovies();
            alert(isEditMode ? 'Фильм обновлён' : 'Фильм добавлен');
        } else {
            if (response.status === 401) {
                currentUser = null;
                updateUserInterface();
                alert('Сессия истекла. Пожалуйста, войдите снова.');
                openModal('loginModal');
            } else {
                alert('Ошибка: ' + (result.error || 'Неизвестная ошибка'));
            }
        }
    } catch (error) {
        console.error('Ошибка отправки:', error);
        alert('Не удалось подключиться к серверу');
    }
}

async function editMovie(id) {
    if (!currentUser) {
        alert('Необходима авторизация');
        openModal('loginModal');
        return;
    }
    
    try {
        const response = await fetch(`${API_URL}/movies/${id}`, {
            credentials: 'include'
        });
        if (!response.ok) {
            if (response.status === 401) {
                currentUser = null;
                updateUserInterface();
                alert('Сессия истекла. Пожалуйста, войдите снова.');
                openModal('loginModal');
            } else {
                throw new Error('Не удалось загрузить данные фильма');
            }
            return;
        }

        const movie = await response.json();

        // Запоминаем, какой фильм редактируем
        currentEditId = movie.id;
      
        document.getElementById('movieTitle').value = movie.title || '';
        document.getElementById('movieRating').value = movie.rating || '';
        document.getElementById('movieGenre').value = movie.genre || '';
        document.getElementById('movieYear').value = movie.year || '';
        document.getElementById('movieDescription').value = movie.description || '';

        // Меняем текст кнопки
        const submitButton = document.querySelector('.admin-form .admin-btn');
        if (submitButton) {
            submitButton.textContent = 'Сохранить изменения';
        }

        const panel = document.getElementById('adminPanel');
        if (panel && !panel.classList.contains('active')) {
            panel.classList.add('active');
        }

        panel.scrollIntoView({ behavior: 'smooth' });
    } catch (error) {
        console.error('Ошибка при загрузке фильма для редактирования:', error);
        alert('Не удалось загрузить данные фильма');
    }
}

function resetMovieForm() {
    currentEditId = null;
    document.getElementById('movieTitle').value = '';
    document.getElementById('movieRating').value = '';
    document.getElementById('movieGenre').value = '';
    document.getElementById('movieYear').value = '';
    document.getElementById('movieDescription').value = '';

    const submitButton = document.querySelector('.admin-form .admin-btn');
    if (submitButton) {
        submitButton.textContent = 'Добавить фильм';
    }
}

    async function deleteMovie(id) {
    if (!currentUser) {
        alert('Необходима авторизация');
        openModal('loginModal');
        return;
    }
    
    if (!confirm('Вы уверены, что хотите удалить этот фильм?')) return;
    
    try {
    const response = await fetch(`${API_URL}/movies/${id}`, {
        method: 'DELETE',
        credentials: 'include'
    });
    
    if (response.ok) {
        loadMovies(); 
    } else {
        const result = await response.json();
        if (response.status === 401) {
            currentUser = null;
            updateUserInterface();
            alert('Сессия истекла. Пожалуйста, войдите снова.');
            openModal('loginModal');
        } else {
            alert('Ошибка: ' + result.error);
        }
    }
    } catch (error) {
    console.error('Ошибка:', error);
    alert('Не удалось удалить фильм');
    }
    }
    
    async function filterMovies() {
    if (!currentUser) {
        alert('Необходима авторизация');
        openModal('loginModal');
        return;
    }
    
    const genre = document.getElementById('filterGenre').value;
    const rating = document.getElementById('filterRating').value;
    
    let url = `${API_URL}/movies`;
    const params = new URLSearchParams();
    if (genre) params.append('genre', genre);
    if (rating) params.append('min_rating', rating);
    
    if (params.toString()) {
    url += '?' + params.toString();
    }
    
    try {
    const response = await fetch(url, {
        credentials: 'include'
    });
    
    if (!response.ok) {
        if (response.status === 401) {
            currentUser = null;
            updateUserInterface();
            alert('Сессия истекла. Пожалуйста, войдите снова.');
            openModal('loginModal');
            return;
        }
        throw new Error('Ошибка фильтрации');
    }
    
    const movies = await response.json();
    const moviesList = document.getElementById('moviesList');
    if (!moviesList) return;
    
    moviesList.innerHTML = '';
    
    if (movies.length === 0) {
        moviesList.innerHTML = '<p>Фильмы не найдены</p>';
        return;
    }
    
    movies.forEach(movie => {
        const movieItem = document.createElement('div');
        movieItem.className = 'movie-item';
        movieItem.innerHTML = `
            <div class="movie-info">
                <h4>${movie.title} (${movie.year})</h4>
                <p>${movie.genre} • Рейтинг: ${movie.rating.toFixed(1)} • ${movie.description || 'Нет описания'}</p>
            </div>
            <div class="movie-actions">
                <button class="admin-btn secondary">Смотреть</button>
                <button class="admin-btn secondary edit-btn" data-id="${movie.id}">Редактировать</button>
                <button class="admin-btn delete-btn" data-id="${movie.id}">Удалить</button>
            </div>
        `;

        // Привязываем обработчики через JS, а не через onclick
        const editBtn = movieItem.querySelector('.edit-btn');
        const deleteBtn = movieItem.querySelector('.delete-btn');
        if (editBtn) {
            editBtn.addEventListener('click', () => editMovie(movie.id));
        }
        if (deleteBtn) {
            deleteBtn.addEventListener('click', () => deleteMovie(movie.id));
        }

        moviesList.appendChild(movieItem);
    });
    } catch (error) {
    console.error('Ошибка фильтрации:', error);
    }
    }

// Делаем функции доступными глобально для inline-обработчиков onclick
window.editMovie = editMovie;
window.deleteMovie = deleteMovie;
window.addMovie = addMovie;
window.loadMovies = loadMovies;
window.toggleAdminPanel = toggleAdminPanel;

let currentUser = null;

// Проверка при загрузке страницы
async function checkCurrentUser() {
    try {
        const response = await fetch(`${API_URL}/user/current`, {
            credentials: 'include'
        });
        if (response.ok) {
            const data = await response.json();
            currentUser = data.user;
            updateUserInterface();
        } else {
            currentUser = null;
            updateUserInterface();
        }
    } catch (error) {
        console.error('Ошибка при проверке пользователя:', error);
        currentUser = null;
        updateUserInterface();
    }
    return Promise.resolve();
}

function updateUserInterface() {
    const userActions = document.getElementById('userActions');
    if (!userActions) return;
    
    if (currentUser) {
        userActions.innerHTML = `
            <span class="user-info">${currentUser.username}</span>
            <button onclick="handleLogout()">Выход</button>
        `;
    } else {
        userActions.innerHTML = `
            <button onclick="openModal('loginModal')">Вход</button>
            <button onclick="openModal('registerModal')">Регистрация</button>
        `;
    }
}
function openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.add('active');
        // Очистка ошибок при открытии
        const errorElement = document.getElementById(modalId === 'loginModal' ? 'loginError' : 'registerError');
        if (errorElement) {
            errorElement.textContent = '';
            errorElement.classList.remove('active');
        }
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function switchModal(openId, closeId) {
    closeModal(closeId);
    setTimeout(() => openModal(openId), 200);
}

// Обработка регистрации
async function handleRegister(event) {
    event.preventDefault();
    
    const errorElement = document.getElementById('registerError');
    const username = document.getElementById('registerUsername').value.trim();
    const email = document.getElementById('registerEmail').value.trim();
    const password = document.getElementById('registerPassword').value;
  
    errorElement.textContent = '';
    errorElement.classList.remove('active');
    
    try {
        const response = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, email, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            updateUserInterface();
            closeModal('registerModal');
            document.getElementById('registerForm').reset();
            loadMovies();
            alert('Регистрация успешна!');
        } else {
            errorElement.textContent = data.error || 'Ошибка регистрации';
            errorElement.classList.add('active');
        }
    } catch (error) {
        console.error('Ошибка регистрации:', error);
        errorElement.textContent = 'Не удалось подключиться к серверу';
        errorElement.classList.add('active');
    }
}

// Обработка входа
async function handleLogin(event) {
    event.preventDefault();
    
    const errorElement = document.getElementById('loginError');
    const username = document.getElementById('loginUsername').value.trim();
    const password = document.getElementById('loginPassword').value;
    
    errorElement.textContent = '';
    errorElement.classList.remove('active');
    
    try {
        const response = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify({ username, password })
        });
        
        const data = await response.json();
        
        if (response.ok) {
            currentUser = data.user;
            updateUserInterface();
            closeModal('loginModal');
            document.getElementById('loginForm').reset();
            loadMovies();
            alert('Вход выполнен успешно!');
        } else {
            errorElement.textContent = data.error || 'Ошибка входа';
            errorElement.classList.add('active');
        }
    } catch (error) {
        console.error('Ошибка входа:', error);
        errorElement.textContent = 'Не удалось подключиться к серверу';
        errorElement.classList.add('active');
    }
}

// Обработка выхода
async function handleLogout() {
    try {
        const response = await fetch(`${API_URL}/logout`, {
            method: 'POST',
            credentials: 'include'
        });
        
        if (response.ok) {
            currentUser = null;
            updateUserInterface();
            const moviesList = document.getElementById('moviesList');
            if (moviesList) {
                moviesList.innerHTML = '<p>Войдите, чтобы просмотреть ваши фильмы</p>';
            }
            alert('Выход выполнен успешно!');
        }
    } catch (error) {
        console.error('Ошибка выхода:', error);
    }
}

window.onclick = function(event) {
    const loginModal = document.getElementById('loginModal');
    const registerModal = document.getElementById('registerModal');
    
    if (event.target === loginModal) {
        closeModal('loginModal');
    }
    if (event.target === registerModal) {
        closeModal('registerModal');
    }
}

// Делаем функции доступными глобально
window.openModal = openModal;
window.closeModal = closeModal;
window.switchModal = switchModal;
window.handleRegister = handleRegister;
window.handleLogin = handleLogin;
window.handleLogout = handleLogout;

document.addEventListener('DOMContentLoaded', function() {
    const gradientBg = document.querySelector('.gradient-bg1');
    if (gradientBg) {
        document.addEventListener('mousemove', function(e) {
            const mouseX = e.clientX / window.innerWidth;
            const mouseY = e.clientY / window.innerHeight;
            const posX = mouseX * 100;
            const posY = mouseY * 100;
            gradientBg.style.background = `
                radial-gradient(
                    circle at ${posX}% ${posY}%,
    rgb(68, 10, 10) 0%,
    rgb(61, 8, 8) 25%,
    rgb(43, 5, 5) 50%,
    rgb(34, 3, 3) 75%,
    rgb(14, 13, 13) 100%
                )
            `;
        });
    }
    
    checkCurrentUser().then(() => {
        initCarousel();
        loadMovies();
    });

    // Добавление эффекта при наведении на элементы контента
    const contentItems = document.querySelectorAll('.content-item');
    
    contentItems.forEach(item => {
        item.addEventListener('mouseenter', function() {
            this.style.zIndex = '10';
        });
        
        item.addEventListener('mouseleave', function() {
            this.style.zIndex = '1';
        });
    });
});

