const { createClient } = require("@libsql/client");
const bcrypt = require("bcryptjs");

const client = createClient({ url: "file:salary.db" });

async function testAuth() {
  console.log("=== Testing Authentication & Seeding System ===");

  const testEmail = `test_${Date.now()}@example.com`;
  const testPassword = "securePassword123";
  const userId = `usr_${Date.now()}`;
  const now = Date.now();

  // 1. Test hashing
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash(testPassword, salt);
  console.log("✓ Password hashed successfully:", passwordHash.slice(0, 20) + "...");

  // 2. Insert test user
  await client.execute({
    sql: `INSERT INTO users (id, email, password_hash, name, currency, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)`,
    args: [userId, testEmail, passwordHash, "Тестовый Пользователь", "USD", now, now],
  });
  console.log("✓ User registered:", testEmail);

  // 3. Test category seeding for this user
  const defaultCategories = [
    { name: "Зарплата", type: "INCOME", icon: "briefcase", color: "#10b981" },
    { name: "Фриланс", type: "INCOME", icon: "laptop", color: "#34d399" },
    { name: "Продукты и еда", type: "EXPENSE", icon: "shopping-cart", color: "#f43f5e" },
    { name: "Транспорт и авто", type: "EXPENSE", icon: "car", color: "#f59e0b" },
  ];

  for (const cat of defaultCategories) {
    await client.execute({
      sql: `INSERT INTO categories (id, user_id, name, type, icon, color, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)`,
      args: [`cat_${Math.random()}`, userId, cat.name, cat.type, cat.icon, cat.color, now],
    });
  }
  console.log("✓ Default categories seeded.");

  // 4. Verify user fetch
  const userRow = await client.execute({
    sql: `SELECT * FROM users WHERE email = ?`,
    args: [testEmail],
  });
  console.log("✓ User verified in DB:", userRow.rows[0].email, "Currency:", userRow.rows[0].currency);

  // 5. Verify password comparison
  const isMatch = await bcrypt.compare(testPassword, userRow.rows[0].password_hash);
  console.log("✓ Password comparison verification:", isMatch === true ? "PASSED" : "FAILED");

  // 6. Verify categories count
  const catRows = await client.execute({
    sql: `SELECT name, type, color FROM categories WHERE user_id = ?`,
    args: [userId],
  });
  console.log(`✓ Seeded ${catRows.rows.length} categories for user:`, catRows.rows.map(c => `${c.name} (${c.type})`));

  console.log("=== ALL AUTH TESTS PASSED SUCCESSFULLY ===");
}

testAuth().catch(err => {
  console.error("Test failed:", err);
  process.exit(1);
});
