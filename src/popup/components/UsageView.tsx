import { ArrowLeft } from 'lucide-react';
import { forwardRef } from 'react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';

interface UsageViewProps {
  onClickBack: () => void;
}

export const UsageView = forwardRef<HTMLDivElement, UsageViewProps>(
  ({ onClickBack }: UsageViewProps, ref) => {
    return (
      <div className="w-80 p-4 h-min" ref={ref}>
        <div className="flex items-center justify-start gap-2">
          <Button variant="ghost" size="icon" className="cursor-pointer" onClick={onClickBack}>
            <ArrowLeft className="h-4 w-4" />
          </Button>
          <h1 className="text-lg font-semibold">使い方</h1>
        </div>

        <Separator className="my-4" />

        <div className="mb-5 space-y-2 text-sm">
          <h2 className="font-medium">各装飾の意味</h2>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-slate-700"></div>
            <p>
              <span className="font-medium">通常の文字</span>
              &nbsp;- 保持される文字
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-yellow-400"></div>
            <p>
              <span className="rounded bg-yellow-100 px-1 font-medium">黄色背景の文字</span>
              &nbsp;- 変更される文字
            </p>
          </div>

          <div className="flex items-center gap-2">
            <div className="h-3 w-3 flex-shrink-0 rounded-full bg-red-500"></div>
            <p>
              <span className="rounded bg-red-100 px-1 font-medium text-red-800">
                赤色背景の文字
              </span>
              &nbsp;- 削除される文字
            </p>
          </div>
        </div>

        <div className="mb-5 space-y-2 text-sm">
          <h2 className="font-medium">機能の有効/無効</h2>

          <p className="text-muted-foreground">
            スイッチを切り替えると、拡張機能の機能を有効または無効にできます。変更を適用するには、ページの再読み込みが必要です。
          </p>
        </div>

        <div className="mb-5 space-y-2 text-sm">
          <h2 className="font-medium">更新の確認</h2>

          <p className="text-muted-foreground">
            「更新を確認」ボタンをクリックすると、拡張機能の新しいバージョンがあるかどうかを確認できます。更新可能な場合は「更新する」ボタンが表示されます。
          </p>
        </div>
      </div>
    );
  },
);
