import { assertEnv } from '../config';
import { initTable } from '../db/repository';
import { runDiscussionBot } from '../services/bot';

async function main() {
  assertEnv();
  await initTable();
  await runDiscussionBot();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
