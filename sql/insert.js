const db = require('./crate');

function insert(data) {
  return new Promise((resolve, reject) => {
    // 确保数据包含所有必需字段
    const document = {
      id: data.id,
      name: data.name,
      contentLength: data.contentLength,
      userID: data.userID,
      userName: data.userName,
      editorID: data.editorID,
      editorName: data.editorName,
      year: data.year,
      summary: data.summary,
      primaryDiscipline: data.primaryDiscipline,
      secondaryDiscipline: data.secondaryDiscipline,
      keyWords: data.keyWords,
      readability: data.readability
    };

    db.insert(document, (err, newDoc) => {
      if (err) {
        console.error("Error inserting data:", err.message);
        reject(err);
      } else {
        console.log(`Data inserted with ID: ${newDoc.id}`);
        resolve(newDoc.id);
      }
    });
  });
}

module.exports = {
  insert,
};
