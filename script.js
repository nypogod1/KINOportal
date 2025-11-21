 // URL API бэкенда!!!!!!!!!!!!!!!!!!!!!!!!!!
        const API_URL = 'http://localhost:5000';
        ////////////////////////////////////////////

        


        // Карусель - автоматическая смена слайдов
        let currentSlide = 0;
        let carouselInterval;

        // Инициализация карусели
        function initCarousel() {
            const slides = document.querySelectorAll('.carousel-slide');
            const indicatorsContainer = document.getElementById('carouselIndicators');
            const carouselContainer = document.querySelector('.carousel-container');
            
            // Создаем индикаторы
            slides.forEach((_, index) => {
                const indicator = document.createElement('button');
                indicator.className = 'carousel-indicator';
                if (index === 0) indicator.classList.add('active');
                indicator.addEventListener('click', () => goToSlide(index));
                indicatorsContainer.appendChild(indicator);
            });

            

            // Запускаем автоматическую смену слайдов каждые 3 секунды
            startAutoSlide();
        }

        // Функция смены слайда
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
            
            // Перезапускаем автоматическую смену
            restartAutoSlide();
        }

        // Функция перехода к конкретному слайду
        function goToSlide(index) {
            const slides = document.querySelectorAll('.carousel-slide');
            const indicators = document.querySelectorAll('.carousel-indicator');
            
            // Убираем активный класс с текущего слайда
            slides[currentSlide].classList.remove('active');
            indicators[currentSlide].classList.remove('active');
            
            // Устанавливаем новый слайд
            currentSlide = index;
            
            // Добавляем активный класс к новому слайду
            slides[currentSlide].classList.add('active');
            indicators[currentSlide].classList.add('active');
            
            // Перезапускаем автоматическую смену
            restartAutoSlide();
        }

        // Запуск автоматической смены слайдов
        function startAutoSlide() {
            carouselInterval = setInterval(() => {
                changeSlide(1);
            }, 1400); // 1.4 секунды
        }

        // Остановка автоматической смены
        function stopAutoSlide() {
            if (carouselInterval) {
                clearInterval(carouselInterval);
            }
        }

        // Перезапуск автоматической смены
        function restartAutoSlide() {
            stopAutoSlide();
            startAutoSlide();
        }

        // Функции для работы с интерфейсом
        function toggleAdminPanel() {
            const panel = document.getElementById('adminPanel');
            panel.classList.toggle('active');
        }


        // Инициализация
        document.addEventListener('DOMContentLoaded', function() {
            // Инициализация карусели
            initCarousel();

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

////////////////////////////////////////////////////////////////////////////////////////////
///////////////ГРАДИЕНТ НА БЛОКЕ CONTENT////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////////////////////////////////



document.addEventListener('DOMContentLoaded', function() {
    const gradientBg = document.querySelector('.gradient-bg1');
    
    document.addEventListener('mousemove', function(e) {
        //позицию мыши
        const mouseX = e.clientX / window.innerWidth;
        const mouseY = e.clientY / window.innerHeight;
        
        //координаты в проценты
        const posX = mouseX * 100;
        const posY = mouseY * 100;
        
        //радиент, который следует за мышкой
        gradientBg.style.background = `
            radial-gradient(
                circle at ${posX}% ${posY}%,
                #e07c7cff 0%,
                #b33f3fff 25%,
                #773232ff 50%,
                #460a0aff 75%,
                #181616ff 100%
            )
        `;
    });
    
    //Анимация градиента
    setTimeout(() => {
        gradientBg.style.transition = 'background 0.3s ease-out';
    }, 100);
    
    // Добавляем параллакс эффект для контента
    const content = document.querySelector('.content');
    document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        content.style.transform = `translate(${moveX}px, ${moveY}px)`;
    });
});


////////////////////////////////////////////////////////////////////////////////////////////


        ///////////////////////////////////////////////////////////////////
        ///JavaScript-код для загрузки и добавления фильмов через API./////
        ///////////////////////////////////////////////////////////////////
        ////////////LoadMovies///////////////////AddMovies/////////////////
        ///////////////////////////////////////////////////////////////////













