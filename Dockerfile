FROM node:24.16.0

WORKDIR /app

COPY package*.json ./

RUN npm ci

COPY . .

EXPOSE 4200
#--poll Agregado para solucionar inestabilidad con la inicializacion del contenedor 
# y la funcionalidad de ver los cambios en tiempo real.
CMD ["npm", "start", "--", "--host", "0.0.0.0", "--poll", "2000"]