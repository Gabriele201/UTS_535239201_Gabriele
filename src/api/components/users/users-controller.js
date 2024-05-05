const usersService = require('./users-service');
const { errorResponder, errorTypes } = require('../../../core/errors');

/**
 * Handle get list of users request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
//Soal 1: Pagination dan Filter
//Penjelasan mengenai code dibawah akan dijelaskan secara detail di bagian paling bawah.
async function getUsers(request, response, next) {
  try {
    const {
      page_number = 1,
      page_size = 10,
      search = '',
      sort = { field: 'email', order: 'asc' }, // Update default value to an object
    } = request.query;

    const sortObj = typeof sort === 'string' ? parseSortString(sort) : sort;

    const users = await usersService.getUsersWithPagination(
      parseInt(page_number),
      parseInt(page_size),
      search,
      sortObj
    );

    return response.status(200).json(users);
  } catch (error) {
    return next(error);
  }
}

function parseSortString(sortString) {
  const [field, order] = sortString.split(':');
  return { field, order };
}

/**
 * Handle get user detail request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function getUser(request, response, next) {
  try {
    const user = await usersService.getUser(request.params.id);

    if (!user) {
      throw errorResponder(errorTypes.UNPROCESSABLE_ENTITY, 'Unknown user');
    }

    return response.status(200).json(user);
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle create user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function createUser(request, response, next) {
  try {
    const name = request.body.name;
    const email = request.body.email;
    const password = request.body.password;
    const password_confirm = request.body.password_confirm;

    // Check confirmation password
    if (password !== password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.createUser(name, email, password);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to create user'
      );
    }

    return response.status(200).json({ name, email });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle update user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function updateUser(request, response, next) {
  try {
    const id = request.params.id;
    const name = request.body.name;
    const email = request.body.email;

    // Email must be unique
    const emailIsRegistered = await usersService.emailIsRegistered(email);
    if (emailIsRegistered) {
      throw errorResponder(
        errorTypes.EMAIL_ALREADY_TAKEN,
        'Email is already registered'
      );
    }

    const success = await usersService.updateUser(id, name, email);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to update user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle delete user request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function deleteUser(request, response, next) {
  try {
    const id = request.params.id;

    const success = await usersService.deleteUser(id);
    if (!success) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to delete user'
      );
    }

    return response.status(200).json({ id });
  } catch (error) {
    return next(error);
  }
}

/**
 * Handle change user password request
 * @param {object} request - Express request object
 * @param {object} response - Express response object
 * @param {object} next - Express route middlewares
 * @returns {object} Response object or pass an error to the next route
 */
async function changePassword(request, response, next) {
  try {
    // Check password confirmation
    if (request.body.password_new !== request.body.password_confirm) {
      throw errorResponder(
        errorTypes.INVALID_PASSWORD,
        'Password confirmation mismatched'
      );
    }

    // Check old password
    if (
      !(await usersService.checkPassword(
        request.params.id,
        request.body.password_old
      ))
    ) {
      throw errorResponder(errorTypes.INVALID_CREDENTIALS, 'Wrong password');
    }

    const changeSuccess = await usersService.changePassword(
      request.params.id,
      request.body.password_new
    );

    if (!changeSuccess) {
      throw errorResponder(
        errorTypes.UNPROCESSABLE_ENTITY,
        'Failed to change password'
      );
    }

    return response.status(200).json({ id: request.params.id });
  } catch (error) {
    return next(error);
  }
}

// Soal 1: Pagination dan Filter
// Menambahkan filter search dan sort serta pagination
async function getUsersWithPagination(request, response, next) {
  // Mendapatkan parameter dari request yang berupa query
  try {
    const {
      page_number = 1, // Diinisialisasi 1 sebagai default.
      page_size = 10, // Diinisialisasi 10 sebagai default.
      search = '', // Diinisialisasi kosong
      sort = { field: 'email', order: 'asc' }, // Diinisialisasi urutan email secara ascending
    } = request.query;

    // Melakukan pemeriksaan parameter sort adalah string, jika iya maka akan menjadi objek.
    const sortObj = typeof sort === 'string' ? parseSortString(sort) : sort;

    // Melakukan pengambilan data user dengan pagination dan filter.
    const users = await usersService.getUsersWithPagination(
      parseInt(page_number), // Ini halamannya.
      parseInt(page_size), // Ini ukuran banyak user di dalam 1 halamannya.
      search, // Ini search
      sortObj // Ini sort
    );

    // Melakukan pengaturan response atas data yang sudah dipagination.
    const paginationData = {
      page_number: users.page_number, // Halamannya.
      page_size: users.page_size, // Ukuran isi halamannya.
      count: users.count, // Jumlah datanya.
      total_pages: users.total_pages, // Jumlah halaman.
      has_previous_page: users.has_previous_page, // Jumlah halaman sebelumnya.
      has_next_page: users.has_next_page, // Jumlah halaman setelahnya.
      data: users.data, // Datanya.
    };

    // Mengirimkan response data setelah pagination dan filter.
    // Menambahkan catch bila terjadi error.
    return response.status(200).json(paginationData);
  } catch (error) {
    return next(error);
  }
}

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  deleteUser,
  changePassword,
  getUsersWithPagination, //Filter search dan sort serta Pagination.
};
