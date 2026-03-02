import { assertEnv, config } from '../config';
import { initTable } from '../db/repository';
import { collectByTag } from '../services/collector';

async function main() {
  assertEnv();
  await initTable();
  const result = await collectByTag(config.discussionTag);
  console.log('[update-db]', result);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
