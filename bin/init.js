const inquirer = require('inquirer');
const system   = require('../lib/system');
const colors   = require('colors');
const config   = require('../config');

module.exports = () => {
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
      
      try {
        system.Cache(answers.projectNameTrim).setup();

        const payload = {
          path: config.LOCK_PATH,
          contents: JSON.stringify(answers)
        }

        if(!system.FileWriter.create(payload))
            throw new Error(file.err);

        console.log(colors.cyan('Successfully generated .lock file.'));
      } catch(err) {
        console.error(colors.red(err));
      }
    });
}
