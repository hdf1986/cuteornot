'use strict';

(function () {
  const width = 1000;
  const height = 700;
  window.resizeTo(width, height);
  window.addEventListener('resize', e => {
    window.resizeTo(width, height);
  })
  const host = 'http://localhost:3000'
  const socket = io(host);

  const evilCounter = document.querySelector('.evil-counter');
  const goodCounter = document.querySelector('.good-counter');
  const countsCats = cats => {
    const isEvil = cat => cat.x >= width / 2
    const catsCounter = cats.reduce((acc, current) => {
      if(isEvil(current)) acc += 1
      return acc;
    }, 0)

    evilCounter.innerText = `Evil cats ${catsCounter}`
    goodCounter.innerText = `Good cats ${cats.length - catsCounter}`
  }
  const loadCats = cats => {
    countsCats(cats)
    const catsContainer = document.querySelector('.cats-container');

    socket.on('update', data => {
      countsCats(cats)
      cats[cats.findIndex(currentCat => currentCat.name === data.name)] = data

      const catContainer = document.querySelector(`[data-id=${data.name}]`)
      catContainer.style.left = `${data.x}px`
      catContainer.style.top = `${data.y}px`;
    })
    cats.forEach(cat => {
      const catContainer = document.createElement('li');
      const catImage = document.createElement('img');
      const catName = document.createElement('p');

      catImage.src = `${host}/images/${cat.image}`
      catName.innerText = cat.name;
      catContainer.dataset.id = cat.name;
      catContainer.classList.add('cat-container')

      catContainer.style.left = `${cat.x}px`
      catContainer.style.top = `${cat.y}px`;

      catContainer.draggable = true;

      catContainer.addEventListener('dragstart', e => {
        if(cat.locked) {
          e.preventDefault();
          return
        }
        catContainer.classList.add('dragging');
      })
      catContainer.addEventListener('dragend', e => {
        catContainer.style.left = `${e.pageX}px`
        catContainer.style.top = `${e.pageY}px`;

        catContainer.classList.remove('dragging');

        socket.emit('dragend', { name: cat.name, x: e.clientX, y: e.clientY })
      })

      catContainer.appendChild(catImage);
      catContainer.appendChild(catName);
      catsContainer.appendChild(catContainer)
    })
  }
  fetch(`${host}/cats`)
    .then(res => res.json())
    .then(cats => loadCats(cats))
})()
