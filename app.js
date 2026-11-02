let currentLesson = [];
let currentIndex = 0;

const srbTextEl = document.getElementById('srb-text');
const rusTextEl = document.getElementById('rus-text');
const flashcard = document.getElementById('flashcard');
const progressText = document.getElementById('progress-text');
const lessonSelect = document.getElementById('lesson-select');
const sectionList = document.getElementById('section-list');

// Hvatamo sve card-content elemente (prednji i zadnji) i svu navigaciju
const cardContents = document.querySelectorAll('.card-content');
const prevBtns = document.querySelectorAll('.prev-btn');
const nextBtns = document.querySelectorAll('.next-btn');

function popuniSelect() {
    katalogCasova.forEach(cas => {
        const option = document.createElement('option');
        option.value = cas.id;
        option.textContent = cas.naziv;
        lessonSelect.appendChild(option);
    });
}

function promeniCas(casId) {
    const casInfo = katalogCasova.find(c => c.id === casId);
    
    if (window[casInfo.varijabla]) {
        pokreniLekciju(window[casInfo.varijabla]);
    } else {
        const script = document.createElement('script');
        script.src = casInfo.fajl;
        script.onload = () => {
            pokreniLekciju(window[casInfo.varijabla]);
        };
        document.body.appendChild(script);
    }
}

function pokreniLekciju(podaciCasa) {
    currentLesson = podaciCasa;
    currentIndex = 0; 
    izgradiSidebar(podaciCasa);

    if(flashcard.classList.contains('flipped')) {
        flashcard.classList.remove('flipped');
        setTimeout(() => loadCard(currentIndex), 300);
    } else {
        loadCard(currentIndex);
    }
}

function izgradiSidebar(podaciCasa) {
    sectionList.innerHTML = ''; 
    let imaSekcija = false;

    podaciCasa.forEach((kartica, index) => {
        if (kartica.sekcija) {
            imaSekcija = true;
            const li = document.createElement('li');
            li.textContent = kartica.sekcija;
            li.dataset.index = index; 
            
            li.addEventListener('click', () => {
                currentIndex = index;
                if(flashcard.classList.contains('flipped')) {
                    flashcard.classList.remove('flipped');
                    setTimeout(() => loadCard(currentIndex), 300);
                } else {
                    loadCard(currentIndex);
                }
            });
            sectionList.appendChild(li);
        }
    });
    document.getElementById('sekcije-naslov').style.display = imaSekcija ? 'block' : 'none';
}

function azurirajAktivnuSekciju() {
    const sekcijeLi = document.querySelectorAll('.section-list li');
    let aktivniLi = null;

    sekcijeLi.forEach(li => {
        li.classList.remove('active');
        if (parseInt(li.dataset.index) <= currentIndex) {
            aktivniLi = li;
        }
    });

    if (aktivniLi) {
        aktivniLi.classList.add('active');
    }
}

function loadCard(index) {
    if(flashcard.classList.contains('flipped')) {
        flashcard.classList.remove('flipped');
        setTimeout(() => {
            srbTextEl.textContent = currentLesson[index].srb;
            rusTextEl.textContent = currentLesson[index].rus;
        }, 300);
    } else {
        srbTextEl.textContent = currentLesson[index].srb;
        rusTextEl.textContent = currentLesson[index].rus;
    }
    
    progressText.textContent = `${index + 1} / ${currentLesson.length}`;
    azurirajAktivnuSekciju(); 
}

// Event Listeners za okretanje kartice (samo središnji deo)
cardContents.forEach(content => {
    content.addEventListener('click', () => {
        flashcard.classList.toggle('flipped');
    });
});

// Event Listeners za Next dugmiće
nextBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Sprečava okretanje kartice pri kliku na dugme
        if(currentLesson.length === 0) return;
        currentIndex++;
        if (currentIndex >= currentLesson.length) currentIndex = 0;
        loadCard(currentIndex);
    });
});

// Event Listeners za Prev dugmiće
prevBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
        e.stopPropagation(); // Sprečava okretanje kartice pri kliku na dugme
        if(currentLesson.length === 0) return;
        currentIndex--;
        if (currentIndex < 0) currentIndex = currentLesson.length - 1;
        loadCard(currentIndex);
    });
});

lessonSelect.addEventListener('change', (e) => {
    promeniCas(e.target.value);
});

popuniSelect();
promeniCas(katalogCasova[0].id);