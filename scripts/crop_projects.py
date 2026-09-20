"""
Script para dividir una imagen de proyectos en 4 imágenes individuales.

Uso:
    python scripts/crop_projects.py

Requiere: pip install Pillow
"""
from PIL import Image
import os

# Configuración (rutas relativas desde la raíz del proyecto)
input_path = 'docs/img/a_Create_4_minimalist_.png'
output_dir = 'project/portfolio-ai-chat/public/images/projects'

# Crear directorio si no existe
os.makedirs(output_dir, exist_ok=True)

# Cargar imagen
img = Image.open(input_path)
width, height = img.size

print(f'Imagen original: {width}x{height}')

# Definir cuadrantes (top-left, top-right, bottom-left, bottom-right)
cropped = {
    'chatbot-whatsapp.png': (0, 0, width//2, height//2),
    'brain-ai.png': (width//2, 0, width, height//2),
    'personalizar-ia.png': (0, height//2, width//2, height),
    'portfolio-web.png': (width//2, height//2, width, height)
}

# Recortar y guardar
for name, box in cropped.items():
    output_path = os.path.join(output_dir, name)
    img.crop(box).save(output_path)
    print(f'Guardado: {output_path}')

print('¡Listo! 4 imágenes individuales creadas.')
