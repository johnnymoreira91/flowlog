import { defineConfig } from 'tsup';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  target: 'es2022',
  outDir: 'dist',
  clean: true,
  dts: true,
  splitting: false,
  sourcemap: true,
  minify: false,
  external: ['winston-loki', 'sequelize'],
  shims: true,
});