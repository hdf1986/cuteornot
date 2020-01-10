(function () {
  const startButton = document.querySelector('.start-button')
  startButton.addEventListener('click', e => {
    e.preventDefault()
    const pop = window.open('/cats.html',"windows","menubar=1,resizable=0,width=350,height=250");
  })
})()
