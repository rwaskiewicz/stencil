import {isOutputTargetDistTypes} from '@utils';
import ts from 'typescript';

import type * as d from '../../declarations';

/**
 * Derive a {@link ts.CompilerOptions} object from the options currently set
 * on the user-supplied configuration object.
 *
 * Some of these options (like the `module` setting) are hardcoded here, but
 * the following are derived from the configuration object:
 *
 * - if one of the output targets requires type declaration output (i.e. the
 *   {@link d.OutputTargetDistCustomElements.generateTypeDeclarations} option
 *   is set to `true`) then we'll set `declaration: true`
 * - the `outDir` is set to the configured cache directory
 * - the `sourceMap` and `inlineSources` options are set based on the user's
 *   {@link d.Config.sourceMap} configuration
 *
 * @param config the current user-supplied configuration
 * @returns an object containing TypeScript compiler options
 */
export const getTsOptionsToExtend = (config: d.ValidatedConfig): ts.CompilerOptions => {
  console.log(`compilerOptions is '${JSON.stringify(config.tsCompilerOptions, null, 2)}`);
  // enum ModuleKind {
  //   None = 0,
  //   CommonJS = 1,
  //   AMD = 2,
  //   UMD = 3,
  //   System = 4,
  //   ES2015 = 5,
  //   ES2020 = 6,
  //   ES2022 = 7,
  //   ESNext = 99,
  //   Node16 = 100,
  //   NodeNext = 199,
  //   Preserve = 200,
  // }
  console.log(`Detected Module '${(config.tsCompilerOptions as ts.CompilerOptions)?.module}'`);
  // enum ModuleResolutionKind {
  //   Classic = 1,
  //   /**
  //    * @deprecated
  //    * `NodeJs` was renamed to `Node10` to better reflect the version of Node that it targets.
  //    * Use the new name or consider switching to a modern module resolution target.
  //    */
  //   NodeJs = 2,
  //   Node10 = 2,
  //   Node16 = 3,
  //   NodeNext = 99,
  //   Bundler = 100,
  // }
  console.log(`Detected Module Resolution '${(config.tsCompilerOptions as ts.CompilerOptions)?.moduleResolution}'`);
  const tsOptions: ts.CompilerOptions = {
    experimentalDecorators: true,
    // if the `DIST_TYPES` output target is present then we'd like to emit
    // declaration files
    // moduleDetection: ts.ModuleDetectionKind.Force,
    jsx: ts.JsxEmit.ReactJSX,
    declaration: config.outputTargets.some(isOutputTargetDistTypes),
    module: (config.tsCompilerOptions as ts.CompilerOptions)?.module ?? ts.ModuleKind.Node16,
    moduleResolution:
      (config.tsCompilerOptions as ts.CompilerOptions)?.moduleResolution ?? ts.ModuleResolutionKind.Node16,
    noEmitOnError: false,
    outDir: config.cacheDir || config.sys.tmpDirSync(),
    sourceMap: config.sourceMap,
    inlineSources: config.sourceMap,
  };
  console.log(`Final opts: ${JSON.stringify(tsOptions, null, 2)}`);
  return tsOptions;
};
