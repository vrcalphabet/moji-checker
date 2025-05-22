export const enum UpdateState {
  NONE,
  CHECKING,
  UPDATE_AVAILABLE,
  UP_TO_DATE,
  ERROR,
}

export const updateMessages = {
  [UpdateState.NONE]: {
    text: '',
    className: 'text-sm mb-1',
  },
  [UpdateState.CHECKING]: {
    text: '更新を確認中...',
    className: 'text-sm mb-2 text-muted-foreground',
  },
  [UpdateState.UPDATE_AVAILABLE]: {
    text: '新しいバージョンが利用可能です！',
    className: 'text-sm mb-2 text-green-500',
  },
  [UpdateState.UP_TO_DATE]: {
    text: '更新の必要はありません',
    className: 'text-sm mb-2 text-muted-foreground',
  },
  [UpdateState.ERROR]: {
    text: '更新の確認に失敗しました',
    className: 'text-sm mb-2 text-red-600',
  },
};
