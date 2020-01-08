# Cooldowns

## Access
On the `bot` object as `bot.cooldowns`

## Cooldown Key
The key is used to identify the cooldown.
Can be whatever but the standardized format is `action-user-optionalID`. Example: `help-215143736114544640` or `loot-215143736114544640-room12`.

## [async] Push
`.push(time, key)`

| Argument | Type   | Usage                                 |
|----------|--------|---------------------------------------|
| time     | Number | Time in MS.                           |
| key      | String | A unique identifier for the cooldown. |

## [async] Get
`.get(key)`

| Argument | Type   | Usage                                 |
|----------|--------|---------------------------------------|
| key      | String | A unique identifier for the cooldown. |

## Examples

### Command Cooldown
If a command passes `cooldownTime` in it's super, it automatically applies a cooldown each run.
Below is a snippet to set a cooldown without passing a fixed value in super.
```js
async run ({ message, args }) {
    await this.cooldown(15000, message.author)
    message.channel.send('Hello')
}
```

### Custom Cooldown
```js
if (await bot.cooldowns.get(`loot-${userID}-${lootRoomID}`)) {
    return 'You can only loot this room every 120 seconds!'
} else {
    await bot.cooldowns.push(120 * 1000, `loot-${userID}-${lootRoomID}`)
    return randomLoot()
}
```