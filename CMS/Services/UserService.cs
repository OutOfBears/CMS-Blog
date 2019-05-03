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

    public class UserService
    {
        private IMongoCollection<User> Users;

        public UserService(IMongoDatabase MongoDB)
        {
            Users = MongoDB.GetCollection<User>("users");
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
    }
}
