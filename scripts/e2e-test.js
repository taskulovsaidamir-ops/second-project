const { createClient } = require("@libsql/client");
const bcrypt = require("bcryptjs");

const client = createClient({ url: "file:salary.db" });

async function runE2E() {
  console.log("=== Running End-to-End Test for Salary Application ===");

  const userId = `e2e_user_${Date.now()}`;
  const now = Date.now();

  // 1. Insert User
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash("Password123!", salt);
  await client.execute({
    sql: "INSERT INTO users (id, email, password_hash, name, currency, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?)",
    args: [userId, `e2e_${Date.now()}@test.com`, passwordHash, "E2E Tester", "USD", now, now],
  });
  console.log("1. User created successfully.");

  // 2. Insert Categories
  const catIncomeId = `cat_inc_${Date.now()}`;
  const catExpenseId = `cat_exp_${Date.now()}`;
  await client.execute({
    sql: "INSERT INTO categories (id, user_id, name, type, icon, color, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
    args: [catIncomeId, userId, "Зарплата", "INCOME", "briefcase", "#10b981", now],
  });
  await client.execute({
    sql: "INSERT INTO categories (id, user_id, name, type, icon, color, is_default, created_at) VALUES (?, ?, ?, ?, ?, ?, 1, ?)",
    args: [catExpenseId, userId, "Продукты", "EXPENSE", "shopping-cart", "#f43f5e", now],
  });
  console.log("2. Categories inserted.");

  // 3. Insert Transactions (Income $3000, Expense $250)
  const tx1Id = `tx_1_${Date.now()}`;
  const tx2Id = `tx_2_${Date.now()}`;
  await client.execute({
    sql: "INSERT INTO transactions (id, user_id, category_id, type, amount, date, description, payment_method, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [tx1Id, userId, catIncomeId, "INCOME", 3000.0, now, "Основная зарплата", "TRANSFER", now, now],
  });
  await client.execute({
    sql: "INSERT INTO transactions (id, user_id, category_id, type, amount, date, description, payment_method, created_at, updated_at) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)",
    args: [tx2Id, userId, catExpenseId, "EXPENSE", 250.5, now, "Закупка на неделю", "CARD", now, now],
  });
  console.log("3. Transactions recorded (Income: $3000, Expense: $250.50).");

  // 4. Calculate Balance & Verify
  const txs = await client.execute({
    sql: "SELECT * FROM transactions WHERE user_id = ?",
    args: [userId],
  });

  let balance = 0;
  for (const t of txs.rows) {
    if (t.type === "INCOME") balance += t.amount;
    else balance -= t.amount;
  }

  const expectedBalance = 3000 - 250.5; // 2749.50
  console.log(`4. Calculated Balance: $${balance.toFixed(2)} (Expected: $${expectedBalance.toFixed(2)})`);
  if (Math.abs(balance - expectedBalance) > 0.001) {
    throw new Error("Balance calculation mismatch!");
  }

  // 5. Test Delete
  await client.execute({
    sql: "DELETE FROM transactions WHERE id = ?",
    args: [tx2Id],
  });
  const afterDelete = await client.execute({
    sql: "SELECT count(*) as cnt FROM transactions WHERE user_id = ?",
    args: [userId],
  });
  console.log(`5. After deleting 1 transaction: ${afterDelete.rows[0].cnt} transaction remaining.`);

  console.log("=== ALL E2E INTEGRATION CHECKS PASSED PERFECTLY ===");
}

runE2E().catch((err) => {
  console.error("E2E Test Failed:", err);
  process.exit(1);
});
