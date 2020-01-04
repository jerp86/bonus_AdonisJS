const crypto = require('crypto');

const Mail = use('Mail');

/** @type {typeof import('@adonisjs/lucid/src/Lucid/Model')} */
const User = use('App/Models/User');

class ForgotPasswordController {
  async store({ request, response }) {
    try {
      const email = request.input('email');
      const user = await User.findByOrFail('email', email);

      user.token = crypto.randomBytes(10).toString('hex');
      user.token_created_at = new Date();

      await user.save();

      await Mail.send(
        ['emails.forgot_password', 'emails.forgot_password'],
        {
          email,
          token: user.token,
          link: `${request.input('redirect_url')}?token=${user.token}`,
        },
        message => {
          message
            .to(user.email)
            .from('jerp4@hotmail.com', 'Eduardo | Rocketseat')
            .subject('Recuperação de senha');
        }
      );
    } catch (err) {
      return response.status(err.status).send({
        error: {
          message: "Something didn't work out, does this email exist?",
        },
      });
    }
  }
}

module.exports = ForgotPasswordController;
