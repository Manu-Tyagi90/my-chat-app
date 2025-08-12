// src/components/Settings.tsx
import SettingsDialog from './settings/SettingsDialog';
import type { UserSettings } from '../hooks/useSettings';

type Props = Readonly<{
  open: boolean;
  onClose: () => void;
  onSettingsChange?: (settings: UserSettings) => void;
}>;

export default function Settings(props: Props) {
  return <SettingsDialog {...props} />;
}