// 这是一个用于生成 PWA 图标的 Node.js 脚本
// 运行前需要安装: npm install canvas

const fs = require('fs');
const path = require('path');
const { createCanvas } = require('canvas');

const sizes = [16, 32, 72, 96, 128, 144, 152, 192, 384, 512];
const outputDir = './public/icons';

// 确保输出目录存在
if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

function createIcon(size) {
  const canvas = createCanvas(size, size);
  const ctx = canvas.getContext('2d');
  
  // 背景渐变
  const gradient = ctx.createLinearGradient(0, 0, size, size);
  gradient.addColorStop(0, '#667eea');
  gradient.addColorStop(1, '#764ba2');
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, size, size);
  
  // 圆角效果 (简化版)
  const radius = size * 0.15;
  ctx.globalCompositeOperation = 'destination-in';
  ctx.beginPath();
  ctx.roundRect(0, 0, size, size, radius);
  ctx.fill();
  ctx.globalCompositeOperation = 'source-over';
  
  // 书本图标
  ctx.fillStyle = '#ffffff';
  
  // 书本主体
  const bookWidth = size * 0.6;
  const bookHeight = size * 0.4;
  const bookX = (size - bookWidth) / 2;
  const bookY = (size - bookHeight) / 2;
  
  ctx.fillRect(bookX, bookY, bookWidth, bookHeight);
  
  // 书本装订线
  ctx.fillStyle = '#667eea';
  ctx.fillRect(size / 2 - 2, bookY, 4, bookHeight);
  
  // 文字 "词"
  ctx.fillStyle = '#667eea';
  ctx.font = `bold ${size * 0.3}px Arial`;
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillText('词', size / 2, size / 2);
  
  return canvas;
}

// 生成所有尺寸的图标
sizes.forEach(size => {
  const canvas = createIcon(size);
  const buffer = canvas.toBuffer('image/png');
  const filename = `icon-${size}x${size}.png`;
  const filepath = path.join(outputDir, filename);
  
  fs.writeFileSync(filepath, buffer);
  console.log(`Generated: ${filename}`);
});

console.log('All icons generated successfully!');
console.log('Icons saved to:', outputDir);
