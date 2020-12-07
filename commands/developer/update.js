const util = require('util');
const {emoji, Discord} = require('../../index');
const config = require('../../config.json')
const shell = require('shelljs');
const { update } = require('../../models/Leaver');

module.exports = {
    commands: 'update',
    expectedArgs: '<eval>',
    permissionError: 'You need admin permissions to run this command',
    minArgs: 0,
    maxArgs: 0,
    callback: async (message, arguments, text, client) => {
        if (!shell.which('git')) {
            shell.echo('Sorry, this script requires git');
            shell.exit(1);
            return
        }

        var updateText = `Cheking For Updates...\n\n`;

        var embed = new Discord.MessageEmbed()
            .setAuthor(`Update`, client.user.displayAvatarURL())
            .setColor(config.color)
            .setDescription(updateText)
            .setTimestamp()
        const m = await message.channel.send(embed)
        const {stdout, stderr, code} = shell.exec('git pull https://github.com/BarPos/OrangeBot.git');
        // if (stderr) {
        //     await message.channel.send(`${stderr.slice(41)}${stdout}`);
        //     return
        // }else{

        updateText = updateText + stdout;

        embed.setDescription(updateText);

        await m.edit(embed)
        if(code !== 0){
            return;
        }
        // }

        updateText = updateText + `\n\nInstalling Dependencies...\n\n`
        const npm = shell.exec('npm i');

        updateText = updateText + `${npm.stdout} ${npm.stderr}\n`

        embed.setDescription(updateText);

        await m.edit(embed)

        if(npm.code !== 0){
            return
        }

        updateText = updateText + `Restarting...`

        embed.setDescription(updateText);

        await m.edit(embed)
        shell.exec('pm2 restart orange');
    },
    //permissions: 'ADMINISTRATOR',
    //requiredRoles: [],
    allowedUsers: '437992463165161472'
  }