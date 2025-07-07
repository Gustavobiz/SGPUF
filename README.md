# SGPUF – Sistema de Gerenciamento de Projetos de Usinas Fotovoltaicas

O SGPUF é um sistema web para gerenciar projetos de instalação de usinas fotovoltaicas.

---

## Tecnologias utilizadas

### Backend

- Node.js
- Express.js
- MySQL
- JWT (autenticação)
- Bcrypt (hash de senhas)
- dotenv
- mysql2

### Frontend

- React.js (com Vite)
- Axios
- React Router DOM

### Banco de dados

- MySQL 8
- Modelado no MySQL Workbench
- Script: database/schema.sql

---

## Configurar o backend

cd server  
npm install

Crie um arquivo `.env` com em server:

DB_HOST=localhost  
DB_USER=root  
DB_PASS=sua_senha //coloca a sua senha aqui
DB_NAME=sgpuf_db  
PORT=3001
JWT_SECRET=sua_senha //coloca uma senha aqui

Inicie o servidor:

node index.js

---

## Configurar o frontend

cd client  
npm install  
npm run dev

Acesse: http://localhost:5173

---

## Banco de dados

Banco: sgpuf_db  
Script: database/schema.sql  
Estrutura: Gerada via MySQL Workbench

Para criar o banco:

mysql -u root -p -e "CREATE DATABASE sgpuf_db;"  
mysql -u root -p sgpuf_db < database/schema.sql

## Autores

<a href="https://github.com/Gustavobiz">Gustavo Sousa Bernardes</a><br>
<a href="https://github.com/ElonArkel">Arkell Freire Bezerra</a><br>
