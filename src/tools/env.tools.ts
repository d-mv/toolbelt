import { hasPath, path } from 'ramda';

type EnvReturn = { value: string | undefined; expect: (message?: string) => string };

/**
 * Helper function to extract environment variables from 'process.env'
 * @param key
 * @returns string
 * @example
 * env('SERVER_URL').value // undefined or 'http://....'
 * env('SERVER_URL').expect('SERVER_URL is missing') // throws error, if missing or
 * returns 'http://....'
 */
export function env(key: string): EnvReturn {
  function expect(message?: string) {
    // if no key
    if (!hasPath([key], process.env)) throw new Error(message ?? `Missing env key ${key}`);

    const value = String(path([key], process.env));

    if (!value.trim()) throw new Error(message ?? `Required env key ${key} is empty`);

    return value.trim();
  }

  return { expect, value: path([key], process.env) };
}

/**
 * Helper function to get required environment variable for non-test environment
 * @param {String} key environment variable name
 * @returns {String} or throws error if variable is missing
 */
export function getRequiredEnvVar(key: string): string {
  const isTest = env('NODE_ENV').expect() === 'test';

  return isTest ? '' : env(key).expect();
}

export interface InitialConfig {
  nodeEnv: string;
  isTest: boolean;
  isProduction: boolean;
  isDev: boolean;
  port: number;
  version: string;
}

export interface EnvOptions {
  noVersion: boolean;
}

/**
 * Helper function get all NODE_ENV variables
 *
 * @returns {Object}
 */
export function buildConfig(options?: Partial<EnvOptions>): InitialConfig {
  const nodeEnv = env('NODE_ENV').expect();

  let port = 8000;

  const envPort = env('PORT');

  if (envPort.value) {
    const parsedPort = parseInt(envPort.value);

    port = Number.isNaN(parsedPort) ? 8000 : parsedPort;
  }

  const config = {
    nodeEnv,
    port,
    isDev: nodeEnv === 'development',
    isProduction: nodeEnv === 'production',
    isTest: nodeEnv === 'test',
    version: '',
  };

  if (!options?.noVersion) config.version = env('npm_package_version').expect();

  return config;
}
