function ButtonToggle({ label, labelToggle, toggleable, handleToggle }) {
  return (
    <button
      type="button"
      className={toggleable ? "button-primary" : "button-primary-down"}
      onClick={() => handleToggle(label)}
    >
      {`${toggleable ? labelToggle[0] : labelToggle[1]} ${label}`}
    </button>
  );
}

export default ButtonToggle;
