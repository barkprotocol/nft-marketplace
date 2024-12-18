// Note: This is a client-side utility, so we'll use the browser's Canvas API
// instead of the Node.js canvas library

interface ImageCustomizationOptions {
  backgroundVariation: 'default' | 'gradient' | 'pattern';
  fontFamily: string;
  fontSize: number;
  textColor: string;
  text: string;
}

export async function customizeImage(imageUrl: string, options: ImageCustomizationOptions): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.crossOrigin = "anonymous";
    img.onload = () => {
      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        reject(new Error('Unable to get 2D context'));
        return;
      }

      // Draw original image
      ctx.drawImage(img, 0, 0);

      // Apply background variation
      switch (options.backgroundVariation) {
        case 'gradient':
          const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
          gradient.addColorStop(0, 'rgba(223, 196, 123, 0.27)');
          gradient.addColorStop(1, 'rgba(205, 184, 137, 0.2)');
          ctx.fillStyle = gradient;
          ctx.fillRect(0, 0, canvas.width, canvas.height);
          break;
        case 'pattern':
          // For simplicity, we'll just draw a simple pattern
          ctx.fillStyle = '#00000022';
          for (let i = 0; i < canvas.width; i += 20) {
            for (let j = 0; j < canvas.height; j += 20) {
              ctx.fillRect(i, j, 10, 10);
            }
          }
          break;
        default:
          // No background variation
          break;
      }

      // Add text
      ctx.font = `${options.fontSize}px ${options.fontFamily}`;
      ctx.fillStyle = options.textColor;
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(options.text, canvas.width / 2, canvas.height - options.fontSize);

      resolve(canvas.toDataURL());
    };
    img.onerror = () => {
      reject(new Error('Failed to load image'));
    };
    img.src = imageUrl;
  });
}

