const { copyFileSync, mkdirSync } = require('fs');
const { join } = require('path');

const root = join(__dirname, '..');
mkdirSync(join(root, 'dist'), { recursive: true });
copyFileSync(join(root, 'src', 'swagger.yaml'), join(root, 'dist', 'swagger.yaml'));
