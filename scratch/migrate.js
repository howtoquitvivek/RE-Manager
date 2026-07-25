const Database = require('better-sqlite3');
const db = new Database('sqlite.db');

try {
  console.log('Adding workspace_type column...');
  db.prepare("ALTER TABLE organizations ADD COLUMN workspace_type TEXT DEFAULT 'personal' NOT NULL").run();
  console.log('Adding subscription_plan column...');
  db.prepare("ALTER TABLE organizations ADD COLUMN subscription_plan TEXT DEFAULT 'starter' NOT NULL").run();
  console.log('Success!');
} catch (err) {
  console.error('Error:', err.message);
} finally {
  db.close();
}
