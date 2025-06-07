import { stat } from 'node:fs/promises';
import { join, dirname, isAbsolute } from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';

export async function resolve(specifier, context, nextResolve) {
  if (
    !specifier.startsWith('file:') &&
    !specifier.startsWith('./') &&
    !specifier.startsWith('../') &&
    !specifier.startsWith('/')
  ) {
    return nextResolve(specifier, context);
  }

  let baseDir = process.cwd();
  if (context.parentURL?.startsWith('file:')) {
    baseDir = dirname(fileURLToPath(context.parentURL));
  }

  let resolved;

  try {
    let tsFile;
    if (specifier.startsWith('file:')) {
      tsFile = fileURLToPath(specifier);
    } else if (isAbsolute(specifier)) {
      tsFile = specifier;
    } else {
      tsFile = join(baseDir, specifier);
    }
    if (!tsFile.endsWith('.ts')) {
      tsFile += '.ts';
    }
    await stat(tsFile);
    resolved = tsFile;
  } catch {
    try {
      let dir;
      if (specifier.startsWith('file:')) {
        dir = fileURLToPath(specifier);
      } else if (isAbsolute(specifier)) {
        dir = specifier;
      } else {
        dir = join(baseDir, specifier);
      }
      const indexTs = join(dir, 'index.ts');
      await stat(indexTs);
      resolved = indexTs;
    } catch {
      return nextResolve(specifier, context);
    }
  }

  return {
    url: pathToFileURL(resolved).href,
    shortCircuit: true,
  };
}
