import size from 'image-size';
import Canvas from 'canvas';

export async function draw(path, rotate) {
  const dimensions = size(path);
  const canvas = Canvas.createCanvas(dimensions.width, dimensions.height);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  const img = await Canvas.loadImage(path);

  if (rotate) {
    ctx.save();
    ctx.translate(canvas.width / 2, canvas.height / 2);
    ctx.rotate(rotate * Math.PI / 180);
    ctx.drawImage(img, -img.width / 2, -img.height / 2);
    ctx.restore();
  } else {
    ctx.drawImage(img, 0, 0, img.width, img.height);
  }

  return canvas.toBuffer();
}

export async function write(words) {
  const canvas = Canvas.createCanvas(400, 400);
  const ctx = canvas.getContext('2d');
  ctx.fillStyle = 'white';
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = 'black';
  ctx.font = '16px Arial';
  ctx.fillText(words, 250 - words.length * 5, 240);
  
  return canvas.toBuffer();
}
