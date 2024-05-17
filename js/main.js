let sun = new Image();
let moon = new Image();
let earth = new Image();

function init() {
  sun.src = 'Canvas_sun.png';
  moon.src = 'Canvas_moon.png';
  earth.src = 'Canvas_earth.png';
  window.requestAnimationFrame(draw);
}

function draw() {
  const ctx = document.getElementById("canvas").getContext("2d");

  ctx.globalCompositeOperation = "destination-over";
  ctx.clearRect(0, 0, 300, 300); // limpiar canvas desde el origen hasta el tamaño

  ctx.fillStyle = "rgba(0,0,0,0.4)"; //Color RGB con Opacidad del relleno
  ctx.strokeStyle = "rgba(0,153,255,0.4)"; //Color RGB con Opacidad de la línea
  ctx.save(); //Guarda en la memoria de vídeo las propiedades de la imagen
  ctx.translate(150, 150); //Mueve el origen de las coordenadas

  // La tierra
  let time = new Date(); //Obtiene la fecha y hora del sistema en la variable time
  ctx.rotate(//Gira en el sentido de las manecillas
    ((2 * Math.PI) / 60) * time.getSeconds() + // Calcula el ángulo correspondiente a un segundo en radianes. 
    ((2 * Math.PI) / 60000) * time.getMilliseconds(), // Calcula el ángulo correspondiente en milisegundos en radianes. 
  );
  ctx.translate(105, 0); //Desplazamiento llamado Upset
  ctx.fillRect(0, -12, 50, 24); // Sombra
  ctx.drawImage(earth, -12, -12); //Método de la API Canvas para dibujar el objeto, x (-=izquierda), y (-=arriba)

  // La luna
  ctx.save();
  ctx.rotate(
    ((2 * Math.PI) / 6) * time.getSeconds() +
    ((2 * Math.PI) / 6000) * time.getMilliseconds(),
  );
  ctx.translate(0, 28.5);
  ctx.drawImage(moon, -3.5, -3.5);

  ctx.restore(); //Trae los status (imagenes) guardadas
  ctx.restore();

  ctx.beginPath();
  ctx.arc(150, 150, 105, 0, Math.PI * 2, false); // Órbita terrestre
  ctx.stroke();

  ctx.drawImage(sun, 0, 0, 300, 300);

  window.requestAnimationFrame(draw);//Recursividad para seguir dibujando a 60 cuadros por segundo
}



function clock() {
  var now = new Date();
  var ctx = document.getElementById("canvasClock").getContext("2d");
  ctx.save();
  ctx.clearRect(0, 0, 300, 300); // Limpiar canvas
  ctx.translate(150, 150); // Mover el origen al centro del canvas
  ctx.scale(0.8, 0.8); // Escalar para hacer el reloj más grande
  ctx.rotate(-Math.PI / 2);
  ctx.strokeStyle = "black";
  ctx.fillStyle = "white";
  ctx.lineWidth = 8;
  ctx.lineCap = "round";

  // Aguja de la hora
  ctx.save();
  for (var i = 0; i < 12; i++) {
    ctx.beginPath();
    ctx.rotate(Math.PI / 6);
    ctx.moveTo(100, 0);
    ctx.lineTo(120, 0);
    ctx.stroke();
  }
  ctx.restore();

  // Aguja del minuto
  ctx.save();
  ctx.lineWidth = 5;
  for (i = 0; i < 60; i++) {
    if (i % 5 != 0) {
      ctx.beginPath();
      ctx.moveTo(117, 0);
      ctx.lineTo(120, 0);
      ctx.stroke();
    }
    ctx.rotate(Math.PI / 30);
  }
  ctx.restore();

  var sec = now.getSeconds();
  var min = now.getMinutes();
  var hr = now.getHours();
  hr = hr >= 12 ? hr - 12 : hr;

  ctx.fillStyle = "black";

  // Escribimos la hora
  ctx.save();
  ctx.rotate(
    hr * (Math.PI / 6) + (Math.PI / 360) * min + (Math.PI / 21600) * sec
  );
  ctx.lineWidth = 14;
  ctx.beginPath();
  ctx.moveTo(-20, 0);
  ctx.lineTo(80, 0);
  ctx.stroke();
  ctx.restore();

  // Escribimos los minutos
  ctx.save();
  ctx.rotate((Math.PI / 30) * min + (Math.PI / 1800) * sec);
  ctx.lineWidth = 10;
  ctx.beginPath();
  ctx.moveTo(-28, 0);
  ctx.lineTo(112, 0);
  ctx.stroke();
  ctx.restore();

  // Escribimos los segundos
  ctx.save();
  ctx.rotate((sec * Math.PI) / 30);
  ctx.strokeStyle = "#D40000";
  ctx.fillStyle = "#D40000";
  ctx.lineWidth = 6;
  ctx.beginPath();
  ctx.moveTo(-30, 0);
  ctx.lineTo(83, 0);
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, 10, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.beginPath();
  ctx.arc(95, 0, 10, 0, Math.PI * 2, true);
  ctx.stroke();
  ctx.fillStyle = "rgba(0,0,0,0)";
  ctx.arc(0, 0, 3, 0, Math.PI * 2, true);
  ctx.fill();
  ctx.restore();

  ctx.beginPath();
  ctx.lineWidth = 14;
  ctx.strokeStyle = "#325FA2";
  ctx.arc(0, 0, 142, 0, Math.PI * 2, true);
  ctx.stroke();

  ctx.restore();

  window.requestAnimationFrame(clock);
}


function mouse() {
  const canvas = document.getElementById("canvasMouse");
  const context = canvas.getContext("2d");
  context.globalAlpha = 0.5;

  const cursor = {
    x: canvas.width / 2,
    y: canvas.height / 2,
  };

  let particlesArray = [];

  generateParticles(101);
  setSize();
  anim();

  addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    cursor.x = e.clientX - rect.left;
    cursor.y = e.clientY - rect.top;
  });

  addEventListener(
    "touchmove",
    (e) => {
      e.preventDefault();
      const rect = canvas.getBoundingClientRect();
      cursor.x = e.touches[0].clientX - rect.left;
      cursor.y = e.touches[0].clientY - rect.top;
    },
    { passive: false },
  );

  addEventListener("resize", () => setSize());

  function generateParticles(amount) {
    for (let i = 0; i < amount; i++) {
      particlesArray[i] = new Particle(
        canvas.width / 2,
        canvas.height / 2,
        4,
        generateColor(),
        0.02,
      );
    }
  }

  function generateColor() {
    let hexSet = "0123456789ABCDEF";
    let finalHexString = "#";
    for (let i = 0; i < 6; i++) {
      finalHexString += hexSet[Math.ceil(Math.random() * 15)];
    }
    return finalHexString;
  }

  function setSize() {
    canvas.height = 300;
    canvas.width = 300;
  }

  function Particle(x, y, particleTrailWidth, strokeColor, rotateSpeed) {
    this.x = x;
    this.y = y;
    this.particleTrailWidth = particleTrailWidth;
    this.strokeColor = strokeColor;
    this.theta = Math.random() * Math.PI * 2;
    this.rotateSpeed = rotateSpeed;
    this.t = Math.random() * 150;

    this.rotate = () => {
      const ls = {
        x: this.x,
        y: this.y,
      };
      this.theta += this.rotateSpeed;
      this.x = cursor.x + Math.cos(this.theta) * this.t;
      this.y = cursor.y + Math.sin(this.theta) * this.t;
      context.beginPath();
      context.lineWidth = this.particleTrailWidth;
      context.strokeStyle = this.strokeColor;
      context.moveTo(ls.x, ls.y);
      context.lineTo(this.x, this.y);
      context.stroke();
    };
  }

  function anim() {
    requestAnimationFrame(anim);

    context.fillStyle = "rgb(0 0 0 / 5%)";
    context.fillRect(0, 0, canvas.width, canvas.height);

    particlesArray.forEach((particle) => particle.rotate());
  }
}

function imagenPanoramica() {
  const img = new Image();
  img.src = "panoramica.jpg";
  const canvasXSize = 800;
  const canvasYSize = 200;
  const speed = 30; // lower is faster
  const scale = 1.05;
  const y = -4.5; // vertical offset

  // Main program
  const dx = 0.75;
  let imgW;
  let imgH;
  let x = 0;
  let clearX;
  let clearY;
  let ctx;

  img.onload = () => {
    imgW = img.width * scale;
    imgH = img.height * scale;

    if (imgW > canvasXSize) {
      // Image larger than canvas
      x = canvasXSize - imgW;
    }

    // Check if image dimension is larger than canvas
    clearX = Math.max(imgW, canvasXSize);
    clearY = Math.max(imgH, canvasYSize);

    // Get canvas context
    ctx = document.getElementById("panoramica").getContext("2d");

    // Set refresh rate
    return setInterval(draw, speed);
  };

  function draw() {
    ctx.clearRect(0, 0, clearX, clearY); // clear the canvas

    // If image is <= canvas size
    if (imgW <= canvasXSize) {
      // Reset, start from beginning
      if (x > canvasXSize) {
        x = -imgW + x;
      }

      // Draw additional image1
      if (x > 0) {
        ctx.drawImage(img, -imgW + x, y, imgW, imgH);
      }

      // Draw additional image2
      if (x - imgW > 0) {
        ctx.drawImage(img, -imgW * 2 + x, y, imgW, imgH);
      }
    } else {
      // Image is > canvas size
      // Reset, start from beginning
      if (x > canvasXSize) {
        x = canvasXSize - imgW;
      }

      // Draw additional image
      if (x > canvasXSize - imgW) {
        ctx.drawImage(img, x - imgW + 1, y, imgW, imgH);
      }
    }

    // Draw image
    ctx.drawImage(img, x, y, imgW, imgH);

    // Amount to move
    x += dx;
  }
}



init();
window.requestAnimationFrame(clock);
mouse();
imagenPanoramica();