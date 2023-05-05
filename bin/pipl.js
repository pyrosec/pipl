#!/usr/bin/env node
'use strict';

const { runCLI } = require('../lib/cli');
const { getLogger } = require('../lib/logger');

const logger = getLogger();

(async () => {
  await runCLI();
})().catch((err) => logger.error(err));
