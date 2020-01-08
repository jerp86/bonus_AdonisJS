/** @typedef {import('@adonisjs/framework/src/Request')} Request */
/** @typedef {import('@adonisjs/framework/src/Response')} Response */
/** @typedef {import('@adonisjs/ignitor/src/Helpers')} Helpers */

const File = use('App/Models/File');
const Helpers = use('Helpers');

/**
 * Resourceful controller for interacting with files
 */
class FileController {
  async show({ params, response }) {
    const file = await File.findOrFail(params.id);

    return response.download(Helpers.tmpPath(`uploads/${file.file}`));
  }

  /**
   * Create/save a new file.
   * POST files
   */
  async store({ request, response }) {
    try {
      if (!request.file('file')) {
        return response.status(404).json({ error: 'Please, select your file' });
      }

      const upload = request.file('file', { size: '2mb' });

      const fileName = `${Date.now()}.${upload.subtype}`;

      await upload.move(Helpers.tmpPath('uploads'), {
        name: fileName,
      });

      if (!upload.moved()) throw upload.error();

      const file = await File.create({
        file: fileName,
        name: upload.clientName,
        type: upload.type,
        subtype: upload.subtype,
      });

      return file;
    } catch (err) {
      return response
        .status(err.status)
        .send({ error: { message: 'File upload error' } });
    }
  }
}

module.exports = FileController;
