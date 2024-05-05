const authenticationRepository = require('./authentication-repository');
const { generateToken } = require('../../../utils/session-token');
const { passwordMatched } = require('../../../utils/password');

// Membuat penyimpanan data percobaan login yang dilakukan oleh user.
const loginAttempts = {};

/**
 * Check username and password for login.
 * @param {string} email - Email
 * @param {string} password - Password
 * @returns {object} An object containing, among others, the JWT token if the email and password are matched. Otherwise returns null.
 */
async function checkLoginCredentials(email, password) {
  const user = await authenticationRepository.getUserByEmail(email);

  // Mendapatkan informasi tentang waktu saat ini.
  const currentTime = new Date();

  //Soal 2 : Login attempts limit
  // Melakukan pemeriksaan apakah percobaan login oleh user sudah mencapai limit.
  if (loginAttempts[email] && loginAttempts[email].count >= 5) {
    // Melakukan pemeriksaan apakah sudah melewati limit waktu 30 menit.
    const elapsedTime = currentTime - loginAttempts[email].timestamp;
    const elapsedMinutes = elapsedTime / (1000 * 60);
    if (elapsedMinutes < 30) {
      throw new Error(
        'Too many failed login attempts. Please try again later.'
      );
    } else {
      // Melakukan rset counter dan waktu percobaan login setelah 30 menit berlalu.
      delete loginAttempts[email];
    }
  }

  // We define default user password here as '<RANDOM_PASSWORD_FILTER>'
  // to handle the case when the user login is invalid. We still want to
  // check the password anyway, so that it prevents the attacker in
  // guessing login credentials by looking at the processing time.
  const userPassword = user ? user.password : '<RANDOM_PASSWORD_FILLER>';
  const passwordChecked = await passwordMatched(password, userPassword);

  // Jika login berhasil.
  if (user && passwordChecked) {
    // Menghapus catatan percobaan login jika ada sebelumnya.
    delete loginAttempts[email];
    return {
      email: user.email,
      name: user.name,
      user_id: user.id,
      token: generateToken(user.email, user.id),
    };
  } else {
    // Jika login gagal, catat percobaan login yang telah dilakukan.
    if (!loginAttempts[email]) {
      loginAttempts[email] = {
        count: 1,
        timestamp: currentTime,
      };
    } else {
      loginAttempts[email].count++;
    }
    throw new Error('Wrong email or password');
  }
}

module.exports = {
  checkLoginCredentials,
};
