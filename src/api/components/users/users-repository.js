const { User } = require('../../../models');

/**
 * Get a list of users
 * @returns {Promise}
 */
async function getUsers() {
  return User.find({});
}

/**
 * Get user detail
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function getUser(id) {
  return User.findById(id);
}

/**
 * Create new user
 * @param {string} name - Name
 * @param {string} email - Email
 * @param {string} password - Hashed password
 * @returns {Promise}
 */
async function createUser(name, email, password) {
  return User.create({
    name,
    email,
    password,
  });
}

/**
 * Update existing user
 * @param {string} id - User ID
 * @param {string} name - Name
 * @param {string} email - Email
 * @returns {Promise}
 */
async function updateUser(id, name, email) {
  return User.updateOne(
    {
      _id: id,
    },
    {
      $set: {
        name,
        email,
      },
    }
  );
}

/**
 * Delete a user
 * @param {string} id - User ID
 * @returns {Promise}
 */
async function deleteUser(id) {
  return User.deleteOne({ _id: id });
}

/**
 * Get user by email to prevent duplicate email
 * @param {string} email - Email
 * @returns {Promise}
 */
async function getUserByEmail(email) {
  return User.findOne({ email });
}

/**
 * Update user password
 * @param {string} id - User ID
 * @param {string} password - New hashed password
 * @returns {Promise}
 */
async function changePassword(id, password) {
  return User.updateOne({ _id: id }, { $set: { password } });
}

//Soal 1: Pagination dan Filter
//Menambahkan filter search dan sort serta pagination
async function getUsersWithPagination(page, perPage, search, sort) {
  const totalUsers = await User.countDocuments(); // Menghitung total user yang ada di database MongoDB

  const query = {}; // Membuat query awal.

  // Jika ada search
  if (search) {
    const searchRegex = new RegExp(search, 'i');
    query.$or = [{ name: searchRegex }, { email: searchRegex }];
  }

  // Mencari user dengan pagination
  const users = await User.find(query)
    .sort({ [sort.field]: sort.order === 'asc' ? 1 : -1 })
    .skip((page - 1) * perPage)
    .limit(perPage);

  const totalPages = Math.ceil(totalUsers / perPage); // Untuk menghitung jumalh total user per page.

  // Melakukan pengembalian sesuai permintaan soal.
  return {
    page_number: page,
    page_size: perPage,
    count: users.length,
    total_pages: totalPages,
    has_previous_page: page > 1,
    has_next_page: page < totalPages,
    data: users,
  };
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  getUserByEmail,
  changePassword,
  getUsersWithPagination, //Filter search dan sort serta Pagination.
};
