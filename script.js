/**
 * @name [textmode.js] Plasma Field Pumpkin
 * @description A colorful plasma field effect in the shape of a pumpkin using multiple sine waves.
 * @author trintler (pumpkin), rest: humanbydefinition
 * @link https://github.com/humanbydefinition/textmode.js
 */

// Create textmode instance
const tm = textmode.create({
    width: window.innerWidth,
    height: window.innerHeight,
    fontSize: 16
});

// Function to check if a point is inside a pumpkin shape
function isInsidePumpkin(x, y, width, height) {
    // Normalize coordinates to center
    const centerX = width / 2;
    const centerY = height / 2;
    const nx = (x - centerX) / (width * 0.3);
    const ny = (y - centerY) / (height * 0.35);
    
    // Create pumpkin body (main oval with ridges)
    const bodyRadius = 1.0;
    const bodyDistance = Math.sqrt(nx * nx + ny * ny * 1.2);
    
    // Add vertical ridges to make it look more pumpkin-like
    const ridges = Math.sin(Math.atan2(ny, nx) * 8) * 0.1;
    const pumpkinBody = bodyDistance <= (bodyRadius + ridges);
    
    // Create pumpkin stem (small rectangle at top)
    const stemWidth = 0.08;
    const stemHeight = 0.15;
    const stemX = Math.abs(nx) <= stemWidth;
    const stemY = ny >= -1.2 && ny <= -1.0;
    const stem = stemX && stemY;
    
    // Create pumpkin segments (vertical lines)
    const segmentLines = Math.abs(Math.sin(Math.atan2(ny, nx) * 4)) > 0.9;
    
    return pumpkinBody || stem;
}

tm.draw(() => {
    tm.background(0);

    const time = tm.frameCount * 0.02;
    
    for (let y = 0; y < tm.grid.rows; y++) {
        for (let x = 0; x < tm.grid.cols; x++) {
            // Check if current position is inside pumpkin shape
            if (!isInsidePumpkin(x, y, tm.grid.cols, tm.grid.rows)) {
                continue; // Skip if outside pumpkin shape
            }
            
            tm.push();
            
            // Normalize coordinates
            const nx = x / tm.grid.cols;
            const ny = y / tm.grid.rows;
            
            // Create multiple plasma waves
            const plasma1 = Math.sin(nx * 8 + time);
            const plasma2 = Math.sin(ny * 6 + time * 1.3);
            const plasma3 = Math.sin((nx + ny) * 4 + time * 0.8);
            const plasma4 = Math.sin(Math.sqrt(nx * nx + ny * ny) * 12 + time * 1.5);
            
            // Combine plasma values
            const combined = (plasma1 + plasma2 + plasma3 + plasma4) / 4;
            const intensity = (combined + 1) / 2; // Normalize to 0-1
            
            // Create orange/yellow pumpkin colors instead of rainbow
            const centerX = tm.grid.cols / 2;
            const centerY = tm.grid.rows / 2;
            const distanceFromCenter = Math.sqrt((x - centerX) * (x - centerX) + (y - centerY) * (y - centerY));
            const maxDistance = Math.sqrt(centerX * centerX + centerY * centerY);
            
            // Orange to yellow gradient based on intensity and position
            let hue, saturation, lightness;
            
            // Check if in stem area
            const stemArea = Math.abs(x - centerX) <= tm.grid.cols * 0.024 && y <= centerY - tm.grid.rows * 0.25;
            
            if (stemArea) {
                // Green/brown for stem
                hue = 0.25 + intensity * 0.1; // Green-ish
                saturation = 0.6 + intensity * 0.4;
                lightness = 0.3 + intensity * 0.4;
            } else {
                // Orange/yellow for pumpkin body
                hue = 0.08 + intensity * 0.1; // Orange to yellow
                saturation = 0.8 + intensity * 0.2;
                lightness = 0.4 + intensity * 0.4;
            }
            
            // Convert HSL to RGB
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
            
            // Map intensity to characters
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
