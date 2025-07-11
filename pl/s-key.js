const db = require('../sql/crate');

async function search(keys, limit = 20) {
  if (!Array.isArray(keys)) {
    keys = [keys];
  }

  // 构建NeDB查询条件
  const queryConditions = {
    $or: keys.flatMap(key => [
      { primaryDiscipline: { $regex: new RegExp(key, 'i') } },
      { secondaryDiscipline: { $regex: new RegExp(key, 'i') } },
      { keyWords: { $regex: new RegExp(key, 'i') } }
    ])
  };

  return new Promise((resolve, reject) => {
    db.find(queryConditions).exec((err, docs) => {
      if (err) {
        console.error("Error fetching records:", err.message);
        reject(err);
      } else {
        // 实现随机排序
        const shuffled = docs
          .map(value => ({ value, sort: Math.random() }))
          .sort((a, b) => a.sort - b.sort)
          .map(({ value }) => value)
          .slice(0, limit);
        
        resolve(shuffled);
      }
    });
  });
}

module.exports = search;
