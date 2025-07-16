# INSTALACION
- Clonar

git clone https://github.com/DiegoRdrz/lufer
cd lufer

- CREAR ENV EN EL BACKEND

JWT_SECRET=supersecreto123 #CAMBIAR POR CUALQUIER COSA
PORT=4000


- OTRO EN EL FRONT

VITE_API_URL=http://localhost:4000

- Entrar al back e instalar

cd back/
npm install

npx prisma init

npx prisma migrate dev --name init
npx prisma generate

- Meter los datos a al base de datos

npx tsx scripts/seed.ts

- Correr el back

npm run dev




- Entrar al front desde otra consola

cd front/

- Instalar 

npm install

- Correr

npm run dev


