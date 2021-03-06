import generateDescription from '../../generators/description/descriptionGenerator';
import generateName from '../../generators/name/nameGenerator';
import generateTitle from '../../generators/title/titleGenerator';
import * as Utils from '../../utils/utils';

export const generate = name => {
  const user = {
    title: generateTitle(),
    name: name,
    posts: Utils.number(),
    url: Utils.tumblrUrl(name),
    updated: Utils.timestamp(),
    description: generateDescription(),
    is_nsfw: Utils.boolean(),
    ask: Utils.boolean(),
    ask_page_title: generateTitle(),
    followed: false,
    likes: Utils.number(),
    is_blocked_from_primary: false,
    share_likes: Utils.boolean(),
    twitter_enabled: Utils.boolean(),
    twitter_send: Utils.boolean(),
    facebook_opengraph_enabled: Utils.setting(),
    tweet: Utils.setting(),
    facebook: Utils.setting(),
    followers: Utils.number(),
    primary: false,
    admin: Utils.boolean(),
    messages: Utils.number(),
    queue: Utils.number(),
    drafts: Utils.number(),
    type: 'public',
    reply_conditions: Utils.number({ min: 0, max: 2 }),
    subscribed: false,
    can_subscribe: false
  };
  if (user.ask) {
    user.ask_anon = Utils.boolean();
  }
  return user;
};

export const generateMany = num => {
  return Utils.populate(new Array(num), generate.bind(this));
}

export const fetch = (name = generateName()) => {
  const response = {
    user: {
      blogs: [generate(name)]
    }
  };
  response.user.blogs.concat(generateMany(Utils.number({ min: 0, max: 5 })));
  response.user.blogs[0].primary = true;
  response.user.blogs[0].admin = true
  return Utils.generateResponse(response);
};
