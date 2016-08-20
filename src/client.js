import Blog from './blog/blog';
import User from './user/user';
import Generator from './generators/generators';
import * as Utils from './utils/utils';

function wrapResponse(data, callback) {
  if (this.returnPromises) {
    if (this.returnErrors) {
      return Promise.reject(Utils.generateError(this.returnErrors));
    }
    return Promise.resolve(data.response);
  }
  if (!callback || typeof callback !== 'function') {
    throw new Error('function expects a callback');
  }
  if (this.returnErrors) {
    callback(Utils.generateError(this.returnErrors));
  } else {
    callback(null, data.response);
  }
}

// TODO: add persistData option, refactor user and blog endpoints to pull from pool of posts generated on creation

class Client {
  constructor({ persistData = false, returnPromises = false, user = false, returnErrors = false } = {}) {
    this.persistData = persistData;
    this.returnErrors = returnErrors;
    this.returnPromises = returnPromises;
    this.user = user;
    if (this.persistData) {
      this.__cache = {
        blogs: {}
      };
      this.__cache.user = new Generator.user({
        posts: 100,
        likes: 50,
        following: 25
      });
    }
  }

  __createBlog(name) {
    return new Generator.blog({
      name,
      followers: Utils.number({ min: 5, max: 40 }),
      posts: Utils.number({ min: 0, max: 40 }),
      likes: Utils.number({ min: 0, max: 50 })
    });
  }

  blogInfo(name, callback) {
    let data;
    if (this.persistData && !this.__cache.blogs[name]) {
      const blog = this.__createBlog(name);
      this.__cache.blogs[name] = blog;
      data = blog.getInfo();
    } else if (this.persistData && this.__cache.blogs[name]) {
      data = this.__cache.blogs[name].getInfo();
    } else {
      data = Blog.info.fetch(name);
    }
    return wrapResponse.call(this, data, callback);
  }

  blogLikes(name, options, callback) {
    let data;
    if (this.persistData && !this.__cache.blogs[name]) {
      const blog = this.__createBlog(name);
      this.__cache.blogs[name] = blog;
      data = blog.getLikes();
    } else if (this.persistData && this.__cache.blogs[name]) {
      data = this.__cache.blogs[name].getLikes();
    } else {
      data = Blog.posts.fetch(name);
    }
    return wrapResponse.call(this, data, callback);
  }

  blogSubmissions(name, options, callback) {

  }

  blogPosts(name, options, callback) {
    if (typeof options === 'function' && !callback) {
      callback = options;
      options = undefined;
    }
    let data;
    if (this.persistData && !this.__cache.blogs[name]) {
      const blog = this.__createBlog(name);
      this.__cache.blogs[name] = blog;
      data = blog.getPosts(options);
    } else if (this.persistData && this.__cache.blogs[name]) {
      data = this.__cache.blogs[name].getPosts(options);
    } else {
      data = Blog.posts.fetch(name, options);
    }
    return wrapResponse.call(this, data, callback);
  }

  blogFollowers(name, options, callback) {
    if (typeof options === 'function' && !callback) {
      callback = options;
      options = undefined;
    }
    let data;
    if (this.persistData && !this.__cache.blogs[name]) {
      const blog = this.__createBlog(name);
      this.__cache.blogs[name] = blog;
      data = blog.getFollowers(options);
    } else if (this.persistData && this.__cache.blogs[name]) {
      data = this.__cache.blogs[name].getFollowers(options);
    } else {
      data = Blog.followers.fetch(options);
    }
    return wrapResponse.call(this, data, callback);
  }

  userInfo(callback) {
    const data = User.info.fetch(this.user);
    return wrapResponse.call(this, data, callback);
  }

  userDashboard(options, callback) {
    if (typeof options === 'function' && !callback) {
      callback = options;
      options = undefined;
    }
    let data;
    if (this.persistData) {
      data = this.__cache.user.getDashboard(options);
    } else {
      data = User.dashboard.fetch(options);
    }
    return wrapResponse.call(this, data, callback);
  }

  userLikes(options, callback) {
    if (typeof options === 'function' && !callback) {
      callback = options;
      options = undefined;
    }
    let data;
    if (this.persistData) {
      data = this.__cache.user.getLikes(options);
    } else {
      data = User.likes.fetch(options)
    }
    return wrapResponse.call(this, data, callback);
  }

  userFollowing(options, callback) {
    if (typeof options === 'function' && !callback) {
      callback = options;
      options = undefined;
    }
    const data = User.following.fetch(options);
    return wrapResponse.call(this, data, callback);
  }
}

export default Client;
