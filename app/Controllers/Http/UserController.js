/** @typedef {import('@adonisjs/framework/src/Request')} Request */

/** @type {import('@adonisjs/lucid/src/Database')} */
const Database = use('Database');

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
    const addresses = request.input('addresses');

    const trx = await Database.beginTransaction();

    const user = await User.create(data, trx);

    await user.addresses().createMany(addresses, trx);

    await trx.commit();

    return user;
  }
}

module.exports = UserController;
