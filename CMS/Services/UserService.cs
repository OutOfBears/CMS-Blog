using MongoDB.Bson;
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
    public class User
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string _id { get; set; }
        public string email;
        public string username;
        public string password;
        public DateTime created_at;
    }

    [BsonIgnoreExtraElements]
    public class LimitedUser
    {
        [BsonId(IdGenerator = typeof(StringObjectIdGenerator))]
        public string _id { get; set; }
        public string username;
        public DateTime created_at;
    }

    public class UserService
    {
        private IMongoCollection<User> Users;
        private IMongoCollection<LimitedUser> UsersLimited;

        public UserService(IMongoDatabase MongoDB)
        {
            Users = MongoDB.GetCollection<User>("users");
            UsersLimited = MongoDB.GetCollection<LimitedUser>("users");
        }

        public async Task<User> GetUserById(string id)
        {
            var users = await (await Users.FindAsync(x => x._id == id)).ToListAsync();
            if (users.Count == 1)
                return users.First();

            return null;
        }

        public async Task<User> GetUserByUserOrEmail(string emailOrUsername)
        {
            var users = await (await Users.FindAsync(x => x.email == emailOrUsername
                            || x.username == emailOrUsername)).ToListAsync();

            if (users.Count == 1)
                return users.First();

            return null;
        }

        public async Task CreateUser(User user)
        {
            await Users.InsertOneAsync(user);
        }

        public async Task<long> GetTotalUsers()
        {
            return await UsersLimited.CountDocumentsAsync(
                FilterDefinition<LimitedUser>.Empty
            );
        }
        
        // Limited user API
        public async Task<List<LimitedUser>> GetUsers(int start, int limit)
        {
            var sort = Builders<LimitedUser>.Sort
                .Descending("created_at");

            var result = await UsersLimited.FindAsync(Builders<LimitedUser>.Filter.Empty,
                new FindOptions<LimitedUser>() { Sort = sort, Limit = limit, Skip = start });

            return await result.ToListAsync();
        }

        public async Task<LimitedUser> GetLimitedUserById(string id)
        {
            var users = await (await UsersLimited.FindAsync(x => x._id == id)).ToListAsync();
            if (users.Count == 1)
                return users.First();

            return null;
        }
    }
}
