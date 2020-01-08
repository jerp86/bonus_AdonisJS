/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class UserController {
  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store({ request }) {
    const data = request.only(['username', 'email', 'password']);

    const user = await User.create(data);

    return user;
  }
}

module.exports = UserController;
