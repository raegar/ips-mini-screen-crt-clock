const AutoLaunch = require("auto-launch");

const launcher = new AutoLaunch({
  name: "CRT Dashboard",
});

launcher.isEnabled().then((enabled) => {
  if (!enabled) launcher.enable();
});
