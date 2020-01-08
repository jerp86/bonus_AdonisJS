const Mail = use('Mail');
const Helpers = use('Helpers');

class NewTaskMail {
  // Se esse getter não for fornecido, o padrão será 1.
  // Aumente esse número para aumentar a simultaneidade do processamento.
  static get concurrency() {
    return 1;
  }

  // Isso é necessário. Essa é uma chave exclusiva usada para identificar este trabalho.
  static get key() {
    return 'NewTaskMail-job';
  }

  // É aqui que o trabalho é feito.
  async handle({ email, username, title, file }) {
    console.log(`Job: ${NewTaskMail.key}`);
    await Mail.send(
      ['emails.new_task', 'emails.new_task-text'],
      { username, title, hasAttachment: !!file },
      message => {
        message
          .to(email)
          .from('jerp@rocketseat.com.br', 'Eduardo | Rocketseat')
          .subject('Nova tarefa para você');

        if (file) {
          message.attach(Helpers.tmpPath(`uploads/${file.file}`), {
            filename: file.name,
          });
        }
      }
    );
  }
}

module.exports = NewTaskMail;
