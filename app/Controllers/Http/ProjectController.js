/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const Project = use('App/Models/Project');
/**
 * Resourceful controller for interacting with projects
 */
class ProjectController {
  /**
   * Show a list of all projects.
   * GET projects
   */
  async index() {
    const projects = await Project.query()
      .with('user')
      .fetch();

    return projects;
  }

  /**
   * Create/save a new project.
   * POST projects
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async store({ request, auth }) {
    const data = request.only(['title', 'description']);

    const project = await Project.create({ ...data, user_id: auth.user.id });

    return project;
  }

  /**
   * Display a single project.
   * GET projects/:id
   */
  async show({ params }) {
    const project = await Project.findByOrFail({ id: params.id });

    await project.load('user');
    await project.load('tasks');

    return project;
  }

  /**
   * Update project details.
   * PUT or PATCH projects/:id
   *
   * @param {object} ctx
   * @param {Request} ctx.request
   */
  async update({ params, request }) {
    const project = await Project.findByOrFail({ id: params.id });
    const data = request.only(['title', 'description']);

    project.merge(data);

    await project.save();

    return project;
  }

  /**
   * Delete a project with id.
   * DELETE projects/:id
   */
  async destroy({ params }) {
    const project = await Project.findByOrFail({ id: params.id });

    await project.delete();
  }
}

module.exports = ProjectController;
