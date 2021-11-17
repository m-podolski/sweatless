import db from "../database";
import ButtonToggle from "../components/ButtonToggle";
import "../sass/components/_SettingsBlock.scss";

function SettingsBlock({ block, settings, setSettings }) {
  function findSettingsField(label) {
    return Object.keys(settings[block]).find((option) => {
      return settings[block][option].label === label;
    });
  }

  function handleShowHide(fieldLabel) {
    const fieldKey = findSettingsField(fieldLabel);
    const settingsBlock = { ...settings[block] };
    settingsBlock[fieldKey].show = settingsBlock[fieldKey].show === false;
    const updatedSettings = { ...settings, [block]: settingsBlock };
    setSettings(updatedSettings);

    (async function updateSettings(settings) {
      await db.settings.put(settings);
    })(updatedSettings);
  }

  return (
    <section className="SettingsBlock">
      <div className="wrapper">
        <h2 className="ui-heading">{settings[block].label}</h2>
      </div>
      <div className="button-container">
        {Object.keys(settings[block]).map((key) =>
          settings[block][key].hasOwnProperty("show") ? (
            <ButtonToggle
              key={key}
              label={settings[block][key].label}
              labelToggle={["Hide", "Show"]}
              toggleable={settings[block][key].show}
              handleToggle={handleShowHide}
            />
          ) : null,
        )}
      </div>
    </section>
  );
}

export default SettingsBlock;
