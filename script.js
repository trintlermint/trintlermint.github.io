/**
 * @name [textmode.js] Plasma Field Pumpkin
 * @description plasma effect in shape of pumpkin
 * @author trintler (pumpkin), rest: humanbydefinition
 * @link https://github.com/humanbydefinition/textmode.js
 */

const tm = textmode.create({
    width: window.innerWidth,
    height: window.innerHeight,
    fontSize: 16
});

function isInsidePumpkin(x, y, width, height) {
    const centerX = width / 2;
    const centerY = height / 2;
    const nx = (x - centerX) / (width * 0.3);
    const ny = (y - centerY) / (height * 0.35);
    const bodyRadius = 1.0;
    const bodyDistance = Math.sqrt(nx * nx + ny * ny * 1.2);
    const ridges = Math.sin(Math.atan2(ny, nx) * 8) * 0.1;
    const pumpkinBody = bodyDistance <= (bodyRadius + ridges);
    const stemWidth = 0.08;
    const stemHeight = 0.15;
    const stemX = Math.abs(nx) <= stemWidth;
    const stemY = ny >= -bodyRadius - stemHeight && ny <= -bodyRadius;
    const stem = stemX && stemY;
    const segmentLines = Math.abs(Math.sin(Math.atan2(ny, nx) * 4)) > 0.9;
    
    return pumpkinBody || stem;
}

tm.draw(() => {
    tm.background(0);

    const time = tm.frameCount * 0.02;
    
    for (let y = 0; y < tm.grid.rows; y++) {
        for (let x = 0; x < tm.grid.cols; x++) {
            if (!isInsidePumpkin(x, y, tm.grid.cols, tm.grid.rows)) {
                continue;
            }
            
            tm.push();
            const nx = x / tm.grid.cols;
            const ny = y / tm.grid.rows;
            
            // create plasma waves
            const plasma1 = Math.sin(nx * 8 + time);
            const plasma2 = Math.sin(ny * 6 + time * 1.3);
            const plasma3 = Math.sin((nx + ny) * 4 + time * 0.8);
            const plasma4 = Math.sin(Math.sqrt(nx * nx + ny * ny) * 12 + time * 1.5);
            
            // combine plasma values
            const combined = (plasma1 + plasma2 + plasma3 + plasma4) / 4;
            const intensity = (combined + 1) / 2; // Normalize to 0-1
            
            const centerX = tm.grid.cols / 2;
            const centerY = tm.grid.rows / 2;
            const distanceFromCenter = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));
            const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
            
            // orange -> yellow gradient
            let hue, saturation, lightness;
            const stemArea = Math.abs(x - centerX) <= tm.grid.cols * 0.024 && y <= centerY - tm.grid.rows * 0.25;
            
            if (stemArea) {
                // green/brown for stem
                hue = 0.25 + intensity * 0.1; // Green-ish
                saturation = 0.6 + intensity * 0.4;
                lightness = 0.3 + intensity * 0.4;
            } else {
                // orange/yellow for pumpkin body
                hue = 0.08 + intensity * 0.1; // Orange to yellow
                saturation = 0.8 + intensity * 0.2;
                lightness = 0.4 + intensity * 0.4;
            }
            
            const hsl2rgb = (h, s, l) => {
                const c = (1 - Math.abs(2 * l - 1)) * s;
                const x = c * (1 - Math.abs((h * 6) % 2 - 1));
                const m = l - c / 2;
                let r, g, b;
                
                if (h < 1/6) [r, g, b] = [c, x, 0];
                else if (h < 2/6) [r, g, b] = [x, c, 0];
                else if (h < 3/6) [r, g, b] = [0, c, x];
                else if (h < 4/6) [r, g, b] = [0, x, c];
                else if (h < 5/6) [r, g, b] = [x, 0, c];
                else [r, g, b] = [c, 0, x];
                
                return [
                    Math.floor((r + m) * 255),
                    Math.floor((g + m) * 255),
                    Math.floor((b + m) * 255)
                ];
            };
            
            const [r, g, b] = hsl2rgb(hue, saturation, lightness);

            if (intensity > 0.8) {
                tm.char('Ü');
            } else if (intensity > 0.6) {
                tm.char(')');
            } else if (intensity > 0.4) {
                tm.char('u');
            } else if (intensity > 0.2) {
                tm.char(',');
            } else if (intensity > 0.1) {
                tm.char('-');
            } else {
                tm.char(' ');
            }
            
            tm.charColor(r, g, b);
            tm.cellColor(0, 0, 0);
            tm.rect(x, y, 1, 1);
            
            tm.pop();
        }
    }
});

tm.windowResized(() => {
    tm.resizeCanvas(window.innerWidth, window.innerHeight);
});
