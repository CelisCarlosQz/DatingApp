using System.Collections.Generic;
using System.Linq;
using Api.Models;
using Newtonsoft.Json;

namespace Api.Data
{
    public class DataSeed
    {
        public static void SeedUsers(DataContext dataContext)
        {
            if(!dataContext.Users.Any())
            {
                var userData = System.IO.File.ReadAllText("Data/UserSeedData.json");
                var users = JsonConvert.DeserializeObject<List<Users>>(userData);
                foreach (var user in users)
                {
                    // Generate Hash, Salt - Hardcoded Password
                    byte[] passwordHash, passwordSalt;
                    GeneratePasswordHashSalt("password", out passwordHash, out passwordSalt);

                    user.PasswordHash = passwordHash;
                    user.PasswordSalt = passwordSalt;
                    user.Username = user.Username.ToLower();

                    dataContext.Add(user);
                    
                }
                dataContext.SaveChanges();
            }
        }

        private static void GeneratePasswordHashSalt(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }
    }
}