# Timed Actions

## Access
On the `main` object as `main.timedActionHandler`
On the `bot` object as `bot.timedActionHandler`

## [async] Push
`.push(type, time, action)`

| Argument | Type   | Usage                                 |
|----------|--------|---------------------------------------|
| type     | String | An action type key.                   |
| time     | Number | Time from now to run in milliseconds. |
| action   | Object | Action parameters.                    |

## Actions

### sendMessage
```
action {
    channel Discord.TextChannel.id
    content String or Object
}
```

### deleteMessage
```
action {
    channel Discord.TextChannel.id
    message Discord.Message.id
}
```

### addRoles
```
action {
    guild Discord.Guild.id
    member Discord.User.id
    roles [Discord.Role.id]
}
```

### removeRoles
```
action {
    guild Discord.Guild.id
    member Discord.User.id
    roles [Discord.Role.id]
}
```

## Examples

### Add a role after 30 seconds
```js
main.timedActionHandler.push('addRoles', 30 * 1000, {
    guild: message.guild.id,
    member: message.author.id,
    roles: ['524627786372218910']
})
```

### Send a message in 6 hours
```js
main.timedActionHandler.push('sendMessage', 6 * 60 * 60 * 1000, {
    channel: message.channel.id,
    content: {
        embed: {
            title: "It's been 6 hours.",
            description: "Remember to do that thing you told me to remember!"
        }
    }
})
```
