using MongoDB.Bson.Serialization.Attributes;
using MongoDB.Bson.Serialization.IdGenerators;
using MongoDB.Driver;

using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace CMS.Services
{
    [BsonIgnoreExtraElements]
    public class Post
    {
        public class Author
        {
            public string id;
            public string username;
        }

        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string _id { get; set; }
        public string title;
        public string content;
        public string thumbnail;
        public int views;
        public Author author;
        public DateTime created_at;
    }

    public class PostsService
    {
        private IMongoCollection<Post> Posts;

        public PostsService(IMongoDatabase MongoDB)
        {
            Posts = MongoDB.GetCollection<Post>("posts");
        }

        public async Task<List<Post>> GetPopularPosts(int limit = 5)
        {
            var sort = Builders<Post>.Sort.Descending("views");

            return (await Posts.FindAsync(Builders<Post>.Filter.Empty,
                new FindOptions<Post>() {Sort = sort})).ToList();
        }

        public async Task<bool> IncrementView(string _id)
        {
            var update = new UpdateDefinitionBuilder<Post>()
                .Inc("views", 1);

            var result = await Posts.UpdateOneAsync(x => x._id == _id,
                update);

            return result.MatchedCount > 0;
        }

        public async Task<Post> GetPost(string _id)
        {
            var result = await Posts.FindAsync(x =>
                x._id == _id);

            var post = result.FirstOrDefault();
            if (post != null && !post.Equals(default(Post)))
                return post;
            return null;
        }

        public async Task<bool> DeletePost(string _id, string authorId)
        {
            var result = await Posts.DeleteOneAsync(x => x._id == _id &&
                x.author.id == authorId);
            return result.DeletedCount > 0;
        }

        public async Task CreatePost(Post post)
        {
            await Posts.InsertOneAsync(post);
        }
    }
}
