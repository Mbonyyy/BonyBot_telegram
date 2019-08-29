async function me(ctx, gitKeyboard) {
  var aboutData = `*Made with ❤️ by Julien Mbony*\n\nFor Inquiries:  @lostone19\n\nDonate BTC:  *3A37UHJV2fRpBXmR6SCNJ8L5sByniYm8Dw*`;
  ctx.replyWithMarkdown(aboutData,gitKeyboard);
}

module.exports = {
    me
};
