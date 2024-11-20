# Imagen base
FROM node:18

# Crear directorio de trabajo
WORKDIR /usr/src/app

# Copiar dependencias y código
COPY package*.json ./
RUN npm install
COPY . .

# Exponer puerto y comando de inicio
EXPOSE 3000
CMD ["node", "app.js"]
