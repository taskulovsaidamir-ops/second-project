# 💰 Salary — Personal Finance & Expense Tracker

Современное веб-приложение для персонального учёта финансов (доходов и расходов) с поддержкой категорий, аналитики и стильным интерфейсом в стиле **Glassmorphism**.

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5-blue?logo=typescript)
![Turso](https://img.shields.io/badge/Database-Turso%20(libSQL)-00EB8A?logo=sqlite)
![Tailwind CSS](https://img.shields.io/badge/Styling-Tailwind%20CSS-38BDF8?logo=tailwindcss)

---

## ✨ Возможности

- 🔐 **Аутентификация и изоляция данных:** Защищённая регистрация и вход по Email/паролю, HTTP-only JWT сессии (`jose`), изоляция данных каждого пользователя.
- 🎨 **Glassmorphism UI:** Эффект полупрозрачного стекла, мягкое размытие заднего плана (`backdrop-blur`), глубокие тени и изумрудные акценты.
- 🌓 **Поддержка тем:** Светлая, тёмная и системная тема с быстрым переключением (`next-themes`).
- 🏷️ **Категории доходов и расходов:** Настройка категорий с выбором иконок Lucide и палитры цветов. Автоматическое создание базовых категорий новому пользователю.
- 💳 **Учёт операций:** Добавление доходов и расходов, выбор способа оплаты (Карта, Наличные, Перевод), даты и заметок.
- 🔍 **Фильтрация и поиск:** Поиск по описанию и категориям, фильтрация по периодам (текущий месяц, 7 дней, все время) и типу операции.
- 📊 **Дашборд и Аналитика:**
  - Компактный Hero-виджет баланса в `$ USD`.
  - Интерактивная круговая диаграмма распределения расходов (**Donut Chart** на Recharts).
  - Столбчатый график динамики доходов и расходов по месяцам (**Cashflow Chart**).
- 📥 **Экспорт в CSV:** Выгрузка всей истории транзакций в один клик с поддержкой UTF-8 BOM для Microsoft Excel.
- 📱 **Mobile-First UX:** Адаптивный нижний Bottom Bar со светящейся кнопкой быстрого добавления `+` для смартфонов и удобный Navbar на ПК.

---

## 🛠 Технологический стек

- **Фреймворк:** [Next.js](https://nextjs.org/) (App Router, Server Actions)
- **Язык:** TypeScript
- **База данных:** [Turso](https://turso.tech/) (распределённый бессерверный libSQL / SQLite)
- **ORM:** [Drizzle ORM](https://orm.drizzle.team/)
- **Стилизация:** Tailwind CSS + кастомные Glassmorphism токены
- **Иконки:** [Lucide React](https://lucide.dev/)
- **Графика:** [Recharts](https://recharts.org/)
- **Валидация:** Zod

---

## 🚀 Быстрый старт

### 1. Клонирование репозитория
```bash
git clone https://github.com/taskulovsaidamir-ops/second-project.git
cd second-project
```

### 2. Установка зависимостей
```bash
npm install
```

### 3. Настройка переменных окружения
Создайте файл `.env` на основе `.env.example`:
```env
# Для локальной базы данных SQLite:
TURSO_DATABASE_URL="file:salary.db"
TURSO_AUTH_TOKEN=""

# Или для облачной базы Turso Cloud:
# TURSO_DATABASE_URL="libsql://your-db-name.turso.io"
# TURSO_AUTH_TOKEN="your-turso-token"

AUTH_SECRET="your-super-secure-jwt-secret-key"
```

### 4. Инициализация таблиц базы данных
```bash
node scripts/init-db.js
```

### 5. Запуск в режиме разработки
```bash
npm run dev
```
Откройте [http://localhost:3000](http://localhost:3000) в вашем браузере.

---

## 📁 Структура проекта

```text
├── agent ai/              # Спецификации PRD.md и Design.md
├── scripts/               # Скрипты инициализации БД и тестов
├── src/
│   ├── actions/           # Next.js Server Actions (auth, categories, transactions)
│   ├── app/               # Маршруты App Router (Дашборд, Транзакции, Категории, Аналитика, Вход, Регистрация)
│   ├── components/        # UI-компоненты (Navbar, BottomNav, Modals, Charts, ThemeToggle)
│   ├── db/                # Схема Drizzle и подключение к Turso
│   ├── lib/               # Хелперы, JWT-авторизация, иконки, утилиты
│   └── middleware.ts      # Защита приватных страниц
├── tasks.md               # Детальный план реализации по этапам
└── tailwind.config.js     # Настройки дизайн-системы и Glassmorphism
```

---

## 📄 Лицензия
MIT
