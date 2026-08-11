const WORKERS = [
  'https://lively-band-0eab.ejo543210.workers.dev',
  'https://spring-salad-1aa3.willjohnsonn150.workers.dev',

];

const WORKERS2 = [
  'https://blue-fog-eb04.roseunogwu63.workers.dev',

];

const WORKERS3 = [
   'https://proxy.jonahjohnzon.workers.dev',

];

export function getCurrentWorker() {
  const hour = new Date().getUTCHours();

  // 24 hours divided by number of proxies
  const hoursPerProxy = 24 / WORKERS.length;

  const index = Math.floor(hour / hoursPerProxy);

  return WORKERS[index];
}

export function getCurrentWorker2() {
  const hour = new Date().getUTCHours();

  // 24 hours divided by number of proxies
  const hoursPerProxy = 24 / WORKERS2.length;

  const index = Math.floor(hour / hoursPerProxy);

  return WORKERS2[index];
}

export function getCurrentWorker3() {
  const hour = new Date().getUTCHours();

  // 24 hours divided by number of proxies
  const hoursPerProxy = 24 / WORKERS3.length;

  const index = Math.floor(hour / hoursPerProxy);

  return WORKERS3[index];
}