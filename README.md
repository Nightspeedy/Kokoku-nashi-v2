# Kokoku Nashi

## Table of contents

<!--ts-->
   * [Command Class](#command)
      * [Constructor](#command-constructor)
      * [Errors](#command-errors)
      * [Success](#command-success)
      * [Arguments](#command-arguments)
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
args: [Discord.Member, Optional(String)],

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
| TIMEOUT(date)           | { message: 'You can't do that yet! Time remaining: XX hours, XX minutes and XX seconds.' }                               |
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
---

<a name="command-arguments">

### Command Arguments

</a>

An array of classes which represent arguments are required to run the command.

#### Usage

```js
args: [Discord.Member, Optional(String)]
```
---

<a name="command-run">

### Command Run

</a>

The function that gets called when a command is executed.

#### Usage
```js
async run ({ message, args, member, guild, color }) {
    const response = `Hello there ${args[0].username}, ${args[1] || 'How are you?'}`
    message.channel.send(response)
}
```