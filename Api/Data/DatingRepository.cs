using System.Collections.Generic;
using System.Threading.Tasks;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Data
{
    public class DatingRepository : IDatingRepository
    {
        private readonly DataContext _dataContext;
        public DatingRepository(DataContext dataContext)
        {
            _dataContext = dataContext;
        }

        public void Add<T>(T entity) where T : class // No Async Because It`s Just Storing In Memory
        {
            _dataContext.Add(entity);
        }

        public void Delete<T>(T entity) where T : class
        {
            _dataContext.Remove(entity);
        }

        public async Task<Users> GetUser(int id)
        {
            var user = await _dataContext.Users.Include(x => x.Photos).
                FirstOrDefaultAsync(u => u.Id ==id);
            return user;
        }

        public async Task<IEnumerable<Users>> GetUsers()
        {
            var users = await _dataContext.Users.Include(x => x.Photos).ToListAsync();
            return users;
        }

        public async Task<bool> SaveAll()
        {
            return await _dataContext.SaveChangesAsync() > 0; // 0 Means No Changes To Db
        }
    }
}