const pl = require("physics-lab-web-api");
const sendPostRequest = require("./gpt4o");
const { query } = require("./sql/query");
const { insert } = require("./sql/insert");

let skip = [
  "654f5c0e3b13265ec0218d71",
  "655086273b13265ec021ef3e",
  "64a606f0a503c5a7fdb0a96f",
  "63508fd18d1aeae390879de8",
  "60305bd8fb2ab500014cabba",
  "62ab1f9708920800019930c9",
  "6277334d20a8b400015a1d9c",
  "6252b0f8fa4ee80001c6bd22",
  "23102b8bccdfe7177d265570",
  "61c482bf0a9ec000018fd344",
  "619779475885db0001702d60",
  "6123ca5fcb286c0001747bd0",
  "6123db3acb286c0001747c4b",
  "616191d4753eb80001f7078b",
  "6164138f753eb80001f74565",
  "6107d2a1f474dd0001ca9514",
  "5fc36d166519620001c6354a",
  "5fdd7e9181431100014fd39c",
  "5fa9e1816c0cae00016709f3",
  "5f8c32716c0cae0001645bf9",
  "5f7994b99f2f280001047679",
  "5f6690ca7cb6f90001ee8fa7",
  "5f47a43dcb24620001e2798d",
  "5f40ff4d80406900013d4114",
  "5f2fd4857260820001e23378",
  "5f1c1d7c91c02a00011ff1b8",
  "5f23922691c02a000120d01f",
  "5ee624ec99d146000127a344",
  "5e509f821b763904dfd7314a",
  "5ec6a63a0f24c80001b545ab",
  "5eb6b9edea878c0001f68408",
  "5e86e9b4e049d4000194c01b",
];

pl.setConfig({
  timeout: 10000,
  consolelog: true,
  consoleResponse: false,
  consoleError: false,
  checkHttpsAgent: false,
});

const user = new pl.User();

async function main() {
  await user.auth.login();
  const list = await user.projects.query("Discussion", {
    tags: ["精选"],
    take: -100,
    // From:nu,
    Skip: 1090,
  });
  for (const i of list.Data.$values) {
    if (list.Data.$values.length == 0) process.exit(0);

    let summary = await user.projects.getSummary(i.ID, "Discussion");
    const data = await query({ id: i.ID });
    if (skip.includes(i.ID)) continue;
    if (data.length != 0) {
      console.log("已存在：", i.Subject);
      continue;
    }
    const q = summary.Data.Description.join("");
    await new Promise((resolve) => setTimeout(resolve, 4000));
    sendPostRequest(q).then((res) => {
      // console.log(res)
     
      try {
            let cleanedRes = res.replace(/```json\s*|\s*```/g, "");
    let re = JSON.parse(cleanedRes);
        insert({
          id: i.ID,
          name: i.Subject,
          contentLength: q.length,
          userID: summary.Data.User.ID,
          userName: summary.Data.User.Nickname,
          editorID: summary.Data.Editor.ID,
          editorName: summary.Data.Editor.Nickname,
          year: new Date(summary.Data.CreationDate).getFullYear(),
          summary: re.summary,
          primaryDiscipline: JSON.stringify(re.Subject1),
          secondaryDiscipline: JSON.stringify(re.Subject2),
          keyWords: JSON.stringify(re.keywords),
          readability: Number(re.readability),
        });
      } catch (e) {
        console.log(`失效:`,i.ID,res);
      }
    });
  }
}
main();
