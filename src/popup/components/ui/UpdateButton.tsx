import { Check, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { UpdateState } from '@/popup/types/update';

export interface UpdateButtonProps {
  updateState: UpdateState;
  onClick: () => void;
}

export const UpdateButton = ({ updateState, onClick }: UpdateButtonProps) => {
  const updateAvailable = updateState === UpdateState.UPDATE_AVAILABLE;
  const checking = updateState === UpdateState.CHECKING;

  return (
    <Button
      variant={updateAvailable ? 'default' : 'outline'}
      className="h-10 w-full cursor-pointer"
      disabled={checking}
      onClick={onClick}
      asChild={updateAvailable}
    >
      {updateAvailable ? (
        <a href="https://booth.pm/ja/items/6794919" target="_blank">
          <RefreshCw className="mr-2 h-4 w-4" />
          更新する
        </a>
      ) : checking ? (
        <>
          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
          確認中...
        </>
      ) : (
        <>
          <Check className="mr-2 h-4 w-4" />
          更新を確認
        </>
      )}
    </Button>
  );
};
