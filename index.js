require('dotenv').load();

const Telegraf = require('telegraf');
const Telegram = require('telegraf/telegram');

const TELEGRAM_TOKEN = process.env.TELEGRAM_TOKEN;
const bot = new Telegraf(TELEGRAM_TOKEN, { username: 'teabreak_uno_bot' });
const telegram = new Telegram(TELEGRAM_TOKEN);

const { games } = require('./game');

bot.start(ctx =>
  ctx.reply('Hi! Add me to a group to play uno with your friends')
);

bot.command('new', async ctx => {
  try {
    console.log(ctx.chat.id);
    games.newGame(ctx.chat.id);
    await ctx.reply('Created a new game!');
  } catch (e) {
    console.log(e);
    await ctx.reply("Cannot create game while there's an ongoing game");
  }
});
bot.command('join', async ctx => {
  console.log(ctx.from);
  games.getGame(ctx.chat.id).addPlayer(ctx.from);
  await ctx.reply(`${ctx.from.first_name} joined the game!`);
});
bot.command('leave', async ctx => {
  console.log(ctx.from);
  games.getGame(ctx.chat.id).removePlayer(ctx.from);
  await ctx.reply(`${ctx.from.first_name} left the game!`);
});
bot.command('begin', async ctx => {
  games.getGame(ctx.chat.id).startGame();
  await ctx.reply(`Game started!`);
});
bot.command('end', async ctx => {
  games.endGame(ctx.chat.id);
  await ctx.reply('Game ended!');
});
bot.on('inline_query', async ctx => {
  await ctx.answerInlineQuery(
    games.getGame(ctx.chat.id).getPlayerCards(ctx.from)
  );
});
// bot.on('message', async ctx => {
//   if (ctx.message.text === 'show_me_deck') {
//     const deck = require('./game/result.json');
//     for (const d of deck) {
//       await ctx.reply(`${d.type}  ${d.color}  ${d.value ? d.value : ''}`);
//       await ctx.replyWithSticker(d.sticker.enabled);
//       await ctx.replyWithSticker(d.sticker.disabled);
//     }
//   }
// });

// bot.hears('@teabreak_uno_bot', ctx => {
//   console.log('hears');
//   console.log('chat', ctx.chat);
//   console.log('message', ctx.message);
//   console.log('channel_post', ctx.channel_post);
// });

// bot.on('channel_post', (ctx) => {
//   console.log('message');
//   console.log('chat', ctx.chat)
//   console.log('message', ctx.message);
//   console.log('channel_post', ctx.channel_post);
// });

bot.startPolling();
