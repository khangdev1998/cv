function showForm(event) {
  event.preventDefault();
  var contactInfo = document.getElementById("contact-info");
  var contactForm = document.getElementById("contact-form");
  contactForm.style.display = "block";
  contactInfo.style.display = "none";
}
function showUserInfo(event) {
  event.preventDefault();
  var contactInfo = document.getElementById("contact-info");
  var contactForm = document.getElementById("contact-form");
  contactForm.style.display = "none";
  contactInfo.style.display = "block";
}

// background canvas
var w = c.width = window.innerWidth,
  h = c.height = window.innerHeight,
  ctx = c.getContext('2d'),

  BoxSide = [80, 200], // [ max, min ]
  BoxSpeed = [2, 4],
  BoxLineCount = [2, 5],
  BoxLineSplits = [5, 10],
  BoxAmount = 20,
  BoxSpawnProb = .05,
  BoxJitterMultiplier = .02,
  BoxHueVariation = 30,
  PointSpeedMultiplier = .01,

  boxes = [],
  tick = (Math.random() * 360) | 0;

function Box() {

  this.reset();
}
Box.prototype.reset = function () {

  this.side = randomArr(BoxSide) | 0;
  this.lineCount = randomArr(BoxLineCount) | 0;
  this.lineSplits = randomArr(BoxLineSplits) | 0;
  this.hue = tick;
  this.jitter = BoxJitterMultiplier * this.side;

  var speed = randomArr(BoxSpeed) | 0;

  // decide on which side it spawns

  var side = Math.random() < .5,
    rad;

  if (Math.random() < .5) {

    this.x = Math.random() * w;
    this.y = side ? -this.side : h + this.side;

    rad = side ? Math.random() * Math.PI : - Math.random() * Math.PI;

  } else {

    this.x = Math.random() < .5 ? -this.side : w + this.side;
    this.y = Math.random() * h;

    rad = side ? Math.random() * Math.PI + Math.PI : -Math.random() * Math.PI + Math.PI
  }

  this.vx = Math.cos(rad) * speed;
  this.vy = Math.sin(rad) * speed;

  // handle the lines
  this.lines = [];

  for (var i = 0; i < this.lineCount; ++i) {

    var line = {

      p1: new Point(this.side),
      p2: new Point(this.side)
    };

    line.p1 = new Point(this.side);
    line.p2 = new Point(this.side);

    this.lines.push(line);
  }
}
Box.prototype.step = function () {

  this.x += this.vx;
  this.y += this.vy;

  ctx.strokeStyle = 'hsl( hue, 80%, 50% )'.replace(
    'hue', this.hue + Math.random() * BoxHueVariation);

  ctx.save();
  ctx.translate(this.x, this.y);

  for (var i = 0; i < this.lineCount; ++i) {

    var l1 = this.lines[i];

    l1.p1.step();
    l1.p2.step();

    var dx1 = (l1.p1.x - l1.p2.x) / this.lineSplits,
      dy1 = (l1.p1.y - l1.p2.y) / this.lineSplits;

    for (var j = i + 1; j < this.lineCount; ++j) {

      var l2 = this.lines[j],
        dx2 = (l2.p1.x - l2.p2.x) / this.lineSplits,
        dy2 = (l2.p1.y - l2.p2.y) / this.lineSplits;

      for (var k = 0; k < this.lineSplits; ++k) {

        var rand1 = random(this.jitter, -this.jitter),
          rand2 = random(this.jitter, -this.jitter);

        ctx.beginPath();
        ctx.moveTo(
          l1.p1.x + rand1 + k * dx1,
          l1.p1.y + rand1 + k * dy1);
        ctx.lineTo(
          l2.p1.x + rand2 + k * dx2,
          l2.p1.y + rand2 + k * dy2);

        ctx.stroke();
      }
    }
  }

  ctx.restore();

  if (this.x + this.side < 0 || this.x > w ||
    this.y + this.side < 0 || this.y > h)
    this.reset();
}

function Point(side) {

  this.side = side;

  this.x = Math.random() * side;
  this.y = Math.random() * side;

  var rad = Math.random() * Math.PI * 2,
    speed = side * PointSpeedMultiplier;

  this.vx = Math.cos(rad) * speed;
  this.vy = Math.sin(rad) * speed;
}
Point.prototype.step = function () {

  this.x += this.vx;
  this.y += this.vy;

  if (this.x < 0 || this.x > this.side) this.vx *= -1;
  if (this.y < 0 || this.y > this.side) this.vy *= -1;
}

function anim() {

  window.requestAnimationFrame(anim);

  this.tick += .2;
  this.tick %= 360;

  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = 'rgba(0,0,0,.1)';
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = 'lighter'

  if (boxes.length < BoxAmount && Math.random() < BoxSpawnProb)
    boxes.push(new Box);

  boxes.map(function (box) { box.step(); });
}

function randomArr(arr) {

  return random(arr[0], arr[1]);
}
function random(min, max) {

  return Math.random() * (max - min) + min;
}

ctx.lineWidth = .1;

ctx.fillStyle = '#222';
ctx.fillRect(0, 0, w, h);

anim();

// Popup image
const popupImage = document.querySelector('.section-image')
const overlay = document.querySelector('.overlay')
const overlayImage = document.querySelector('.overlay-image')
popupImage.addEventListener('click', handlePopupImage)
function handlePopupImage() {
  overlay.style.display = 'flex'
}

window.addEventListener('click', function (e) {
  if (!popupImage.contains(e.target) && !e.target.matches('.overlay-image')) {
    overlay.style.display = 'none'
  }
})
// Tab item live move
const $ = document.querySelector.bind(document)
const $$ = document.querySelectorAll.bind(document)

const tabItem = $$('.tab-item')
const tabPane = $$('.tab-pane')
const line = $('.line')
const itemActiveLine = $('.tab-item.active')

line.style.left = itemActiveLine.offsetLeft + 'px'
line.style.width = itemActiveLine.offsetWidth + 'px'

tabItem.forEach(function (item, index) {
  item.addEventListener('click', function (e) {
    const itemActive = $('.tab-item.active')
    const paneActive = $('.tab-pane.active')
    paneActive.classList.remove('active')
    itemActive.classList.remove('active')
    this.classList.add('active')
    tabPane[index].classList.add('active')
    tabPane[index].classList.add('is-show')

    line.style.left = this.offsetLeft + 'px'
    line.style.width = this.offsetWidth + 'px'
  })
})

// Download cv
function load() {
  alert('Đang làm ....')
}
