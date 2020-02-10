# Kokoku Nashi

## Table of contents

<!--ts-->
   * [Command Class](#command)
      * [Constructor](#command-constructor)
      * [Errors](#command-errors)
      * [Success](#command-success)
      * [Run](#command-run)
<!--te-->

---

<a name="command">

## Command

</a>
The base class used for making commands.

Also read: [TYPES](#types), [PERMISSIONS](#permissions) and [Command Arguments](#command-arguments)

<a name="command-constructor">

### Command Constructor

</a>

```js
// The main trigger for the command.
name: 'hello',

// Optional, other triggers.
aliases: ['hi', 'greetings'],

//Optinal, description used in the help command.
description: 'Says hello to you.',

// The type of command, used to group commands in the help command.
type: TYPES.UTILITY,

// The arguments (ordered) to use with this command.
// In this case, a user mention followed by an optional string.
args: '@mention',

// Which permissions are required for this command.
// In this case, only the server owner can use it.
permissions: [PERMISSIONS.OWNER_COMMANDS],

// An instance of the bot automatically passed to all commands.
bot
```
---

<a name="command-errors">

### Command Errors

</a>

Throw an error embed when something goes wrong.

#### Errors

| Errors.js Exports       |  Value                                                                                                         |
|-------------------------|----------------------------------------------------------------------------------------------------------------|
| PERMISSION_DENIED       | { message: 'You do not have permission to excecute this command!' }                                            |
| INVALID_CHANNEL         | { message: 'This channel does not exist!' }                                                                    |
| WELCOME_CHANNEL_INVALID | { message: 'Welcome message channel does not exist!' }                                                         |
| INVALID_ARGUMENTS       | { run: 'k!help {name}' }                                                                                       |
| UNKNOWN_COMMAND         | { message: 'Unknown command!' }                                                                                |
| NO_PERMISSION           | { message: 'Do i have the correct permissions to do this?' }                                                   |
| UNKNOWN_MEMBER          | { message: 'This member does not have a profile!' }                                                            |
| MEMBER_NOT_FOUND        | { message: 'I could not find this person!' }                                                                   |
| TRY_AGAIN               | { message: 'Something went wrong! Please try again. If this error keeps happening, visit our support server' } |
| NEEDS_PREMIUM           | { message: 'This feature requires premium!' }                                                                  |
| BOT_NO_PERMISSION       | { message: 'I don\'t have permission to do this!' }                                                            |
| ROLE_NOT_FOUND          | { message: 'This role does not exist!' }                                                                       |
| INSUFFICIENT_FUNDS      | { message: 'You don\'t have the funds to do this!' }                                                           |
| TIMEOUT(date)           | { message: 'You can't do that yet! Time remaining: XX hours, XX minutes and XX seconds.' }                     |
| OTHER                   | { message: 'Unknown error! It has been sent to my developers for further investigation!' }                     |

#### Usage

```js
return this.error(
    // The type of error to throw. Can also be a custom error object.
    ERRORS.PERMISSION_DENIED,
    // The current message being handled. Args is optional depending on error.
    { message, args }
)
```

---

<a name="command-success">

### Command Success

</a>

Send a success embed to tell the user everything went neato!

#### Usage

```js
return this.success(
    // The title of the success embed.
    'Success!',

    //The description of the status embed.
    'You did it! Congrats!',

    // The current message being handled.
    { message }
)
```
<a name='command-run'>

### Run

</a>

The main function, to be overridden by class extension

#### Usage

```js

const Command = require('@lib/command') // The command file this class extends from.
const TYPES = require('@lib/types')
const ERROR = require('@lib/errors')
const { RichEmbed } = require('discord.js')

module.exports = class extends Command {
  constructor () {
    super({
      name: 'avatar', // The name of the command
      aliases: ['av', 'profileimage'], // The command aliases, this is an array
      description: "Get your avater, or someone else's", // The command description
      type: TYPES.UTILITY, // The type of command, this will put it in a certain category
      args: '[@user]' // Any arguments this command takes
    })
  }

  async run ({ message, args, color }) { // The overridden run function
    const embed = new RichEmbed()
      .setColor(color)

    let user = message.author
    if (args[0]) {
      user = await this.mention(args[0], message)
    }

    if (!user) return this.error(ERROR.MEMBER_NOT_FOUND, { message })

    embed.setTitle(user.tag)
      .setColor(color)
      .setDescription(`Here you go, |[Click me](${user.displayAvatarURL})|`)
      .setImage(user.displayAvatarURL)

    await message.channel.send(embed).catch(e => {})
  }
}

```

#### Types

| Types.js Exports        |  Brief explanation                                                  |
|-------------------------|---------------------------------------------------------------------|
| TYPES.GENERAL           | The general commands, able to be used by anyone                     |
| TYPES.MOD_COMMAND       | Commands that need a specific Kokoku Nashi permission.              |
| TYPES.GUILD_OWNER       | Commands that are only able to be used by the guild owner.          |
| TYPES.BOT_OWNER         | Commands that can only be used by Bot owners                        |
| TYPES.UTILITY           | Utility commands, handy commands that do handy things               |
| TYPES.SOCIAL            | Social commands, things like k!profile, or k!reputation             |
| TYPES.GAMES             | Game commands, these are for text-based games                       |
| TYPES.MUSIC             | Music commands, pretty self explanatory                             |