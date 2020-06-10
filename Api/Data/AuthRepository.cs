using System;
using System.Threading.Tasks;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data
{
    public class AuthRepository : IAuthRepository
    {
        private readonly DataContext _dataContext;

        public AuthRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public async Task<Users> Login(string username, string password)
        {

            var user = await _dataContext.Users.FirstOrDefaultAsync(x => x.Username == username);

            if(user == null)
                return null;

            if(!VerifyHashes(password, user.PasswordHash, user.PasswordSalt))
                return null;

            return user;

        }

        private bool VerifyHashes(string password, byte[] passwordHash, byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512(passwordSalt))
            {
                var inputPwdHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
                for (int i = 0; i < inputPwdHash.Length; i++)
                {
                    if(inputPwdHash[i] != passwordHash[i]) return false;
                }
                return true;
            }
        }

        public async Task<Users> Register(Users user, string password)
        {
            byte[] passwordHash, passwordSalt;
            GeneratePasswordHashSalt(password, out passwordHash, out passwordSalt);

            user.PasswordHash = passwordHash;
            user.PasswordSalt = passwordSalt;

            await _dataContext.AddAsync(user);
            await _dataContext.SaveChangesAsync();

            return user;
        }

        private void GeneratePasswordHashSalt(string password, out byte[] passwordHash, out byte[] passwordSalt)
        {
            using(var hmac = new System.Security.Cryptography.HMACSHA512())
            {
                passwordSalt = hmac.Key;
                passwordHash = hmac.ComputeHash(System.Text.Encoding.UTF8.GetBytes(password));
            }
        }

        public async Task<bool> UserExist(string username)
        {
            if(await _dataContext.Users.AnyAsync(x => x.Username == username))
                return true;
            
            return false;
        }
    }
}