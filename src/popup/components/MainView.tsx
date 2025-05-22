import { ExternalLink, HelpCircle, MessageSquare } from 'lucide-react';
import { forwardRef } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { updateMessages, UpdateState } from '../types/update';
import { GitHub } from './icons/GitHub';
import { UpdateButton } from './ui/UpdateButton';

interface MainViewProps {
  version: string;
  isEnabled: boolean;
  onToggleChange: () => void;
  updateState: UpdateState;
  onClickUpdate: () => void;
  onClickUsage: () => void;
}

export const MainView = forwardRef<HTMLDivElement, MainViewProps>(
  (
    { version, isEnabled, onToggleChange, updateState, onClickUpdate, onClickUsage }: MainViewProps,
    ref,
  ) => {
    return (
      <div className="w-80 p-4 h-min" ref={ref}>
        <div className="flex items-center justify-between">
          <h1 className="text-lg font-semibold">もじちぇっかー👀</h1>
          <Badge variant="outline" className="rounded-full text-xs">
            v{version}
          </Badge>
        </div>

        <Separator className="my-4" />

        <div className="flex items-center justify-between">
          <h2 className="font-medium">機能を有効にする</h2>
          <Switch checked={isEnabled} onCheckedChange={onToggleChange} className="cursor-pointer" />
        </div>

        <Separator className="my-4" />

        <div>
          <h2 className="mb-2 font-medium">更新</h2>

          <p className={updateMessages[updateState].className}>
            {updateMessages[updateState].text}
          </p>

          <UpdateButton updateState={updateState} onClick={onClickUpdate} />
        </div>

        <Separator className="my-4" />

        <Button
          variant="ghost"
          className="text-muted-foreground h-10 w-full cursor-pointer"
          onClick={onClickUsage}
        >
          <HelpCircle className="h-4 w-4" />
          <span>使い方</span>&gt;
        </Button>

        <Separator className="my-4" />

        <div className="flex cursor-pointer items-center justify-center">
          <Button variant="ghost" size="sm" asChild>
            <a href="https://forms.gle/PUpbxrhL3eb5YeGk9" target="_blank" className="flex items-center gap-1">
              <MessageSquare className="h-4 w-4" />
              お問い合わせ
            </a>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <a href="https://booth.pm/ja/items/6794919" target="_blank" className="flex items-center gap-1">
              <ExternalLink className="h-4 w-4" />
              Booth
            </a>
          </Button>

          <Button variant="ghost" size="sm" asChild>
            <a href="https://github.com/vrcalphabet/moji-checker" target="_blank" className="flex items-center gap-1">
              <GitHub className="h-4 w-4" />
              GitHub
            </a>
          </Button>
        </div>
      </div>
    );
  },
);
