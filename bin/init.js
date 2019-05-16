const inquirer = require('inquirer');
const system   = require('../lib/system');
const colors   = require('colors');
const config   = require('../config');

module.exports = (rootPath) => {
  const questions = [
    { type: 'input', name: 'projectName', message: colors.green('Choose a Project Name') },
    { type: 'input', name: 'description', message: colors.green('A description of the project')},
    { type: 'input', name: 'companyName', message: colors.green('Company Name') },
  ];
  inquirer
    .prompt(questions)
    .then((answers) => {
      if(!answers.projectName) {
        answers.projectName = 'Darwinizer';
      }

      answers.projectNameTrim = answers.projectName.replace(/\s/g, "").trim();
      system.FileWriter.mkdir(system.FileReader.join(config.ROOT_PATH, 'lib/system/cache/' + answers.projectNameTrim));

      try {
        system.FileWriter.create(
          config.LOCK_PATH,
          JSON.stringify(answers)
        );
        console.log('Successfully generated .lock file.');
      } catch(err) {
        console.error(err);
      }
    });
}
