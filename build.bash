#!/usr/bin/env bash
set -exu

npm install
npm run ng -- lint
npm run ng -- test --single-run --no-progress --code-coverage --browsers ChromeHeadlessNoSandbox
npm run compodoc
npm run ng -- build --prod --aot --no-progress





