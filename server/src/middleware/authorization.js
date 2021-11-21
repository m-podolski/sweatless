export function permit(...permittedRoles) {
  return (req, res, next) => {
    const { user } = req;

    if (
      (user && permittedRoles.includes(user.role)) ||
      permittedRoles[0] === true
    ) {
      next();
    } else {
      res.status(403).json({ message: "Forbidden" });
    }
  };
}
