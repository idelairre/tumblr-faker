import Generator from '../../../generators/generators';
import * as Utils from '../../../utils/utils';

export const generateBlogInfo = (name = Generator.name.tumblelog()) => {
  const user = {
    title: name,
    posts: Utils.number(),
    updated: Utils.timestamp(),
    description: Generator.description.template(),
    ask: Utils.boolean(),
    likes: Utils.number(),
    is_nsfw: Utils.boolean()
  };
  if (user.ask) {
    user.ask_anon = Utils.boolean();
  }
  return user;
};

export const generateBlogInfos = num => {
  const tumblelogs = [];
  for (let i = 0; i < num; i += 1) {
    tumblelogs.push(generateBlogInfo());
  }
  return tumblelogs;
};

export const fetch = name => {
  const response = {
    blog: generateBlogInfo(name)
  };
  return Utils.generateResponse(response);
};
