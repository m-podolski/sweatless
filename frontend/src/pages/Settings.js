import Impex from "../components/Impex";
import SettingsBlock from "../components/SettingsBlock";
import { useFetch } from "../hooks/useFetch";

export default function Settings({ logs, settings, setSettings }) {
  const [doFetch] = useFetch();

  // wrapping fetch and setState here to avoid passing down the whole settings
  function updateSettings(updatedBlock) {
    const key = Object.keys(settings).find(
      (key) => settings[key].label === updatedBlock.label,
    );
    const updatedSettings = { ...settings, [key]: { ...updatedBlock } };
    setSettings(updatedSettings);
    doFetch("PATCH", "settings", updatedSettings);
  }

  return (
    <main aria-live="polite" id="main">
      <h1 className="sr-only">Settings</h1>
      {Object.keys(settings).map((block) =>
        block !== "key" ? (
          <SettingsBlock
            key={block}
            block={settings[block]}
            updateSettings={updateSettings}
          />
        ) : null,
      )}
      <Impex logFields={settings.logs.fields} logs={logs} />
    </main>
  );
}
