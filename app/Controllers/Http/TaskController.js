/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Task = use('App/Models/Task');

/**
 * Resourceful controller for interacting with tasks
 */
class TaskController {
  /**
   * Show a list of all tasks.
   * GET tasks
   */
  async index({ params }) {
    const tasks = await Task.query()
      .where('project_id', params.projects_id)
      .with('user')
      .fetch();

    return tasks;
  }

  /**
   * Create/save a new task.
   * POST tasks
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store({ params, request }) {
    const data = request.only([
      'title',
      'description',
      'user_id',
      'file_id',
      'due_date',
    ]);

    const task = await Task.create({ ...data, project_id: params.projects_id });

    return task;
  }

  /**
   * Display a single task.
   * GET tasks/:id
   */
  async show({ params }) {
    const task = await Task.findOrFail(params.id);

    return task;
  }

  /**
   * Update task details.
   * PUT or PATCH tasks/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update({ params, request }) {
    const task = await Task.findOrFail(params.id);
    const data = request.only([
      'user_id',
      'title',
      'description',
      'due_date',
      'file_id',
    ]);

    task.merge(data);

    await task.save();

    return task;
  }

  /**
   * Delete a task with id.
   * DELETE tasks/:id
   */
  async destroy({ params }) {
    const task = await Task.findOrFail(params.id);

    await task.delete();
  }
}

module.exports = TaskController;
