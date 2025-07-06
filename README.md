

Blame
80 lines (60 loc) · 1.22 KB
Istalgan mahsulot va buyumlarni bir zumda istalgan joydan sota olish imkonini beradigan loyiha!

Funksional talablar:

User Register qilihi
User login qilishi
Google va Facebook orqali qulay tizimga kirish
Token orqali tizimdagi barqarorlik
Platformadagi barcha elonlrni kora olishi
Platformadagi yotqtirgan eloniga like bosishi
Yangi elon joylay olishi
O'z e'lonlarini yangilay olishi
Platforma bo'ylab qulay qidiruv tizimi
Istalgan valyutada sotish(USD, UZS, EURO, RUBL)
No funksional talablar:

Elonlar doim yangilab va kengaytirilib borilishi.
Refresh token orqali acces token vaqtini uzaytirish va tizimda barqaror ushlash.
Tezlik.
Havfsizlik.
Malumotlar:

User:
id
name
email
password
role
Announcement:
id
name
description
images
price
createdAt
location
category
Category
id
name
annoucment
Liked
id
UserId
AnnouncementID
createdAt
Last seen
id
UserId
AnnouncementID
createdAt
Client (Frontend) ni ishga tushirish

cd client pnpm install nano .env npm start

Server (Backend) ni ishga tusirish

cd server pnpm install nano .env npx prisma init npx prisma generate npx prisma migrate dev --name init npm run start:dev
