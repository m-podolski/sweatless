const authenticationErrorTypes = {
  USER: "Wrong email or password",
  INVALID: "Invalid refresh token",
  EXPIRED: "Refresh token expired",
};

export class AuthenticationError extends Error {
  constructor(type = null, value = null) {
    super();
    this.type = type;
    this.name = this.constructor.name;
    this.status = 401;
    this.message = authenticationErrorTypes[type] || null;
    this.value = value;
  }
}

const uploadErrorTypes = { MIMETYPE: "Mimetype is not allowed" };

export class UploadError extends Error {
  constructor(type = null, field = null, value = null) {
    super();
    this.type = type;
    this.name = this.constructor.name;
    this.status = 413;
    this.message = uploadErrorTypes[type] || null;
    this.field = field;
    this.value = value;
  }
}
