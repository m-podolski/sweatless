import Impex from "../components/Impex";
import SettingsBlock from "../components/SettingsBlock";

function Settings({ fields, settings, setSettings }) {
  return (
    <main aria-live="polite" id="main" className="main">
      <h1 className="sr-only">Settings</h1>
      {Object.keys(settings).map((block) =>
        block !== "key" ? (
          <SettingsBlock
            key={block}
            block={block}
            settings={settings}
            setSettings={setSettings}
          />
        ) : null,
      )}
      <Impex fields={fields} />
    </main>
  );
}

export default Settings;
