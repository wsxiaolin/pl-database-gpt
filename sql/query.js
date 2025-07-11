const db = require('./crate');

function query(params) {
  return new Promise((resolve, reject) => {
    // 构建NeDB查询条件
    const queryConditions = {};
    
    if (params.id) {
      queryConditions.id = params.id;
    }

    if (params.name) {
      // 使用正则表达式实现LIKE查询
      queryConditions.name = new RegExp(params.name, 'i');
    }

    db.find(queryConditions, (err, docs) => {
      if (err) {
        console.error('Error executing query:', err.message);
        reject(err);
      } else {
        resolve(docs);
      }
    });
  });
}

module.exports = {
  query
};
