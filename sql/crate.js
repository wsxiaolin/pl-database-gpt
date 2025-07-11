const Datastore = require('nedb');
const path = require('path');
const fs = require('fs');

// 处理损坏的数据文件
const dbPath = path.join(__dirname, '../data.db');
if (fs.existsSync(dbPath)) {
  try {
    // 尝试读取文件检查是否损坏
    fs.readFileSync(dbPath, 'utf8');
  } catch (err) {
    console.log('检测到数据文件损坏，创建新的数据库文件...');
    fs.unlinkSync(dbPath);
  }
}

// 初始化NeDB数据库
const db = new Datastore({
  filename: dbPath,
  autoload: true,
  timestampData: true,
  onload: (err) => {
    if (err) {
      console.error('数据库加载失败:', err.message);
      process.exit(1);
    }
  }
});

// 创建索引确保id唯一性
db.ensureIndex({ fieldName: 'id', unique: true }, function (err) {
  if (err) {
    console.error('创建id索引出错:', err.message);
  } else {
    console.log('id索引创建成功');
  }
});

// 创建其他字段索引
db.ensureIndex({ fieldName: 'name' });
db.ensureIndex({ fieldName: 'contentLength' });
db.ensureIndex({ fieldName: 'userID' });
db.ensureIndex({ fieldName: 'userName' });
db.ensureIndex({ fieldName: 'editorID' });
db.ensureIndex({ fieldName: 'editorName' });
db.ensureIndex({ fieldName: 'year' });
db.ensureIndex({ fieldName: 'summary' });
db.ensureIndex({ fieldName: 'primaryDiscipline' });
db.ensureIndex({ fieldName: 'secondaryDiscipline' });
db.ensureIndex({ fieldName: 'keyWords' });
db.ensureIndex({ fieldName: 'readability' });

console.log('数据库初始化完成，保留原有数据结构：');
console.log([
  'id (TEXT, PRIMARY KEY)',
  'name (TEXT)',
  'contentLength (INTEGER)',
  'userID (TEXT)',
  'userName (TEXT)',
  'editorID (TEXT)',
  'editorName (TEXT)',
  'year (INTEGER)',
  'summary (TEXT)',
  'primaryDiscipline (TEXT)',
  'secondaryDiscipline (TEXT)',
  'keyWords (TEXT)',
  'readability (REAL)'
].join('\n'));

module.exports = db;
