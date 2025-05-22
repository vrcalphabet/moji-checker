import './styles/style.css';
import { useRef, useState } from 'react';
import { useChromeStorageLocal } from 'use-chrome-storage';
import { MainView } from './components/MainView';
import { UsageView } from './components/UsageView';
import { checkForUpdate, getVersion } from './lib/api';
import { UpdateState } from './types/update';

import type { View } from './types/types';
export const App = () => {
  const version = getVersion();
  const [isEnabled, setIsEnabled] = useChromeStorageLocal('active', true);
  const [updateState, setUpdateState] = useState<UpdateState>(UpdateState.NONE);
  const [currentView, setCurrentView] = useState<View>('main');

  const wrapperRef = useRef<HTMLDivElement>(null);
  const mainViewRef = useRef<HTMLDivElement>(null);
  const usageViewRef = useRef<HTMLDivElement>(null);

  const handleToggleChange = () => {
    setIsEnabled(!isEnabled);
  };

  const updateClickHandler = async () => {
    setUpdateState(UpdateState.CHECKING);
    try {
      const hasUpdate = await checkForUpdate();
      if (hasUpdate) {
        setUpdateState(UpdateState.UPDATE_AVAILABLE);
      } else {
        setUpdateState(UpdateState.UP_TO_DATE);
      }
    } catch (_) {
      setUpdateState(UpdateState.ERROR);
    }
  };

  return (
    <div className="font-noto w-80 overflow-hidden text-base">
      <div
        className="flex w-max transition-[transform,height] duration-300 ease-in-out"
        style={{
          height:
            currentView === 'main'
              ? mainViewRef.current?.scrollHeight
              : usageViewRef.current?.scrollHeight,
          transform: currentView === 'main' ? 'translateX(0)' : 'translateX(-20rem)',
        }}
        ref={wrapperRef}
      >
        <MainView
          version={version}
          isEnabled={isEnabled}
          onToggleChange={handleToggleChange}
          updateState={updateState}
          onClickUpdate={updateClickHandler}
          onClickUsage={() => setCurrentView('usage')}
          ref={mainViewRef}
        />

        <UsageView onClickBack={() => setCurrentView('main')} ref={usageViewRef} />
      </div>
    </div>
  );
};
