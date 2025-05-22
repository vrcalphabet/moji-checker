/**
 * マニフェストのバージョンを取得する
 */
export const getVersion = (): string => {
  return chrome.runtime.getManifest().version;
};

/**
 * 更新を確認する
 * @returns true: 更新がある, false: 更新がない
 */
export const checkForUpdate = async (): Promise<boolean> => {
  const MANIFEST_URL =
    'https://raw.githubusercontent.com/vrcalphabet/moji-checker/refs/heads/main/manifest.json';
  const res = await fetch(MANIFEST_URL, { cache: 'no-cache' });
  if (!res.ok) {
    throw new Error();
  }

  const manifest = await res.json();
  const latestVersion = manifest.version;
  const currentVersion = getVersion();

  return isNewerVersion(currentVersion, latestVersion);
};

/**
 * バージョンを比較する
 * @param currentVersion 現在のバージョン
 * @param latestVersion 最新のバージョン
 * @returns true: 更新がある, false: 更新がない
 */
function isNewerVersion(currentVersion: string, latestVersion: string) {
  const l = currentVersion.split('.').map(Number);
  const r = latestVersion.split('.').map(Number);

  for (let i = 0; i < 3; i++) {
    if (l[i] < r[i]) return true;
    if (l[i] > r[i]) return false;
  }

  return false;
}
