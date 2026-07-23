const bcrypt = require("bcrypt");

const password = "yfadvisors@2026"; // Change this

bcrypt.hash(password, 12).then((hash) => {
  console.log(hash);
});