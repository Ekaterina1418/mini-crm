# Mini CRM

Небольшая CRM на Nuxt 4 для ведения личной базы контактов. Пользователь может зарегистрироваться, войти в систему, создавать, редактировать и удалять только собственные контакты, а также загружать для них аватары.

## Возможности

- регистрация и вход по JWT в HTTP-only cookie;
- изоляция контактов по владельцу;
- создание, редактирование и удаление контактов;
- серверная и клиентская валидация через Zod;
- загрузка JPEG, PNG и WebP до 100 КБ;
- очистка заменённых и неиспользуемых аватаров;
- адаптивный интерфейс и доступные модальные окна.

## Стек

- Nuxt 4, Vue 3 и TypeScript;
- Pinia;
- Prisma 7 и SQLite;
- Zod;
- PrimeVue и Tailwind CSS.

## Установка

Требуется актуальная LTS-версия Node.js.

```bash
npm install
```

Создайте локальный файл окружения из примера:

```bash
cp .env.example .env
```

На Windows можно использовать:

```powershell
Copy-Item .env.example .env
```

Замените `JWT_SECRET` в `.env` на длинную случайную строку, затем примените миграции:

```bash
npx prisma migrate deploy
```

Запустите приложение:

```bash
npm run dev
```

По умолчанию оно будет доступно на `http://localhost:3000`.

## Команды

```bash
npm run dev        # режим разработки
npm run build      # production-сборка
npm run preview    # просмотр production-сборки
npm run lint       # ESLint
npm run typecheck  # проверка TypeScript
npm run test       # тесты Vitest
```

## Переменные окружения

- `DATABASE_URL` — адрес базы данных Prisma; локально используется `file:./dev.db`.
- `JWT_SECRET` — секрет подписи JWT. Не добавляйте настоящее значение в Git.

## Структура

- `pages/` — страницы приложения;
- `components/` — формы, списки и UI-компоненты;
- `stores/` — состояние Pinia и обращения к API;
- `server/api/` — серверные endpoints;
- `shared/validation/` — общие схемы Zod;
- `prisma/` — схема и миграции базы данных.

Локальная база `dev.db`, `.env` и пользовательские файлы из `public/uploads` исключены из Git.
