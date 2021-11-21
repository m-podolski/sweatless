import ButtonToggle from "../components/ButtonToggle";
import "../sass/components/_SettingsBlock.scss";

export default function SettingsBlock({ block, updateSettings }) {
  function findSettingsField(label) {
    return Object.keys(block).find((option) => block[option].label === label);
  }

  function handleShowHide(fieldLabel) {
    const field = findSettingsField(fieldLabel);
    updateSettings({
      ...block,
      [field]: { ...block[field], show: block[field].show === false },
    });
  }

  return (
    <section className="SettingsBlock">
      <div className="wrapper">
        <h2 className="ui-heading">{block.label}</h2>
      </div>
      <div className="button-container">
        {Object.keys(block).map((key) =>
          block[key].hasOwnProperty("show") ? (
            <ButtonToggle
              key={key}
              label={block[key].label}
              labelToggle={["Hide", "Show"]}
              toggleable={block[key].show}
              handleToggle={handleShowHide}
            />
          ) : null,
        )}
      </div>
    </section>
  );
}
