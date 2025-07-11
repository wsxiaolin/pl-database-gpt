const axios = require("axios");
const fs = require("fs");
const tishi = `
你正在执行结构化信息提取任务。必须且只能输出无格式纯文本的JSON对象，确保JSON.parse可直接解析。绝对禁止任何非JSON内容，包括：1)自然语言说明 2)代码块标记 3)特殊符号。完整字段要求：
{
  "summary": "约100字中文摘要，需完整覆盖核心论点与关键数据",
  "Subject1": ["必选1-2项", "从给定12个一级学科中选择", "历史相关必须标注'历史学'"],
  "Subject2": ["必选1-3项", "严格对应GB/T 13745-2009二级学科名称"],
  "keywords": ["5-10个关键词", "包含学术术语与大众检索词"],
  "readability": "0.00-1.00浮点数，需按[科普=0.3, 学报=0.6, 顶会=0.9]梯度赋值"
}
格式死亡红线：①缺失字段立即报错 ②数值未加引号视为格式错误 ③数组元素必须双引号包裹。示范正确格式：
{"summary":"...","Subject1":["工学"],"Subject2":["机械设计及理论"],"keywords":["流体力学"],"readability":0.72}
现在处理该文章

`;

module.exports = async function sendPostRequest(text) {
  const url = "https://spark-api-open.xf-yun.com/v2/chat/completions";
  const data = {
    model: "x1",
    messages: [
      {
        role: "system",
        content:
          tishi,
      },
      {
        role: "user",
        content: "|||" + text + "|||",
      },
    ],
    max_tokens: 500,
  };

  const headers = {
    Authorization: `Bearer RGaKKFOztiUPoGEkeSPP:sfbjYJktAbAYQVhqoUjp`,
  };

  try {
    const response = await axios.post(url, data, { headers });
          // console.log(response.data)
    if (!response.data.choices[0].message.content) {

      throw new Error();
    }
    return response.data.choices[0].message.content;
  } catch (error) {
    console.log(111)
  }
}
